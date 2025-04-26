# TeacherOn - Tutoring Marketplace

A comprehensive tutoring marketplace platform that connects students with qualified tutors, facilitating job posting, bidding, messaging, and reviews.

## Features

- User authentication and profiles (students, tutors, admins)
- Job posting and bidding system
- Real-time messaging between students and tutors
- Reviews and ratings
- Admin panel for user management
- Advanced search and filtering

## Local Deployment Guide

### Prerequisites

1. **Node.js** - Version 18 or newer
   - Download from [nodejs.org](https://nodejs.org/)

2. **PostgreSQL** - Version 14 or newer
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Create a new database for the application

### Installation Steps

1. **Extract the zip file** to your desired location

2. **Open a terminal/command prompt** and navigate to the project folder
   ```
   cd path/to/teacheron
   ```

3. **Install dependencies**
   ```
   npm install
   ```

4. **Create a .env file** in the root directory with your database connection:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/databasename
   ```
   Replace username, password, and databasename with your PostgreSQL credentials.

5. **Initialize the database**
   ```
   npm run db:push
   ```

6. **Start the application**
   ```
   npm run dev
   ```

7. **Access the application** at [http://localhost:5000](http://localhost:5000)

### Admin Access

- **Username**: admin
- **Password**: admin123

## Alternative In-Memory Setup

If you prefer not to use PostgreSQL, the application is already configured to use an in-memory database by default. No changes are needed.

## Troubleshooting

- **Database Connection Issues**: Verify your PostgreSQL service is running and credentials are correct
- **Port Conflicts**: If port 5000 is in use, modify the port in server/index.ts
- **Node Version Issues**: Ensure you're using Node.js version 18 or higher

## Support

For any questions or issues, please contact support@teacheron.com