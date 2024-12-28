import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
// import { pipeline } from "@xenova/transformers";
import path from "path";
import { ApiError } from "../utils/apiError";
import axios from "axios";
import Meeting, { IMeeting } from "../models/meeting.model";
import { ApiResponse } from "../utils/apiResponse";

// const modelPath = path.join(__dirname, '../../../ai/summaryModel');

// let summarizer:any = null

// const loadSummaryModel = async()=>{
//     try {
//         console.log("Loading sumnmarization model....");
//         const transformers =await import('@xenova/transformers')
//         summarizer = await transformers.pipeline('summarization',modelPath)
//         console.log("Model Loaded successfully!");
//         return summarizer
        
//     } catch (error) {
//         console.error("Error Loading model: ",error)
//         return null
//     }
// }
// /* Summary model is loaded */
// loadSummaryModel()

export const generateSummary = asyncHandler(async(req:any, res:Response, next:NextFunction)=>{

    try {
        const {roomId} = req.params

        const meeting :IMeeting|null = await Meeting.findOne({roomId:roomId})

        if(!meeting){
           throw new ApiError(402,"Meeting not found!")
        }

        if(!meeting?.dialogues?.trim()){
            throw new ApiError(402,"Conversation is empty!")
        }
        if (meeting?.fileUrl && meeting?.fileName && meeting?.summary) {
           next()
          }

        // if(!summarizer){
        //    throw new ApiError(500,"Something went wrong while loading the summary model!")
        // }

        // const maxChunkSize = 500
        // const chunks =[]
        //  /* Divides the conversation into chunks */
        // for (let index = 0; index < conversation.length; index+=maxChunkSize) {
        //    chunks.push(conversation.slice(index,index+maxChunkSize))
        // }

        // /*Summarizes each chunk */
        // const summaries = await Promise.all(
        //     chunks.map(async(chunk)=>{
        //         const result = await summarizer(chunk,{
        //             max_length: 130,
        //             min_length: 30,
        //         })
        //         return result[0].summary_text
        //     })
        // )

        // /*Adds each chunks summary */
        // const finalSummary = summaries.join(' ')

        // console.log("Summary: ", finalSummary);
        
        console.log("Request sent!")
        const response = await axios({
            method:'post',
            url:process.env.FLASK_API_URL,
            headers:{
                'Content-Type':'application/json'
            },
            data:{
                conversation:meeting?.dialogues
            }
        })

        // console.log("Response: ", response.data );
        
        req.summary = response.data.summary
        next()

    } catch (error) {
        console.error("Error processing summary:", error);
        throw new ApiError(500,"Something went wrong while generating summary!")
    }

})
