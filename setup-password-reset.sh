#!/bin/bash
# Quick setup script for PocketKash password reset feature
# This script helps configure the email setup for password reset functionality

echo "======================================"
echo "PocketKash Password Reset Setup"
echo "======================================"
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "Environment files configured!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your email credentials"
echo "2. Choose your email provider (see EMAIL_PROVIDERS.md)"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: npm run dev"
echo "5. Test: Go to http://localhost:5173/auth and click 'Forgot Password?'"
echo ""
echo "For detailed setup guide, see FORGOT_PASSWORD_SETUP.md"
