# Hatsu - Anime Streaming Platform

Hatsu is a modern anime streaming platform built with Next.js, featuring a responsive design, real-time data from Anilist GraphQL API, and a user-friendly interface for discovering and watching anime.

## Features

- 🎬 Stream anime episodes with adaptive quality
- 🔍 Advanced search with filters
- 📱 Fully responsive design for all devices
- 🔄 Real-time updates for airing schedules
- 🌙 Dark mode by default
- 🎨 Modern UI with smooth animations

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- Git (optional, for cloning the repository)

## Setup Guide

### 1. Install Node.js and npm

#### Windows and macOS:
1. Download the installer from [Node.js official website](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Verify installation by opening a terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

### 2. Obtain the Project Files

#### If you have the .zip file:
1. Extract the `.zip` file to your preferred location.
2. Open a terminal and navigate to the extracted folder:
   ```bash
   cd path/to/hatsu
   ```

#### If you prefer cloning from GitHub:
1. Clone the Hatsu repository:
   ```bash
   git clone https://github.com/your-username/hatsu.git
   cd hatsu
   ```

### 3. Install Dependencies

Navigate to the project directory and install the required dependencies:
```bash
   npm install
   # or
   yarn install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and add the following:
```
NEXT_PUBLIC_PROXY_URL=https://gogoanime-and-hianime-proxy.vercel.app
```

### 5. Run the Development Server

Start the Next.js development server:
```bash
   npm run dev
   # or
   yarn dev
```
The app should now be running at [http://localhost:3000](http://localhost:3000).

### 6. Build and Deploy

To build the application for production:
```bash
   npm run build
   npm run start
```
For deployment, you can use platforms like Vercel, Netlify, or AWS.

### 7. Optional: Deploy to Vercel

To deploy using Vercel:
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Run the deployment command:
   ```bash
   vercel
   ```
Follow the setup prompts to complete the deployment.

Now, you have successfully set up Hatsu! 🎉

