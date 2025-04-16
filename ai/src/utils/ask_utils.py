from config.open_router_client import client 

def generate_answer(question, transcription_text):
    """Generates an AI response using prompt engineering with transcription context.
    
    This function takes a user question and optionally includes a transcribed text 
    (if available) as context. It then prompts an AI model to generate a concise, 
    professional response.
    """

    # Construct the prompt for the AI model, incorporating transcription context if available
    prompt = f"""
    You are an intelligent assistant. Answer the following question concisely.
    
    Context (if available):
    {transcription_text}
    
    Question:
    {question}
    
    Provide a clear and structured answer in a professional tone.
    """

    try:
        # Send the prompt to the AI model for response generation
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Specify the AI model to use
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that provides clear and concise answers.",
                },
                {"role": "user", "content": prompt},  # Provide the constructed prompt
            ],
            temperature=0.7,  # Control randomness in responses (higher means more creative)
            max_tokens=1000,  # Limit response length
            top_p=0.6,  # Use nucleus sampling for better quality answers
            frequency_penalty=0.7,  # Reduce repeated phrases in the response
        )

        # Print the response for debugging or logging
        print(response)

        # Extract and return the generated response content
        return response.choices[0].message.content

    except Exception as e:
        # Handle any errors that occur during API request and return an error message
        return f"Error generating response: {str(e)}"
