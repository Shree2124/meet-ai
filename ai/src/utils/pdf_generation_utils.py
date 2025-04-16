
def parse_sentiment_section(sentiment_text):
    """
    Parse sentiment section text into structured format.
    
    Args:
        sentiment_text (str): The text containing sentiment information
        
    Returns:
        dict: Dictionary with Overall Sentiment and Detailed Sentiment
    """
    result = {
        "Overall Sentiment": "",
        "Detailed Sentiment": ""
    }
    
    # Look for "Overall Sentiment:" pattern
    if "Overall Sentiment:" in sentiment_text:
        overall_start = sentiment_text.find("Overall Sentiment:")
        overall_end = sentiment_text.find("\n", overall_start)
        
        if overall_end == -1:  # If there's no newline after Overall Sentiment
            result["Overall Sentiment"] = sentiment_text[overall_start + len("Overall Sentiment:"):].strip()
            result["Detailed Sentiment"] = ""
        else:
            result["Overall Sentiment"] = sentiment_text[overall_start + len("Overall Sentiment:"):overall_end].strip()
            
            # Find any sentiment statement sections (Positive, Negative, Neutral, etc.)
            remaining_text = sentiment_text[overall_end:].strip()
            
            # Look for any sentiment statements with pattern: "X Statements:"
            sentiment_types = ["Positive", "Negative", "Neutral", "Mixed"]
            found_type = False
            
            for sentiment_type in sentiment_types:
                marker = f"{sentiment_type} Statements:"
                if marker in remaining_text:
                    result["Detailed Sentiment"] = remaining_text
                    found_type = True
                    break
            
            if not found_type:
                result["Detailed Sentiment"] = remaining_text
    else:
        # No explicit "Overall Sentiment:" found
        # Check for sentiment types in the text
        sentiment_types = ["Positive", "Negative", "Neutral", "Mixed"]
        found_type = False
        
        # Try to extract overall sentiment from first sentence or line
        first_line_end = sentiment_text.find("\n")
        first_sentence_end = sentiment_text.find(".")
        
        if first_sentence_end > 0 and (first_line_end == -1 or first_sentence_end < first_line_end):
            result["Overall Sentiment"] = sentiment_text[:first_sentence_end+1].strip()
            result["Detailed Sentiment"] = sentiment_text[first_sentence_end+1:].strip()
        elif first_line_end > 0:
            result["Overall Sentiment"] = sentiment_text[:first_line_end].strip()
            result["Detailed Sentiment"] = sentiment_text[first_line_end+1:].strip()
        else:
            # Default to using the whole text as detailed sentiment
            # Try to extract a sentiment type from the text
            for sentiment_type in sentiment_types:
                if sentiment_type.lower() in sentiment_text.lower():
                    result["Overall Sentiment"] = f"{sentiment_type}"
                    found_type = True
                    break
            
            if not found_type:
                result["Overall Sentiment"] = "Mixed"
            
            result["Detailed Sentiment"] = sentiment_text
    print("result", result)
    return result

def parse_input_to_dict(raw_text):
    """
    Parse the structured text input into a dictionary of sections.
    
    Args:
        raw_text (str): The raw text containing all sections
        
    Returns:
        dict: Dictionary with section names as keys and their content as values
    """
    if isinstance(raw_text, dict):
        # If it's already a dictionary, return it as is
        return raw_text
        
    # Initialize the result dictionary
    sections = {}
    
    # Define section markers/headers - ensure exact matches
    main_sections = [
        "Names & Entities",
        "SUMMARY",
        "Question and Answer",
        "LIST OF COMPANIES",
        "Sentiment Over Time",
        "Acronyms and Full Forms",
        "Action Items"
    ]
    
    # Split the text by double newlines to separate major sections
    parts = raw_text.split("\n\n")
    
    current_section = None
    section_content = []
    
    # Special handling for Names & Entities section
    names_entities = {"Guest Names": "", "Companies": ""}
    
    # Process each part
    for part in parts:
        part = part.strip()
        if not part:
            continue
        
        # Check if this part starts a new main section
        found_section = None
        for section in main_sections:
            if part.startswith(section):
                found_section = section
                break
            
        # Dynamic sentiment section detection
        if not found_section and "sentiment" in part.lower() and part.split()[0].lower() != "overall":
            found_section = "Sentiment Analysis"
        
        if found_section:
            # Save content from previous section before starting new one
            if current_section:
                if current_section == "Names & Entities":
                    sections[current_section] = names_entities
                elif "sentiment" in current_section.lower():
                    # Handle any sentiment section dynamically
                    sentiment_text = "\n".join(section_content)
                    sections[current_section] = parse_sentiment_section(sentiment_text)
                else:
                    sections[current_section] = "\n".join(section_content)
            
            # Start new section
            current_section = found_section
            section_content = []
            
            # Remove the section header from the content
            content_without_header = part[len(found_section):].strip()
            if content_without_header:
                section_content.append(content_without_header)
        else:
            # This is content for the current section
            if current_section == "Names & Entities":
                if part.startswith("Guest 1:") or part.startswith("Guest 2:"):
                    # This is guest information
                    if names_entities["Guest Names"]:
                        names_entities["Guest Names"] += "\n" + part
                    else:
                        names_entities["Guest Names"] = part
                elif "Company" in part and not part.startswith("LIST OF"):
                    # This is likely part of guest designation
                    if names_entities["Guest Names"]:
                        names_entities["Guest Names"] += "\n" + part
                elif "Tech Company" in part or ((" - " in part) and not part.startswith("LIST OF")):
                    # This is company information
                    if names_entities["Companies"]:
                        names_entities["Companies"] += "\n" + part
                    else:
                        names_entities["Companies"] = part
            else:
                section_content.append(part)
    
    # Add the last section
    if current_section:
        if current_section == "Names & Entities":
            sections[current_section] = names_entities
        elif "sentiment" in current_section.lower():
            # Handle any sentiment section dynamically
            sentiment_text = "\n".join(section_content)
            sections[current_section] = parse_sentiment_section(sentiment_text)
        else:
            sections[current_section] = "\n".join(section_content)
    
    # Handle special case if Names & Entities wasn't found in the sections
    if "Names & Entities" not in sections and (
        "Guest 1:" in raw_text or "Guest 2:" in raw_text
    ):
        # Extract guest names and companies
        guest_names = []
        companies = []
        
        for part in parts:
            if part.startswith("Guest 1:") or part.startswith("Guest 2:"):
                guest_names.append(part)
            elif "Designation & Company:" in part:
                # This is likely part of guest designation
                if guest_names:  # Append to the last guest entry
                    guest_names[-1] += "\n" + part
            elif "Tech Company" in part or (" - " in part and "LIST OF COMPANIES" in part):
                companies.append(part.replace("LIST OF COMPANIES", "").strip())
        
        sections["Names & Entities"] = {
            "Guest Names": "\n".join(guest_names),
            "Companies": "\n".join(companies)
        }
    
    # Check for any sentiment-related content that may have been missed
    for key in list(sections.keys()):
        content = sections[key]
        if isinstance(content, str) and "sentiment" in content.lower():
            if "overall sentiment:" in content.lower():
                sections[key] = parse_sentiment_section(content)
    
    print("dict contents:", sections)
    return sections
