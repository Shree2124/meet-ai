
# MeetAI

Welcome to **MeetAI** – a transformative solution developed as part of our diploma's major project. MeetAI is designed to revolutionize online meeting experiences by combining artificial intelligence, user-centric design, and efficient backend architecture. With MeetAI, we aim to create a seamless, intelligent meeting experience that minimizes the burden of note-taking, enhances engagement, and improves productivity for remote teams and users worldwide.

## Project Overview

MeetAI was built with the vision of providing a complete toolkit for online meetings, including:

- **AI-Powered Summarization**: Automatically generates and delivers concise summaries of meeting discussions, powered by advanced Natural Language Processing models.
- **Scheduled Meeting Management**: Plan meetings ahead of time, display timers, and auto-update links when the scheduled time arrives.
- **Intuitive Role-Based Controls**: Ensures that only hosts have the ability to end calls for all participants, with built-in checks to manage permissions.
- **OAuth Integration**: Simplifies user login and authentication, allowing secure access through third-party platforms.

## Key Features

- **Automated Meeting Summaries**: Save time with auto-generated summaries of key points discussed, provided by the Hugging Face `Qiliang/bart-large-cnn-samsum-ChatGPT_v3` model for precise and accurate notes.
- **OAuth Integration**: Users can securely log in with Google, Facebook, or other third-party providers, making onboarding and authentication simple and secure.
- **Scheduled Meeting Timer**: Displays a countdown and updates the interface with a "Join Meeting" button when the scheduled time is reached, allowing participants to join seamlessly.
- **Real-Time UI Updates with Next.js**: Dynamic, real-time rendering of meeting status and notifications, making user experience smoother and more interactive.
- **Comprehensive Meeting Management**: Fully integrated with backend services to handle participants, notifications, and role-based permissions efficiently.

## Technologies Used

MeetAI integrates several technologies to ensure a seamless, scalable, and AI-driven meeting experience:

- **Frontend**: Built using Next.js, TypeScript, and React.js for dynamic client-side rendering and a highly interactive user experience.
- **Backend**: Node.js serves as the backbone, managing API routes, meeting logic, and database integrations.
- **Database**: MongoDB for storing user profiles, meeting data, chat messages, and other essential information.
- **AI Model**: Hugging Face’s `Qiliang/bart-large-cnn-samsum-ChatGPT_v3` for high-quality summarization of meeting dialogues.
- **OAuth Authentication**: Secure and convenient login with third-party OAuth providers.
- **Deployment**: Docker and GitHub Actions streamline CI/CD for easy deployment.

## Project Architecture

### Backend

- **Node.js** API that manages user sessions, meeting data, chat functionalities, and scheduling.
- **Socket.io**: Real-time capabilities for chat and meeting interactions.
- **Express.js** for routing and handling HTTP requests.
- **OAuth Integration**: Easily authenticates users via third-party providers, enhancing security and simplifying the login process.
  
### Frontend

- **Next.js** for SSR and efficient routing.
- **React Context API** for managing global state across the application.

## Setup and Installation

To set up MeetAI locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MeetAI-Innovations/meet-ai.git
   cd meet-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file following the `.env.example` format to set up necessary configuration variables (e.g., MongoDB URI, OAuth credentials, API keys).

4. **Run the Application**
   ```bash
   npm run dev
   ```
   This will start the development server on `http://localhost:3000`.

5. **Backend and AI Model Setup**
   Ensure that your AI model API or Flask API for summarization is running and accessible.

## OAuth Integration

To enable OAuth integration in MeetAI:

1. **Set Up OAuth Credentials**: Register your application with your preferred OAuth providers (e.g., Google, Facebook) to obtain `client_id` and `client_secret`.
2. **Configure Redirect URIs**: Define authorized redirect URIs to handle OAuth callback responses.
3. **Update Environment Variables**: Include your OAuth provider credentials in your `.env` file.
4. **Login Flow**: Upon login, users are redirected to the OAuth provider, authenticated, and returned with a secure token to access MeetAI features.

## Contributing

We welcome contributions to enhance MeetAI. Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Make your changes and test them thoroughly.
4. Commit your changes (`git commit -m "Add feature name"`).
5. Push the branch (`git push origin feature-name`).
6. Open a Pull Request with a detailed description.
7. 

