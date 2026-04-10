# SoftZorg - Healthcare Reporting System Frontend

A modern, user-friendly web application for healthcare organizations to manage facility, medical, and maintenance reports through voice-based and text-based interfaces.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Key Features in Detail](#key-features-in-detail)
- [Authentication](#authentication)
- [Admin Dashboard](#admin-dashboard)
- [Contributing](#contributing)

## ✨ Features

- **Voice-Based Reporting**: File reports using voice input with real-time transcription
- **Interactive Body Map**: Select body locations for medical reports with an intuitive visual interface
- **Multiple Report Types**:
  - Facilitair: Facilities and maintenance issues
  - MIC: Medical/Clinical concerns
  - MIM: Special medical assessments
- **Smart Dashboard**: View all reports with time tracking and status indicators
- **Admin Panel**: Comprehensive overview of all submissions for administrators
- **User Authentication**: Secure login and registration system
- **Report Review**: Review and edit reports before final submission
- **Responsive Design**: Fully responsive UI that works on desktop and mobile devices
- **Real-time Notifications**: Toast notifications for user feedback

## 🛠 Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Radix UI
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Notifications**: Sonner
- **Language**: JavaScript/JSX with TypeScript support
- **Linting**: ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackathon-zorg-systeem-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## 📝 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

### Development Workflow

1. Make changes to files in `src/`
2. The dev server automatically hot-reloads changes
3. Run `npm run lint` to check for code style issues
4. Test thoroughly before committing

## 📁 Project Structure

```
src/
├── pages/                 # Page components (routes)
│   ├── Dashboard.jsx           # Main dashboard showing all reports
│   ├── Login.jsx               # User login page
│   ├── Register.jsx            # User registration page
│   ├── nieuwe-melding.jsx      # Report type selection
│   ├── voiceConversation.jsx   # Voice input and conversation interface
│   ├── reviewReport.jsx        # Report review before submission
│   ├── Overzicht.jsx           # Admin overview
│   └── AdminPanel.jsx          # Admin panel (admin only)
├── components/            # Reusable components
│   ├── Layout.jsx              # Main layout wrapper
│   ├── Navbar.jsx              # Navigation bar
│   ├── BodyMap.jsx             # Interactive body part selector
│   ├── ConversationBubble.jsx  # Chat bubble component
│   ├── VoiceVisualizer.jsx     # Voice input visualization
│   ├── ReportCard.jsx          # Report display card
│   ├── ProtectedRoute.jsx      # Route protection wrapper
│   └── ui/                     # Radix UI base components
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── textarea.jsx
│       ├── alert.tsx
│       └── ...
├── hooks/                 # Custom React hooks
│   └── useSpeech.ts       # Voice input handling
├── styles/                # Global styles
│   ├── index.css
│   ├── theme.css
│   ├── fonts.css
│   └── tailwind.css
├── types.js              # TypeScript type definitions
├── App.jsx               # Main app component with routing
└── main.jsx              # React entry point
```

## 🎯 Key Features in Detail

### Voice Conversation
Users can navigate to a report type and use the voice input feature to describe their issue. The system:
- Captures real-time voice input
- Displays a waveform visualization during recording
- Converts speech to text
- Allows switching between voice and keyboard input
- Manages conversation history in a chat bubble interface

### Body Map Selection
For medical reports, users can:
- Click on body parts to select affected areas
- Select multiple locations
- Visual feedback shows selected areas
- Supports precise anatomical identification (head, arms, legs, organs, etc.)

### Report Types

1. **Facilitair**: For facility maintenance and operational issues
2. **MIC**: Medical/clinical assessments
3. **MIM**: Special medical evaluations

### Admin Panel
Administrators can:
- View all submitted reports
- Track report status
- Review report details
- Manage the reporting system

## 🔐 Authentication

The application includes a complete authentication system:
- **Registration**: New users can create accounts
- **Login**: Existing users authenticate securely
- **Protected Routes**: Certain pages require authentication
- **Admin Routes**: Admin-only areas are protected with additional checks
- **Session Management**: User sessions are maintained across browsing

## 📊 Admin Dashboard

The admin panel provides:
- Overview of all reports submitted
- Filtering and search capabilities
- Report status tracking
- Report details and history
- System management tools

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory and ready for deployment on Vercel, Netlify, or any static hosting service.

## 🎨 Styling

The project uses:
- **Tailwind CSS v4**: Utility-first CSS framework
- **Custom CSS**: Theme customization in `styles/theme.css`
- **Dark Mode Support**: Theme switching capabilities
- **Responsive Design**: Mobile-first approach

## 🐛 Code Quality

Run the linter to check for code issues:
```bash
npm run lint
```

## 📦 Deployment

The project is configured for deployment on Vercel (see `vercel.json`). Simply connect your repository to Vercel for automatic deployments on push.

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code passes ESLint checks (`npm run lint`)
- Components are properly documented
- New features include appropriate error handling
- UI remains responsive and accessible

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Project**: SoftZorg Healthcare Reporting System  
**Role**: Frontend Application  
**Language**: Dutch (UI) with English Documentation
