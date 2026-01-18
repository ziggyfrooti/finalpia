@echo off
echo 🔥 PIA Mobile - Firebase Setup Helper
echo ======================================
echo.

REM Check if .env.local exists in web project
set WEB_ENV=..\pia\.env.local

if exist "%WEB_ENV%" (
    echo ✅ Found Firebase config in web project!
    echo.
    echo Copying Firebase credentials...
    
    REM Copy and transform the env variables
    findstr "NEXT_PUBLIC_FIREBASE" "%WEB_ENV%" > temp.txt
    powershell -Command "(Get-Content temp.txt) -replace 'NEXT_PUBLIC_', '' | Set-Content .env"
    del temp.txt
    
    echo ✅ Firebase credentials copied to .env
    echo.
) else (
    echo ⚠️  Could not find .env.local in web project
    echo.
    echo Please manually add your Firebase credentials to .env file
    echo See FIREBASE_SETUP.md for instructions
    echo.
)

echo Next steps:
echo 1. Verify .env file has all Firebase credentials
echo 2. Run: npm run web
echo 3. Test login functionality
echo.
pause
