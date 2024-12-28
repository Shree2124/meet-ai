from flask import Flask, request, jsonify
import os
from pathlib import Path
from transformers import pipeline
from transformers import AutoTokenizer
from transformers import AutoModelForSeq2SeqLM

app = Flask(__name__)


BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / "summaryModel"
MODEL_NAME = "Qiliang/bart-large-cnn-samsum-ChatGPT_v3"  


def load_or_download_model():
    try:
        # Create model directory if it doesn't exist
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        
        # Check if model files exist locally
        if not (MODEL_DIR / "config.json").exists():
            print(f"Downloading model {MODEL_NAME} for  the first time...")
            
            # Download model and tokenizer
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
            
            # Save model and tokenizer to summaryModel folder
            model.save_pretrained(MODEL_DIR)
            tokenizer.save_pretrained(MODEL_DIR)
            
            print("Model downloaded and saved to summaryModel successfully!")
        else:
            print("Loading cached model from summaryModel folder...")
        
        # Create pipeline using local model
        summarizer = pipeline("summarization", model=str(MODEL_DIR))
        return summarizer
    
    except Exception as e:
        print(f"Error loading/downloading model: {e}")
        return None

# Load model when app starts
summarizer = load_or_download_model()
print("Model status:", "Successfully loaded" if summarizer else "Failed to load")


@app.route("/")
def hello():
    return "<h1>Hello From the Flask App</h1>"

@app.route("/summary", methods=["POST"])
def summary():
    try:
        #conversation data
        data = request.get_json(force=True)

        #checking is data exists or not
        if not data or "conversation" not in data:
            return jsonify({"error": "Missing conversation in the request!"}), 402
        
        conversation_text = data["conversation"]

        # validation for conversation text
        if not conversation_text or len(conversation_text.strip()) == 0:
            return jsonify({"error": "Empty conversation text"}), 400
            

        #check if the model is loaded or not 
        if summarizer is None:
            return jsonify({"error": "There is an error while loading the summary model!"}), 500

        # split the long text into the chunks 
        max_chunk_size = 1000
        chunks = [conversation_text[i:i + max_chunk_size] 
                 for i in range(0, len(conversation_text), max_chunk_size)]
        
        
        # Summarize each chunk
        summaries = []
        for chunk in chunks:
            chunk_summary = summarizer(
                chunk,
            )
            summaries.append(chunk_summary[0]['summary_text'])
        
        # Combine all summaries
        final_summary = " ".join(summaries)
        
        return jsonify({
            "summary": final_summary,
            "chunks_processed": len(chunks)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error in the summary request: {str(e)}"}), 500



if __name__ == "__main__":
    app.run(debug=True)

