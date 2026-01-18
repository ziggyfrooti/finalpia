#!/bin/bash

echo "🔥 PIA Mobile - Firebase Setup Helper"
echo "======================================"
echo ""

# Check if .env exists in web project
WEB_ENV="../pia/.env.local"

if [ -f "$WEB_ENV" ]; then
    echo "✅ Found Firebase config in web project!"
    echo ""
    echo "Copying Firebase credentials..."
    
    # Extract Firebase values from web .env.local
    grep "NEXT_PUBLIC_FIREBASE" $WEB_ENV | sed 's/NEXT_PUBLIC_//g' > .env
    
    echo "✅ Firebase credentials copied to .env"
    echo ""
else
    echo "⚠️  Could not find .env.local in web project"
    echo ""
    echo "Please manually add your Firebase credentials to .env file"
    echo "See FIREBASE_SETUP.md for instructions"
    echo ""
fi

echo "Next steps:"
echo "1. Verify .env file has all Firebase credentials"
echo "2. Run: npm run web"
echo "3. Test login functionality"
echo ""
