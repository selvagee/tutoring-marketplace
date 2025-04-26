# TeacherOn Local Deployment Instructions

Follow these instructions to prepare and deploy the TeacherOn tutoring marketplace application on your local PC.

## Step 1: Create Project Folder Structure

1. Create a new folder named `teacheron` on your PC
2. Within this folder, create the following subfolders:
   - `client`
   - `server`
   - `shared`

## Step 2: Copy Files from Replit to Local Directory

### Essential Files to Copy to the Root of Your Project:
- `components.json`
- `drizzle.config.ts`
- `package.json`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `vite.config.ts`

### Create a `.env` file in the Root Directory:
```
# Database configuration
DATABASE_URL=postgresql://username:password@localhost:5432/databasename

# Session secret (change this to a random string in production)
SESSION_SECRET=teacheron-session-secret-change-me-in-production

# Server port (optional, defaults to 5000)
# PORT=5000
```

### Copy Folders with All Contents:
- Copy all contents from `client` folder
- Copy all contents from `server` folder
- Copy all contents from `shared` folder

## Step 3: Install Dependencies and Start the Application

1. Open a terminal/command prompt in your project folder
2. Run the following commands:

```bash
# Install dependencies
npm install

# Initialize the database (if using PostgreSQL)
npm run db:push

# Start the application
npm run dev
```

3. Access the application at http://localhost:5000

## Admin Credentials
- Username: `admin`
- Password: `admin123`

## Important Notes

### PostgreSQL Database Setup
If you want to use the PostgreSQL database:
1. Install PostgreSQL on your PC
2. Create a new database
3. Update the DATABASE_URL in your .env file with your credentials

### In-Memory Database Option
The application is configured to use an in-memory database by default, so you can run it without PostgreSQL if preferred.

### Troubleshooting
- If you encounter `Module not found` errors when starting the application, check that all files were copied to the correct locations.
- If there are authentication issues, try clearing your browser cache or using an incognito window.
- For database connection issues, verify your PostgreSQL service is running and credentials are correct.

### File System Check
If the application doesn't start correctly, verify that your file structure matches:

```
teacheron/
├── client/
│   ├── index.html
│   ├── src/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
├── server/
│   ├── auth.ts
│   ├── db.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── .env
├── components.json
├── drizzle.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```