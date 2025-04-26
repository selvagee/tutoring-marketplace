# TeacherOn - Local Installation Guide

This guide will walk you through installing and running the TeacherOn tutoring marketplace application on your local PC.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js (v18 or newer)**
   - Download from [nodejs.org](https://nodejs.org/en/download/)
   - Verify with `node -v` in your terminal/command prompt

2. **PostgreSQL (optional)**
   - Only needed if you want to use a persistent database
   - Download from [postgresql.org/download](https://www.postgresql.org/download/)
   - Create a database for the application

## Installation Steps

### 1. Download and Extract

Download the application using the "Download as zip" option from Replit:
- Click on the three dots menu in the Files panel
- Select "Download as zip"
- Extract the zip file to a folder on your PC

### 2. Set Up Environment

1. Navigate to the extracted folder in your terminal/command prompt
2. Create a `.env` file by copying `.env.example`:
   - On Windows: `copy .env.example .env`
   - On Mac/Linux: `cp .env.example .env`
3. Edit the `.env` file with your database settings (if using PostgreSQL)

### 3. Install Dependencies

Run the installation script for your operating system:
- On Windows: Double-click `local_deploy_scripts/install_dependencies.bat`
- On Mac/Linux: 
  ```
  chmod +x local_deploy_scripts/install_dependencies.sh
  ./local_deploy_scripts/install_dependencies.sh
  ```

Alternatively, run `npm install` directly in your terminal/command prompt.

### 4. Initialize Database (PostgreSQL only)

If you're using PostgreSQL:
```
npm run db:push
```

### 5. Start the Application

Run the start script for your operating system:
- On Windows: Double-click `local_deploy_scripts/start_app.bat`
- On Mac/Linux:
  ```
  chmod +x local_deploy_scripts/start_app.sh
  ./local_deploy_scripts/start_app.sh
  ```

Alternatively, run `npm run dev` directly in your terminal/command prompt.

### 6. Access the Application

Open your browser and go to: [http://localhost:5000](http://localhost:5000)

## Login Credentials

### Admin Access
- Username: `admin`
- Password: `admin123`

### Sample Tutor
- Username: `tutor1`
- Password: `password`

### Sample Student
- Username: `student1`
- Password: `password`

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Edit `.env` file to change the PORT value
   - Or close the application using that port

2. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Verify database credentials in the `.env` file
   - Check that the database exists

3. **Node.js Version Issues**
   - Ensure you're using Node.js v18 or newer
   - Run `node -v` to check your version

4. **Missing Dependencies**
   - Run `npm install` again to ensure all dependencies are installed

5. **Browser Cache Issues**
   - Try opening the application in an incognito/private window
   - Clear your browser cache

### Support

If you encounter any issues, please reach out for support.