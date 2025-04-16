from src.config.open_router_client import client
import logging
from collections import Counter
import re

logger = logging.getLogger(__name__)

def extract_speaker_turns_and_word_count(text):
    """
    Extracts the number of times each speaker has spoken and their respective word count.
    Assumes the format: username: message
    """
    # Initialize counters
    speaker_turns = Counter()
    word_count = Counter()

    # Find all lines in the format: username: message
    lines = re.findall(r"^(.*?):\s+(.*)", text, re.MULTILINE)

    for username, message in lines:
        speaker_turns[username] += 1
        word_count[username] += len(message.split())

    return speaker_turns, word_count

def analyze_transcript(transcript):
    """Extracts text from a PDF transcript and processes it using an AI model to generate structured information.
    """

    # Log entry point for debugging
    logger.info("I am in analyze_transcript function")

    prompt = f"""
        You are a helpful assistant. Here is a text Please read the prompt twice so that you understand
        {transcript}
        Note :-Please Do not bold or highlight any text,let the output be normal & properly format the spacing and alignments:
        
        Details of speaker
        
        Please read the transcript twice and identify the Names of speakers, their designations, and company names. You can figure out the names of speakers where available, especially in conversations where greetings like "hi" or "hello" are exchanged. Provide the details in the following format:
        
        Guest 1:
        Designation & Company:
        Guest 2:
        Designation & Company:
        SUMMARY
        
        Provide a combined detailed summary of the utterances from the PDF. The summary should be readable, with each line containing a few words before moving to the next line. Ensure the summary fits one page and is written in a single paragraph. Title the section as "SUMMARY" with a font size of 16.
        Question and Answer
        
        You have a transcription document that includes accurate timestamps for each speaker.
        Transcription is conversation between persons and questions are asked in it.
        Your task is to extract all the questions asked  in the transcription along with its timestamp.
        It is crucial to maintain the original timestamp from the transcription and present it in a consistent format (e.g., HH:MM:SS).
        Instructions:
        Carefully identify the portions of the text where questions are asked.
        Extract the exact timestamp associated with each question as it appears in the transcription.
        Ensure that the extracted timestamps are presented in the format HH:MM:SS.
        Note: you can make use of pattern = r'\(.*?\?): (.*?\?)' to identify the questions. and you can extract answers from transcription.
        Question 1:
        Answer:
        Question 2:
        Answer:
        
        LIST OF COMPANIES
        
        List all the companies discussed in the conversation. Title the section as "LIST OF COMPANIES" with a font size of 16. Ensure to list only the companies mentioned in the PDF also mention one liner about the company and URL of that company.
        Sentiment Over Time
        
        Provide the overall sentiment along with it please provide the statements that supports overall sentiments.
        Also, make separate paragraphs for positive, negative an neutral statements.
        
        Acronyms and Full Forms
        
        List all the acronyms and their full forms relevant to the topic of conversation.
        
        List out all the action items from the transcription with a font size of 16.
        
        *Note Check everything again and provide all the information asked in detail
        please dont write any notes at the end of report generated and remove any "*" or "#" used for highlighting title *
        """
        
    # Log before making the API call
    logger.info("I am just before API call...")

    # Make an API call to process the transcript
    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that provides clear and concise summaries.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=1000,
        top_p=0.6,
        frequency_penalty=0.7,
    )
    
    print("res.choices[0].message.content", res.choices[0].message.content)
    
    # Return AI-generated report and raw transcript text
    return res.choices[0].message.content, transcript
