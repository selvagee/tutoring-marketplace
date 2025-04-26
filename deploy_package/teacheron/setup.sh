#!/bin/bash

# Display welcome message
echo "==========================================="
echo "TeacherOn Application Setup"
echo "==========================================="
echo "This script will help you set up the TeacherOn application locally."
echo

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 18 or newer."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d "v" -f 2 | cut -d "." -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Version 18 or newer is required."
    echo "   Please upgrade your Node.js installation."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo
echo "Installing dependencies... (this may take a few minutes)"
npm install

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "⚠️ Please update the .env file with your database credentials before proceeding."
    echo "   Edit the .env file in your favorite text editor."
    echo
    read -p "Press Enter when you've updated the .env file or Ctrl+C to exit..."
fi

# Start the application
echo
echo "==========================================="
echo "Setup complete! You can now start the application with:"
echo "npm run dev"
echo
echo "The application will be available at http://localhost:5000"
echo "Admin credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo "==========================================="