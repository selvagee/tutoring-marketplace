#!/bin/bash
echo "Initializing database for TeacherOn application..."
echo
echo "This script will create the necessary database tables."
echo "Make sure you have updated your .env file with proper database credentials."
echo
npm run db:push
echo
echo "Database initialization completed!"
echo
echo "Next step: Run ./start_app.sh to start the application"