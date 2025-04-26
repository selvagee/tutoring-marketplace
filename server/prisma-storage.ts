import { prisma } from './prisma';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';
import memorystore from 'memorystore';
import { log } from './vite';

const PgStore = connectPgSimple(session);
const MemoryStore = memorystore(session);

// Define types based on the database schema
type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  full_name: string;
  role: string;
  status?: string | null;
  ban_reason?: string | null;
  bio?: string | null;
  location?: string | null;
  hourly_rate?: number | null;
  profile_image_url?: string | null;
  is_online?: boolean | null;
  created_at?: Date | null;
};

type TutorProfile = {
  id: number;
  user_id: number;
  education?: string | null;
  experience?: string | null;
  languages?: string | null;
  hourly_rate?: number | null;
  subjects: string;
  bio?: string | null;
  profile_image_url?: string | null;
  location?: string | null;
  average_rating?: number | null;
  total_reviews?: number | null;
  approval_status?: string | null;
  rejection_reason?: string | null;
};

type Job = {
  id: number;
  student_id: number;
  title: string;
  description: string;
  subjects: string;
  location: string;
  hours_per_week?: number | null;
  budget: string;
  status?: string | null;
  created_at?: Date | null;
};

type JobBid = {
  id: number;
  job_id: number;
  tutor_id: number;
  message: string;
  rate: number;
  status?: string | null;
  created_at?: Date | null;
};

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read?: boolean | null;
  created_at?: Date | null;
};

type Review = {
  id: number;
  student_id: number;
  tutor_id: number;
  job_id?: number | null;
  rating: number;
  comment?: string | null;
  created_at?: Date | null;
};

// Define storage interface for application
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(userData: Omit<User, 'id'>): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  
  // Tutor Profiles
  getTutorProfile(userId: number): Promise<TutorProfile | null>;
  createTutorProfile(profileData: Omit<TutorProfile, 'id'>): Promise<TutorProfile>;
  updateTutorProfile(userId: number, profileData: Partial<TutorProfile>): Promise<TutorProfile | null>;
  getAllTutorProfiles(): Promise<TutorProfile[]>;
  
  // Jobs
  getJob(id: number): Promise<Job | null>;
  createJob(jobData: Omit<Job, 'id'>): Promise<Job>;
  updateJob(id: number, jobData: Partial<Job>): Promise<Job | null>;
  getAllJobs(): Promise<Job[]>;
  getJobsByStudent(studentId: number): Promise<Job[]>;
  getOpenJobs(): Promise<Job[]>;
  
  // Job Bids
  getJobBid(id: number): Promise<JobBid | null>;
  createJobBid(bidData: Omit<JobBid, 'id'>): Promise<JobBid>;
  updateJobBid(id: number, bidData: Partial<JobBid>): Promise<JobBid | null>;
  getJobBidsByJob(jobId: number): Promise<JobBid[]>;
  getJobBidsByTutor(tutorId: number): Promise<JobBid[]>;
  
  // Messages
  getMessage(id: number): Promise<Message | null>;
  createMessage(messageData: Omit<Message, 'id'>): Promise<Message>;
  updateMessage(id: number, messageData: Partial<Message>): Promise<Message | null>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{userId: number, unreadCount: number}[]>;
  
  // Reviews
  getReview(id: number): Promise<Review | null>;
  createReview(reviewData: Omit<Review, 'id'>): Promise<Review>;
  getReviewsByTutor(tutorId: number): Promise<Review[]>;
  
  // Session store
  sessionStore: session.Store;
}

// Prisma implementation of storage
export class PrismaStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Use PostgreSQL session store if DATABASE_URL is available, otherwise use memory store
    if (process.env.DATABASE_URL) {
      this.sessionStore = new PgStore({ 
        pool,
        createTableIfMissing: true,
      });
      log("Using PostgreSQL session store", "storage");
    } else {
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000, // Clear expired sessions every 24h
      });
      log("Using in-memory session store", "storage");
    }
  }

  // User methods
  async getUser(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username }
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return prisma.user.create({
      data: userData
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  // Tutor Profile methods
  async getTutorProfile(userId: number): Promise<TutorProfile | null> {
    return prisma.tutorProfile.findUnique({
      where: { user_id: userId }
    });
  }

  async createTutorProfile(profileData: Omit<TutorProfile, 'id'>): Promise<TutorProfile> {
    return prisma.tutorProfile.create({
      data: profileData
    });
  }

  async updateTutorProfile(userId: number, profileData: Partial<TutorProfile>): Promise<TutorProfile | null> {
    const profile = await prisma.tutorProfile.findUnique({
      where: { user_id: userId }
    });

    if (!profile) return null;

    return prisma.tutorProfile.update({
      where: { id: profile.id },
      data: profileData
    });
  }

  async getAllTutorProfiles(): Promise<TutorProfile[]> {
    return prisma.tutorProfile.findMany();
  }

  // Job methods
  async getJob(id: number): Promise<Job | null> {
    return prisma.job.findUnique({
      where: { id }
    });
  }

  async createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
    return prisma.job.create({
      data: jobData
    });
  }

  async updateJob(id: number, jobData: Partial<Job>): Promise<Job | null> {
    return prisma.job.update({
      where: { id },
      data: jobData
    });
  }

  async getAllJobs(): Promise<Job[]> {
    return prisma.job.findMany();
  }

  async getJobsByStudent(studentId: number): Promise<Job[]> {
    return prisma.job.findMany({
      where: { student_id: studentId }
    });
  }

  async getOpenJobs(): Promise<Job[]> {
    return prisma.job.findMany({
      where: { status: 'open' }
    });
  }

  // Job Bid methods
  async getJobBid(id: number): Promise<JobBid | null> {
    return prisma.jobBid.findUnique({
      where: { id }
    });
  }

  async createJobBid(bidData: Omit<JobBid, 'id'>): Promise<JobBid> {
    return prisma.jobBid.create({
      data: bidData
    });
  }

  async updateJobBid(id: number, bidData: Partial<JobBid>): Promise<JobBid | null> {
    return prisma.jobBid.update({
      where: { id },
      data: bidData
    });
  }

  async getJobBidsByJob(jobId: number): Promise<JobBid[]> {
    return prisma.jobBid.findMany({
      where: { job_id: jobId }
    });
  }

  async getJobBidsByTutor(tutorId: number): Promise<JobBid[]> {
    return prisma.jobBid.findMany({
      where: { tutor_id: tutorId }
    });
  }

  // Message methods
  async getMessage(id: number): Promise<Message | null> {
    return prisma.message.findUnique({
      where: { id }
    });
  }

  async createMessage(messageData: Omit<Message, 'id'>): Promise<Message> {
    return prisma.message.create({
      data: messageData
    });
  }

  async updateMessage(id: number, messageData: Partial<Message>): Promise<Message | null> {
    return prisma.message.update({
      where: { id },
      data: messageData
    });
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return prisma.message.findMany({
      where: {
        OR: [
          { 
            sender_id: user1Id,
            receiver_id: user2Id
          },
          {
            sender_id: user2Id,
            receiver_id: user1Id
          }
        ]
      },
      orderBy: {
        created_at: 'asc'
      }
    });
  }

  async getUserConversations(userId: number): Promise<{ userId: number, unreadCount: number }[]> {
    // First, find all unique users this user has communicated with
    const sentMessages = await prisma.message.findMany({
      where: { sender_id: userId },
      select: { receiver_id: true }
    });
    
    const receivedMessages = await prisma.message.findMany({
      where: { receiver_id: userId },
      select: { sender_id: true }
    });
    
    // Get unique user IDs
    const userIdsSet = new Set<number>();
    sentMessages.forEach(msg => userIdsSet.add(msg.receiver_id));
    receivedMessages.forEach(msg => userIdsSet.add(msg.sender_id));
    
    // For each conversation, count unread messages
    const result: { userId: number, unreadCount: number }[] = [];
    
    for (const otherUserId of Array.from(userIdsSet)) {
      const unreadCount = await prisma.message.count({
        where: {
          sender_id: otherUserId,
          receiver_id: userId,
          is_read: false
        }
      });
      
      result.push({
        userId: otherUserId,
        unreadCount
      });
    }
    
    return result;
  }

  // Review methods
  async getReview(id: number): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id }
    });
  }

  async createReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
    const review = await prisma.review.create({
      data: reviewData
    });
    
    // Update the tutor's average rating
    await this.updateTutorRating(reviewData.tutor_id);
    
    return review;
  }

  async getReviewsByTutor(tutorId: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { tutor_id: tutorId }
    });
  }
  
  // Helper method to update tutor's average rating
  private async updateTutorRating(tutorId: number): Promise<void> {
    const reviews = await this.getReviewsByTutor(tutorId);
    
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    const profile = await prisma.tutorProfile.findUnique({
      where: { user_id: tutorId }
    });
    
    if (profile) {
      await prisma.tutorProfile.update({
        where: { id: profile.id },
        data: {
          average_rating: averageRating,
          total_reviews: reviews.length
        }
      });
    }
  }
}

// In-memory implementation of the storage interface (for testing or when no DB is available)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tutorProfiles: Map<number, TutorProfile>;
  private jobs: Map<number, Job>;
  private jobBids: Map<number, JobBid>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  
  // Counters for generating IDs
  private currentUserId: number;
  private currentTutorProfileId: number;
  private currentJobId: number;
  private currentJobBidId: number;
  private currentMessageId: number;
  private currentReviewId: number;
  sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.tutorProfiles = new Map();
    this.jobs = new Map();
    this.jobBids = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    
    this.currentUserId = 0;
    this.currentTutorProfileId = 0;
    this.currentJobId = 0;
    this.currentJobBidId = 0;
    this.currentMessageId = 0;
    this.currentReviewId = 0;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
    
    // Add sample data for development
    this.addSampleData();
    log("In-memory storage initialized with sample data", "storage");
  }
  
  // Helper method to add sample data
  private async addSampleData() {
    // Add admin user
    const admin = await this.createUser({
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });
    
    // Add tutor users
    const tutor1 = await this.createUser({
      username: 'tutor1',
      password: 'password123',
      email: 'tutor1@example.com',
      full_name: 'John Doe',
      role: 'tutor',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });

    const tutor2 = await this.createUser({
      username: 'tutor2',
      password: 'password123',
      email: 'tutor2@example.com',
      full_name: 'Jane Smith',
      role: 'tutor',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });

    const tutor3 = await this.createUser({
      username: 'tutor3',
      password: 'password123',
      email: 'tutor3@example.com',
      full_name: 'Bob Johnson',
      role: 'tutor',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });

    const tutor4 = await this.createUser({
      username: 'selvagee',
      password: 'password123',
      email: 'selvagee@example.com',
      full_name: 'Selvagee',
      role: 'tutor',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });
    
    // Add student users
    const student1 = await this.createUser({
      username: 'student1',
      password: 'password123',
      email: 'student1@example.com',
      full_name: 'Student One',
      role: 'student',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });

    const student2 = await this.createUser({
      username: 'student2',
      password: 'password123',
      email: 'student2@example.com',
      full_name: 'Student Two',
      role: 'student',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });

    const student3 = await this.createUser({
      username: 'student3',
      password: 'password123',
      email: 'student3@example.com',
      full_name: 'Student Three',
      role: 'student',
      status: 'active',
      profile_image_url: null,
      last_active: null,
      is_online: false,
      ban_reason: null,
      created_at: new Date(),
      updated_at: null,
      tutorProfile: null,
      jobsPosted: [],
      jobBids: [],
      sentMessages: [],
      receivedMessages: [],
      reviewsGiven: [],
      reviewsReceived: []
    });
    
    // Add tutor profiles
    await this.createTutorProfile({
      user_id: tutor1.id,
      education: 'Ph.D. in Physics',
      experience: '3 years of tutoring experience',
      languages: 'English, Spanish',
      hourly_rate: 25,
      subjects: 'Mathematics, Physics, Computer Science',
      bio: 'Experienced tutor with a passion for teaching sciences. I specialize in making complex concepts easy to understand.',
      profile_image_url: '/assets/tutor1.jpg',
      location: 'New York',
      availability: 'Weekdays evenings, Weekends',
      average_rating: 0,
      total_reviews: 0,
      approval_status: 'approved',
      rejection_reason: null,
      user: tutor1
    });
    
    await this.createTutorProfile({
      user_id: tutor2.id,
      education: "Master's in English Literature",
      experience: '5 years of tutoring experience',
      languages: 'English, Spanish',
      hourly_rate: 30,
      subjects: 'English, Literature, Writing',
      bio: 'I love helping students improve their writing and analytical skills. I have 5 years of experience teaching at university level.',
      profile_image_url: '/assets/tutor2.jpg',
      location: 'Los Angeles',
      availability: 'Flexible',
      average_rating: 0,
      total_reviews: 0,
      approval_status: 'approved',
      rejection_reason: null,
      user: tutor2
    });
    
    await this.createTutorProfile({
      user_id: tutor3.id,
      education: 'B.Sc in Biology',
      experience: '7 years of tutoring experience',
      languages: 'English, Spanish',
      hourly_rate: 35,
      subjects: 'Biology, Chemistry, Science',
      bio: 'Certified teacher with expertise in biology and chemistry. I make learning fun and engaging!',
      profile_image_url: '/assets/tutor3.jpg',
      location: 'Chicago',
      availability: 'Weekends',
      average_rating: 0,
      total_reviews: 0,
      approval_status: 'approved',
      rejection_reason: null,
      user: tutor3
    });
    
    await this.createTutorProfile({
      user_id: tutor4.id,
      education: 'M.Sc in Computer Science',
      experience: '9 years of tutoring experience',
      languages: 'English, Spanish',
      hourly_rate: 40,
      subjects: 'Computer Programming, Web Development, Data Science',
      bio: 'Software developer with 10+ years of industry experience. I can help you master programming fundamentals and advanced topics.',
      profile_image_url: '/assets/tutor4.jpg',
      location: 'Houston',
      availability: 'Weekday evenings',
      average_rating: 0,
      total_reviews: 0,
      approval_status: 'approved',
      rejection_reason: null,
      user: tutor4
    });
    
    // Add jobs
    await this.createJob({
      student_id: student1.id,
      title: 'Calculus Tutor Needed for AP Exam Prep',
      description: "I'm a high school student preparing for the AP Calculus AB exam and need help with derivatives and integrals.",
      subjects: 'Mathematics, Calculus',
      location: 'Online',
      hours_per_week: 4,
      budget: '$30-40/hour',
      status: 'open',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      student: student1,
      bids: [],
      reviews: []
    });
    
    await this.createJob({
      student_id: student2.id,
      title: 'English Literature Tutoring for College Essays',
      description: 'Looking for an experienced English tutor to help review and improve my college application essays.',
      subjects: 'English, Writing',
      location: 'New York',
      hours_per_week: 2,
      budget: '$25-35/hour',
      status: 'open',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      student: student2,
      bids: [],
      reviews: []
    });
    
    await this.createJob({
      student_id: student3.id,
      title: 'Physics Help for High School Student',
      description: 'Need help understanding mechanics and electromagnetism concepts for my high school physics class.',
      subjects: 'Physics',
      location: 'Online',
      hours_per_week: 3,
      budget: '$20-30/hour',
      status: 'open',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      student: student3,
      bids: [],
      reviews: []
    });
    
    await this.createJob({
      student_id: student1.id,
      title: 'Programming Tutor for JavaScript Beginner',
      description: "I'm learning JavaScript and need help with functions, objects, and basic DOM manipulation.",
      subjects: 'Computer Science, Programming',
      location: 'Chicago',
      hours_per_week: 5,
      budget: '$35-45/hour',
      status: 'open',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      student: student1,
      bids: [],
      reviews: []
    });
  }
  
  // Users
  async getUser(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }
  
  async getUserByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }
  
  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
  
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const id = ++this.currentUserId;
    const user = { ...userData, id } as User;
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Tutor Profiles
  async getTutorProfile(userId: number): Promise<TutorProfile | null> {
    for (const profile of this.tutorProfiles.values()) {
      if (profile.user_id === userId) {
        return profile;
      }
    }
    return null;
  }
  
  async createTutorProfile(profileData: Omit<TutorProfile, 'id'>): Promise<TutorProfile> {
    const id = ++this.currentTutorProfileId;
    const profile = { ...profileData, id } as TutorProfile;
    this.tutorProfiles.set(id, profile);
    return profile;
  }
  
  async updateTutorProfile(userId: number, profileData: Partial<TutorProfile>): Promise<TutorProfile | null> {
    for (const [id, profile] of this.tutorProfiles.entries()) {
      if (profile.user_id === userId) {
        const updatedProfile = { ...profile, ...profileData };
        this.tutorProfiles.set(id, updatedProfile);
        return updatedProfile;
      }
    }
    return null;
  }
  
  async getAllTutorProfiles(): Promise<TutorProfile[]> {
    return Array.from(this.tutorProfiles.values());
  }
  
  // Jobs
  async getJob(id: number): Promise<Job | null> {
    return this.jobs.get(id) || null;
  }
  
  async createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
    const id = ++this.currentJobId;
    const job = { ...jobData, id } as Job;
    this.jobs.set(id, job);
    return job;
  }
  
  async updateJob(id: number, jobData: Partial<Job>): Promise<Job | null> {
    const job = this.jobs.get(id);
    if (!job) return null;
    
    const updatedJob = { ...job, ...jobData };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }
  
  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }
  
  async getJobsByStudent(studentId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.student_id === studentId);
  }
  
  async getOpenJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.status === 'open');
  }
  
  // Job Bids
  async getJobBid(id: number): Promise<JobBid | null> {
    return this.jobBids.get(id) || null;
  }
  
  async createJobBid(bidData: Omit<JobBid, 'id'>): Promise<JobBid> {
    const id = ++this.currentJobBidId;
    const bid = { ...bidData, id } as JobBid;
    this.jobBids.set(id, bid);
    return bid;
  }
  
  async updateJobBid(id: number, bidData: Partial<JobBid>): Promise<JobBid | null> {
    const bid = this.jobBids.get(id);
    if (!bid) return null;
    
    const updatedBid = { ...bid, ...bidData };
    this.jobBids.set(id, updatedBid);
    return updatedBid;
  }
  
  async getJobBidsByJob(jobId: number): Promise<JobBid[]> {
    return Array.from(this.jobBids.values()).filter(bid => bid.job_id === jobId);
  }
  
  async getJobBidsByTutor(tutorId: number): Promise<JobBid[]> {
    return Array.from(this.jobBids.values()).filter(bid => bid.tutor_id === tutorId);
  }
  
  // Messages
  async getMessage(id: number): Promise<Message | null> {
    return this.messages.get(id) || null;
  }
  
  async createMessage(messageData: Omit<Message, 'id'>): Promise<Message> {
    const id = ++this.currentMessageId;
    const message = { ...messageData, id } as Message;
    this.messages.set(id, message);
    return message;
  }
  
  async updateMessage(id: number, messageData: Partial<Message>): Promise<Message | null> {
    const message = this.messages.get(id);
    if (!message) return null;
    
    const updatedMessage = { ...message, ...messageData };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.sender_id === user1Id && msg.receiver_id === user2Id) || 
        (msg.sender_id === user2Id && msg.receiver_id === user1Id)
      )
      .sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return a.created_at.getTime() - b.created_at.getTime();
      });
  }
  
  async getUserConversations(userId: number): Promise<{ userId: number, unreadCount: number }[]> {
    const sentMessages = Array.from(this.messages.values())
      .filter(msg => msg.sender_id === userId);
    
    const receivedMessages = Array.from(this.messages.values())
      .filter(msg => msg.receiver_id === userId);
    
    const userIdsSet = new Set<number>();
    sentMessages.forEach(msg => userIdsSet.add(msg.receiver_id));
    receivedMessages.forEach(msg => userIdsSet.add(msg.sender_id));
    
    return Array.from(userIdsSet).map(otherUserId => {
      const unreadCount = receivedMessages
        .filter(msg => msg.sender_id === otherUserId && !msg.is_read)
        .length;
      
      return {
        userId: otherUserId,
        unreadCount
      };
    });
  }
  
  // Reviews
  async getReview(id: number): Promise<Review | null> {
    return this.reviews.get(id) || null;
  }
  
  async createReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
    const id = ++this.currentReviewId;
    const review = { ...reviewData, id } as Review;
    this.reviews.set(id, review);
    
    // Update tutor's average rating
    await this.updateTutorRating(reviewData.tutor_id);
    
    return review;
  }
  
  async getReviewsByTutor(tutorId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.tutor_id === tutorId);
  }
  
  // Helper method to update tutor's average rating
  private async updateTutorRating(tutorId: number): Promise<void> {
    const reviews = await this.getReviewsByTutor(tutorId);
    
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await this.updateTutorProfile(tutorId, {
      average_rating: averageRating,
      total_reviews: reviews.length
    });
  }
}

// Decide which storage implementation to use
// If Prisma is properly set up and a database is available, use PrismaStorage
// Otherwise, fall back to MemStorage
export const storage = process.env.DATABASE_URL 
  ? new PrismaStorage() 
  : new MemStorage();

export default storage;