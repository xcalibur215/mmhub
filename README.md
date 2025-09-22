# MM Hub - Real Estate Platform

## Project Description

MM Hub is a comprehensive real estate platform for finding and listing rental properties. Discover thousands of quality rental properties from verified landlords and trusted agents.

## Getting Started

Follow these steps to run the project locally:

### Prerequisites

- Node.js & npm (or Bun) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd mmhub

# Step 3: Install dependencies
bun install
# or
npm install

# Step 4: Start the development server
bun run dev
# or
npm run dev
```

The application will be available at http://localhost:8080

## Development Options

**Local Development**

Clone this repository and work with your preferred IDE. Changes can be pushed back to the main branch.

**GitHub Codespaces**

- Navigate to the main page of your repository
- Click on the "Code" button (green button) near the top right
- Select the "Codespaces" tab
- Click on "New codespace" to launch a new Codespace environment
- Edit files directly within the Codespace and commit your changes

**Direct GitHub Editing**

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right of the file view
- Make your changes and commit them

## Technologies Used

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages/routes
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── assets/        # Static assets
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run build:dev` - Build in development mode
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

## Deployment

Build the project for production:

```sh
bun run build
```

The built files will be in the `dist` directory, ready for deployment to your preferred hosting platform.
