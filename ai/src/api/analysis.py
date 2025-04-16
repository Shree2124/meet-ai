import base64
import io
import os
from flask import Blueprint, Response, request, jsonify, send_file
from src.utils.ask_utils import generate_answer
from src.utils.analysis_utils import (
    extract_speaker_turns_and_word_count,
    analyze_transcript,
)
from src.utils.pdf_generation_utils import parse_input_to_dict
from src.utils.visual_utils import create_visualization_plots
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors


app = Blueprint("audio", __name__)


@app.route("/ask", methods=["POST"])
def ask():
    """API route to handle question answering with transcription data."""
    data = request.get_json()
    question = data.get("question")
    transcription_text = data.get("transcription_text", "")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    answer = generate_answer(question, transcription_text)

    return jsonify({"question": question, "answer": answer})

@app.route("/analyze", methods=["POST"])
def analyze():
    print("/analyze")
    data = request.get_json()
    transcription = data.get("transcription", "")
    summary, _ = analyze_transcript(transcription)
    if isinstance(summary, (list, tuple)) and len(summary) > 0:
        summary_to_send = summary[0]
    elif isinstance(summary, str):
        summary_to_send = summary
    else:
        summary_to_send = "" 

    return jsonify(
        {
            "transcription": transcription,
            "summary": summary_to_send,
        }
    )

@app.route("/generate-pdf", methods=["POST"])
def generate_pdf():
    """
    Generate a professionally styled PDF report from transcript analysis data.
    
    Expected POST data:
    - sections: Structured data containing analysis results
    - transcription: Full transcript text
    
    Returns:
        PDF file as attachment
    """    
    # Get data from request
    data = request.json
    sections = data.get("sections", {})
    transcription = data.get("transcription", "") or data.get("trascription", "")  # Handle both spellings
    
    # Parse sections if it's a string
    sections = parse_input_to_dict(sections)
    
    # Generate visualizations based on transcript
    visualizations = []
    
    if transcription:
        try:
            speaker_turn_count, total_word_count = extract_speaker_turns_and_word_count(
                transcription
            )
            
            # Create visualization plots
            turn_count_plot, word_count_plot = create_visualization_plots(
                speaker_turn_count, total_word_count
            )
            
            visualizations.append(turn_count_plot)
            visualizations.append(word_count_plot)
        except Exception as e:
            # Log the error but continue with PDF creation
            print(f"Error generating visualizations: {str(e)}")
    
    # Create PDF in memory with better margins
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, 
                        pagesize=letter, 
                        leftMargin=50, 
                        rightMargin=50, 
                        topMargin=50, 
                        bottomMargin=50)
    
    # Get standard styles
    styles = getSampleStyleSheet()
    
    # Create professional style set
    # Title style - elegant, professional
    title_style = ParagraphStyle(
        name='CustomTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=28,
        spaceAfter=16,
        alignment=1,  # Center
        textColor=colors.HexColor('#2c3e50')  # Dark blue-gray
    )
    
    # Main heading style
    heading1_style = ParagraphStyle(
        name='CustomHeading1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        spaceBefore=12,
        spaceAfter=8,
        textColor=colors.HexColor('#34495e'),  # Slightly lighter blue-gray
        borderWidth=0,
        borderPadding=0,
        borderColor=None,
        backColor=None
    )
    
    # Subheading style
    heading2_style = ParagraphStyle(
        name='CustomHeading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        spaceBefore=8,
        spaceAfter=6,
        leftIndent=8,
        textColor=colors.HexColor('#3498db')  # Blue
    )
    
    # Normal text style
    normal_style = ParagraphStyle(
        name='CustomNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        spaceBefore=4,
        spaceAfter=4,
        alignment=0  # Left alignment
    )
    
    # Style for important text (like key insights or action items)
    emphasis_style = ParagraphStyle(
        name='CustomEmphasis',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        spaceBefore=4,
        spaceAfter=4,
        textColor=colors.HexColor('#e74c3c')  # Red for emphasis
    )
    
    # Start building the document
    story = []
    
    # Add title
    story.append(Paragraph("Meeting Summary Report", title_style))
    story.append(Spacer(1, 16))
    
    # Add Names & Entities section first
    if "Names & Entities" in sections:
        story.append(Paragraph("Names & Entities", heading1_style))
        story.append(Spacer(1, 8))
        
        # Add Guest Names
        if isinstance(sections["Names & Entities"], dict):
            if "Guest Names" in sections["Names & Entities"]:
                story.append(Paragraph("Guest Names", heading2_style))
                guest_names = sections["Names & Entities"]["Guest Names"].split("\n")
                
                # Create data for table
                guest_data = []
                for name in guest_names:
                    if name.strip():
                        guest_data.append([Paragraph(name, normal_style)])
                
                if guest_data:
                    # Create table for better formatting
                    guests_table = Table(guest_data, colWidths=[450])
                    guests_table.setStyle(TableStyle([
                        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.white),
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8f9fa')),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                        ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(guests_table)
                
                story.append(Spacer(1, 10))
            
            # Add Companies from Names & Entities section
            if "Companies" in sections["Names & Entities"]:
                story.append(Paragraph("Companies", heading2_style))
                companies = sections["Names & Entities"]["Companies"].split("\n")
                
                # Create data for table
                company_data = []
                for company in companies:
                    if company.strip():
                        company_data.append([Paragraph(company, normal_style)])
                
                if company_data:
                    # Create table for better formatting
                    companies_table = Table(company_data, colWidths=[450])
                    companies_table.setStyle(TableStyle([
                        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.white),
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8f9fa')),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                        ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(companies_table)
                
                story.append(Spacer(1, 12))
        
        # Remove Names & Entities from sections to avoid duplicate processing
        del sections["Names & Entities"]
    
    # Process remaining sections
    for section_name, section_content in sections.items():
        # Skip empty sections
        if not section_content:
            continue
            
        # Add section title with a horizontal rule effect
        story.append(Paragraph(section_name, heading1_style))
        story.append(Spacer(1, 2))
        
        # Add a divider line
        story.append(Paragraph('<hr width="100%" color="#e0e0e0" size="1"/>', normal_style))
        story.append(Spacer(1, 8))
        
        # Add section content
        if isinstance(section_content, dict):
            # Handle nested sections
            for subsection, content in section_content.items():
                if content:
                    story.append(Paragraph(subsection, heading2_style))
                    paragraphs = content.split("\n")
                    
                    # Handle special sections
                    if section_name == "Action Items":
                        for para in paragraphs:
                            if para.strip():
                                # Use emphasis style for action items
                                story.append(Paragraph(para, emphasis_style))
                    else:
                        for para in paragraphs:
                            if para.strip():
                                story.append(Paragraph(para, normal_style))
                    
                    story.append(Spacer(1, 8))
        else:
            # Handle special sections
            if section_name == "SUMMARY":
                # Make summary stand out with a light background
                summary_style = ParagraphStyle(
                    name='SummaryStyle',
                    parent=normal_style,
                    backColor=colors.HexColor('#f8f9fa'),
                    borderWidth=1,
                    borderColor=colors.HexColor('#e0e0e0'),
                    borderPadding=8,
                    borderRadius=5
                )
                
                story.append(Paragraph(section_content, summary_style))
            elif section_name == "Action Items":
                # Split by lines and emphasize action items
                paragraphs = section_content.split("\n")
                for para in paragraphs:
                    if para.strip():
                        story.append(Paragraph(para, emphasis_style))
            else:
                # Handle regular sections
                paragraphs = section_content.split("\n")
                for para in paragraphs:
                    if para.strip():
                        story.append(Paragraph(para, normal_style))
        
        story.append(Spacer(1, 12))
    
    # Add visualizations if available
    if visualizations:
        story.append(Paragraph("Visualizations", heading1_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph('<hr width="100%" color="#e0e0e0" size="1"/>', normal_style))
        story.append(Spacer(1, 8))
        
        for viz_base64 in visualizations:
            try:
                # Decode base64 image
                image_bytes = base64.b64decode(viz_base64)
                image_stream = io.BytesIO(image_bytes)
                
                # Add image to PDF with better positioning
                img = Image(image_stream)
                img.drawHeight = 3 * inch
                img.drawWidth = 5 * inch
                
                # Center the image
                img.hAlign = 'CENTER'
                
                story.append(img)
                story.append(Spacer(1, 16))
            except Exception as e:
                # Log error but continue building PDF
                print(f"Error adding visualization: {str(e)}")
    
    # Add full transcription at the end
    if transcription:
        story.append(Paragraph("Full Transcription", heading1_style))
        story.append(Spacer(1, 2))
        story.append(Paragraph('<hr width="100%" color="#e0e0e0" size="1"/>', normal_style))
        story.append(Spacer(1, 8))
        
        # Create a distinct style for transcription text
        transcript_style = ParagraphStyle(
            name='TranscriptStyle',
            parent=normal_style,
            fontSize=10,
            leading=13,
            textColor=colors.HexColor('#555555'),
            firstLineIndent=0
        )
        
        # Split transcription into paragraphs
        transcription_paragraphs = transcription.split("\n")
        for para in transcription_paragraphs:
            if para.strip():
                story.append(Paragraph(para, transcript_style))
    
    # Build PDF
    try:
        doc.build(story)
    except Exception as e:
        return jsonify({"error": f"Failed to build PDF: {str(e)}"}), 500
    
    
    # Move buffer pointer to beginning
    buffer.seek(0)
    
    # Send file
    return send_file(
        buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="meeting_summary.pdf",
    )