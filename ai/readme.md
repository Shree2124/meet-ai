

# Flask Backend Setup for Summarization Task

Follow these steps to set up and run the Flask backend for the summarization task:

## Prerequisites

Make sure you have Python installed on your machine. You can download it from [python.org](https://www.python.org/downloads/).

## Steps to Run the Flask Backend

### Step 1: Create a Virtual Environment

Open your terminal and run the following command to create a virtual environment:

```bash
python -m venv .venv
```

### Step 2: Activate the Virtual Environment

Depending on your operating system, use one of the following commands to activate the virtual environment:

- **For Windows:**

  ```bash
  .venv\Scripts\activate
  ```

- **For BASH :**

  ```bash
  source .venv/Scripts/activate
  ```

### Step 3: Install Required Packages

After activating the virtual environment, install the necessary packages listed in `requirements.txt` by running:

```bash
pip install -r requirements.txt
```

### Step 4: Run the Flask Application

Change your terminal's location to the `src` folder and run the following command to start the Flask application:

```bash
flask --app app run --port=5001
```

### Note on Model Download

- The first time you run the application, it will download the model, which requires approximately **1.7 GB** of space.
- After the initial download, the model will not need to be downloaded again for subsequent runs.

## Summary

By following these steps, you will successfully set up and run the backend APIs for the summarization task. If you encounter any issues, please check the console for error messages and ensure all steps were followed correctly.

