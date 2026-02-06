# Uplas Frontend

Modern React-based frontend for the Uplas AI Learning Platform.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **React Hook Form** - Form handling
- **i18next** - Internationalization
- **Axios** - API client
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/      # Reusable components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   └── AuthSection.jsx
├── pages/           # Page components
│   ├── HomePage.jsx
│   ├── CoursesPage.jsx
│   ├── PricingPage.jsx
│   └── ...
├── store/           # Zustand stores
│   ├── authStore.js
│   └── themeStore.js
├── lib/             # Utilities
│   ├── api.js
│   └── utils.js
├── i18n.js          # Translations
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Build

```bash
npm run build
# Deploy the `dist` folder to any static hosting
```

## Features

- 🌙 Dark/Light mode
- 🌍 Multi-language support (i18n)
- 💱 Multi-currency display
- 📱 Fully responsive
- 🔐 JWT authentication
- 🎨 Modern UI with TailwindCSS

## License

Proprietary - Uplas EdTech Solutions Ltd.
