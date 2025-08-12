# Vite-Rolldown Core

A modern React application built with Vite (using Rolldown bundler) and TypeScript, featuring comprehensive testing setup and development tooling.

[![CI - Build, Test, and Deploy](https://github.com/JesseKoldewijn/vite-rolldown-core/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/JesseKoldewijn/vite-rolldown-core/actions/workflows/build-and-test.yml)
[![License](https://img.shields.io/badge/license-MIT-brightgreen)](/LICENCE)

## Features

- ⚡️ **Vite + Rolldown** - Ultra-fast build tool with Rolldown bundler
- ⚛️ **React 19** - Latest React with TypeScript support
- 🎨 **Tailwind CSS v4** - Modern utility-first CSS framework
- 🧪 **Vitest** - Fast unit testing with coverage reports
- 📦 **pnpm** - Efficient package management
- 🔧 **ESLint + Prettier** - Code linting and formatting
- 🏗️ **TypeScript** - Type-safe development

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite (with Rolldown bundler)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- pnpm

### Installation

```bash
# Clone the repository
git clone git@github.com:JesseKoldewijn/vite-rolldown-core.git
cd vite-rolldown-core

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate test coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm fmt
```

### Building

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── counter/        # Counter component with tests
├── styles/             # Global styles
└── App.tsx             # Main application component

test/                   # Test files
└── components/         # Component tests

public/                 # Static assets
```

## Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `test` - Run tests once
- `test:watch` - Run tests in watch mode
- `test:ui` - Run tests with Vitest UI
- `test:coverage` - Generate test coverage report
- `lint` - Lint code with ESLint
- `fmt` - Format code with Prettier

## License

[MIT](/LICENCE)
