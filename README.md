# PerplexaCare

PerplexaCare is an AI-powered healthcare web application that provides trusted medical insights, symptom analysis, and personalized health guidance. Built with a focus on privacy, accuracy, and user experience, PerplexaCare leverages advanced AI (powered by Perplexity Sonar) to help users make informed decisions about their health.

## Features

- **AI Health Assistant**: 24/7 instant answers to your health questions.
- **Smart Symptom Analysis**: Advanced AI analyzes your symptoms using data from trusted medical sources.
- **Personalized Care**: Tailored health recommendations based on your unique profile and medical history.
- **Verified Medical Knowledge**: Information sourced from Mayo Clinic, WebMD, NIH, CDC, and more.
- **Privacy-Focused**: Your health data is protected with enterprise-grade security and strict privacy policies.
- **Natural Conversation**: Interact with the AI just like you would with a doctor.
- **Beautiful, Modern UI**: Smooth animations, gradients, and a professional design system.

## How It Works

1. **Ask Your Health Question**: Type your health-related question in natural language.
2. **AI Searches Trusted Sources**: Perplexity Sonar technology analyzes information from verified medical websites and journals.
3. **Get Personalized Insights**: Receive clear, accurate answers tailored to your query, with sources cited for reference.


## Agent Workflow


![perplexity-final](https://github.com/user-attachments/assets/8987e7e7-87c4-4d75-95f5-daf55766bee3)


## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Create a `.env.local` file in the root directory and fill in the following environment variables with your own values:
   ```env
   # OpenAI & Perplexity
   OPENAI_API_KEY=your-openai-api-key
   PERPLEXITY_API_KEY=your-perplexity-api-key
   EXAMPLE_BASE_URL=https://your-base-url.com
   EXAMPLE_MODEL_NAME=your-model-name
   NEXT_PUBLIC_HEALTH_AGENT_API=https://your-health-agent-api.com

   # Firebase (Client)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

   # Firebase (Admin/Server)
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   ```
   > **Note:** Replace all placeholder values (e.g., `your-openai-api-key`) with your actual credentials.

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## About the Creator

Created by [Ritesh Hiremath](https://riteshhiremath.com) — reach out at riteshhiremath6@gmail.com.

## Disclaimer

PerplexaCare provides general health information and should not replace professional medical advice. Always consult with healthcare professionals for medical concerns.
