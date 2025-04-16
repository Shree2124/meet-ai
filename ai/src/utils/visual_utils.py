import base64
import io
from matplotlib import pyplot as plt

def create_visualization_plots(speaker_turns, word_count):
    """
    Creates visualization plots based on speaker statistics.
    
    Args:
        speaker_turns (Counter): Counter of speaker turn counts
        word_count (Counter): Counter of word counts by speaker
        
    Returns:
        tuple: (base64 encoded turn count plot, base64 encoded word count plot)
    """
    
    print("speaker turn", speaker_turns, "word count", word_count)
    # If no data, return empty strings
    if not speaker_turns or not word_count:
        return "", ""
    
    # Turn count visualization
    plt.figure(figsize=(8, 5))
    speakers = list(speaker_turns.keys())
    turns = list(speaker_turns.values())
    
    if not speakers or not turns:
        return "", ""
    
    plt.bar(speakers, turns, color='skyblue')
    plt.title('Number of Speaking Turns by Participant')
    plt.xlabel('Participant')
    plt.ylabel('Number of Turns')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    # Convert plot to base64 string
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    turn_count_plot = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    
    # Word count visualization
    plt.figure(figsize=(8, 5))
    speakers = list(word_count.keys())
    counts = list(word_count.values())
    
    plt.bar(speakers, counts, color='lightgreen')
    plt.title('Word Count by Participant')
    plt.xlabel('Participant')
    plt.ylabel('Word Count')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    # Convert plot to base64 string
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    word_count_plot = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    
    return turn_count_plot, word_count_plot