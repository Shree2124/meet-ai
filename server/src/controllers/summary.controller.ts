import { Response } from "express";
import Meeting, { IMeeting } from "../models/meeting.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError";
// import { promises as fs } from "fs";
import fs from "fs";
import { writeFile } from "fs/promises";
import { Document, Packer, Paragraph, TextRun } from "docx";
import path from "path";
import uploadOnCloudinary from "../utils/cloudinary";
import axios from "axios";

const addDialogue = asyncHandler(async (req: any, res: Response) => {
  const { dialogue, meetingId } = req.body;
  if (!dialogue || !meetingId) {
    throw new ApiError(400, "Dialogue or meeting id is missing!");
  }
  // if (!isValidObjectId(meetingId)) {
  //   throw new ApiError(400, "Invalid meeting id!");
  // }

  const meeting: any = await Meeting.findOne({ roomId: meetingId });
  if (!meeting) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Meeting not found"));
  }
  if (!meeting.dialogues || meeting.dialogues === "") {
    meeting.dialogues = dialogue;
  } else {
    meeting.dialogues += `\n${dialogue}`;
  }
  await meeting.save();

  return res
    .status(200)
    .json(new ApiResponse(200, meeting, "Dialogue appended successfully"));
});

const generateSummaryFile = asyncHandler(async (req: any, res: Response) => {
  // console.log(req?.summary);

  const { roomId } = req.params;
  const meeting: IMeeting | null = await Meeting.findOne({ roomId: roomId });

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }



  if (meeting?.fileUrl && meeting?.fileName && meeting?.summary) {
    return res.json(
      new ApiResponse(200, meeting, "Summary file already exists!")
    );
  }

 
    meeting.summary = req?.summary

    await meeting?.save();


  if (meeting?.enableSummary) {
    console.log("Into the file creation block");
    
    const dirPath = path.join(__dirname, "../../public/temp");
    const filePath = path.join(
      dirPath,
      `${meeting?.title} ${new Date().getTime()}.docx`
    );
    // const content = "This is the content of the file.";

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Title",
                  bold: true,
                  size: 32,
                  underline: {},
                  color: "2F5597", // Dark blue color
                }),
              ],
              spacing: { after: 300 }, // Space after the title
            }),
            new Paragraph({
              text: meeting?.title || "Untitled Meeting",
              spacing: { after: 200 },
            }),
    
            // Description Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Description:",
                  bold: true,
                  size: 28,
                  underline: {},
                  color: "2F5597",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: meeting?.description || "No description provided.",
              indent: { left: 300 },
              spacing: { after: 300 },
            }),
    
            // Summary Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Summary:",
                  bold: true,
                  size: 28,
                  underline: {},
                  color: "2F5597",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: req?.summary || "No summary available.",
              indent: { left: 300 },
              spacing: { after: 300 },
            }),
    
            // Participants Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Participants:",
                  bold: true,
                  size: 28,
                  underline: {},
                  color: "2F5597",
                }),
              ],
              spacing: { after: 200 },
            }),
            ...(meeting?.participants?.length
              ? meeting.participants.map((participant) =>
                  new Paragraph({
                    text: typeof participant === "string" ? `• ${participant}` : `• ${participant.userName}`,
                    indent: { left: 300 },
                    spacing: { after: 100 },
                  })
                )
              : [new Paragraph({ text: "No participants listed." })]),
    
            // Ending Text Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Thank you for reviewing this document.",
                  bold: true,
                  size: 26,
                  color: "2F5597",
                }),
              ],
              alignment: "center", // Center align the ending text
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "End of Document",
                  italics: true,
                  color: "999999", // Light grey color for "End of Document" text
                  size: 24,
                }),
              ],
              alignment:"center",
            }),
          ],
        },
      ],
    });
    
    

    // await fs.mkdir(dirPath, { recursive: true });

    // await fs.writeFile(filePath, content, "utf-8");

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filePath, buffer);

    try {
      const cloudinaryResult = await uploadOnCloudinary(filePath);
      meeting.fileUrl = cloudinaryResult?.url;
      meeting.fileName = cloudinaryResult?.public_id;
      meeting.summary = req?.summary;
      await meeting?.save();

      console.log("File is created and saved succesfully!");
      
      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            meeting,
            "File created and uploaded successfully"
          )
        );
    } catch (error) {
      throw new ApiError(500, "File upload failed");
    }
  } else {
    throw new ApiError(404, "Summarize meeting not enabled");
  }
});

const enableSummary = asyncHandler(async (req: any, res: Response) => {
  const { roomId } = req.params;
  const meeting: IMeeting | any = await Meeting.findOne({ roomId: roomId });
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }
  meeting.enableSummary = true;
  meeting.save();
  return res
    .status(200)
    .json(new ApiResponse(201, "Summary enabled successfully"));
});

const generateSummaryFile2 = asyncHandler(async (req: any, res: Response) => {
  const { roomId } = req.params;
  const meeting: IMeeting | null = await Meeting.findOne({ roomId: roomId });

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  // if (meeting?.fileUrl && meeting?.fileName) {
  //   return res.json(
  //     new ApiResponse(200, meeting, "Summary file already exists!")
  //   );
  // }

  // First, make a request to analyze the transcript
  try {
    const analyzeResponse = await axios.post("http://127.0.0.1:5001/api/analyze", {
      transcription: meeting?.dialogues
    });

    // Save the summary from analysis
    meeting.summary = analyzeResponse.data.summary;
    await meeting.save();

    if (meeting?.enableSummary) {
      console.log("Into the file creation block");
      
      const dirPath = path.join(__dirname, "../../public/temp");
      fs.mkdirSync(dirPath, { recursive: true }); // Ensure directory exists
      
      const filePath = path.join(
        dirPath,
        `${meeting?.title.replace(/[^\w\s]/gi, '')}_${new Date().getTime()}.pdf`
      );

      // Now generate the PDF by calling the generate-pdf endpoint
      const pdfResponse = await axios.post("http://127.0.0.1:5001/api/generate-pdf", {
        sections: meeting.summary,
        transcription: meeting?.dialogues
      }, {
        responseType: 'arraybuffer' // Important to handle PDF binary data
      });

      // Write the PDF to file
      fs.writeFileSync(filePath, pdfResponse.data);

      // Upload to Cloudinary
      const cloudinaryResult = await uploadOnCloudinary(filePath);
      
      // Update meeting with file info
      meeting.fileUrl = cloudinaryResult?.url;
      meeting.fileName = cloudinaryResult?.public_id;
      await meeting.save();

      console.log("File is created and saved successfully!");
      
      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            meeting,
            "File created and uploaded successfully"
          )
        );
    } else {
      throw new ApiError(404, "Summarize meeting not enabled");
    }
  } catch (error) {
    console.error("Error in generate summary:", error);
    throw new ApiError(500, "Summary generation or file upload failed");
  }
});

export { addDialogue, generateSummaryFile, enableSummary, generateSummaryFile2 };
