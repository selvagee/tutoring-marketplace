-- Drop existing tables if they exist
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS job_bids;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS tutor_profiles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS session;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  ban_reason TEXT,
  bio TEXT,
  location TEXT,
  hourly_rate INTEGER,
  profile_image_url TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create tutor_profiles table
CREATE TABLE tutor_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  education TEXT,
  experience TEXT,
  languages TEXT,
  hourly_rate INTEGER,
  subjects TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  location TEXT,
  average_rating DOUBLE PRECISION DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  approval_status TEXT DEFAULT 'pending',
  rejection_reason TEXT
);

-- Create jobs table
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subjects TEXT NOT NULL,
  location TEXT NOT NULL,
  hours_per_week INTEGER,
  budget TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create job_bids table
CREATE TABLE job_bids (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL,
  tutor_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  rate INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  tutor_id INTEGER NOT NULL,
  job_id INTEGER,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create session table for persist authentication
CREATE TABLE session (
  sid TEXT PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);