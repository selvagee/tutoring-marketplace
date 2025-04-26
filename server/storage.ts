import { User, TutorProfile, Job, JobBid, Message, Review, InsertUser, InsertTutorProfile, InsertJob, InsertJobBid, InsertMessage, InsertReview, UserRole, UserRoleType, JobStatusType, BidStatusType } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Tutor Profiles
  getTutorProfile(userId: number): Promise<TutorProfile | undefined>;
  createTutorProfile(profile: InsertTutorProfile): Promise<TutorProfile>;
  updateTutorProfile(userId: number, profileData: Partial<TutorProfile>): Promise<TutorProfile | undefined>;
  getAllTutorProfiles(): Promise<TutorProfile[]>;
  
  // Jobs
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, jobData: Partial<Job>): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  getJobsByStudent(studentId: number): Promise<Job[]>;
  getOpenJobs(): Promise<Job[]>;
  
  // Job Bids
  getJobBid(id: number): Promise<JobBid | undefined>;
  createJobBid(bid: InsertJobBid): Promise<JobBid>;
  updateJobBid(id: number, bidData: Partial<JobBid>): Promise<JobBid | undefined>;
  getJobBidsByJob(jobId: number): Promise<JobBid[]>;
  getJobBidsByTutor(tutorId: number): Promise<JobBid[]>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, messageData: Partial<Message>): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{userId: number, unreadCount: number}[]>;
  
  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByTutor(tutorId: number): Promise<Review[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tutorProfiles: Map<number, TutorProfile>;
  private jobs: Map<number, Job>;
  private jobBids: Map<number, JobBid>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  
  currentUserId: number;
  currentTutorProfileId: number;
  currentJobId: number;
  currentJobBidId: number;
  currentMessageId: number;
  currentReviewId: number;
  sessionStore: any; // Use 'any' type to bypass the type error for now

  constructor() {
    this.users = new Map();
    this.tutorProfiles = new Map();
    this.jobs = new Map();
    this.jobBids = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    
    this.currentUserId = 1;
    this.currentTutorProfileId = 1;
    this.currentJobId = 1;
    this.currentJobBidId = 1;
    this.currentMessageId = 1;
    this.currentReviewId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with sample admin user with plain password (NO HASH)
    this.createUser({
      username: "admin",
      password: "admin123", // Plain text for simplicity
      email: "admin@teacheron.com",
      fullName: "Admin User",
      role: UserRole.ADMIN,
    });
    
    // Add sample data
    this.addSampleData();
  }
  
  // Method to add sample data for demonstration purposes
  private async addSampleData() {
    try {
      // Create sample users with pre-hashed passwords
      const studentUser1 = await this.createUser({
        username: "student1",
        password: "9f6a5f53cd637b1d3ac5f072c6468a80cde6e5885d0239b47ce23414febef25e9a5a9ceecff9b4be4ef7a347eca5498a5d5c9d23d211c5787c4c4e7365e1b041.383732333332366630643933343030", // "password" hashed
        email: "student1@example.com",
        fullName: "Alex Johnson",
        role: UserRole.STUDENT
      });

      const studentUser2 = await this.createUser({
        username: "student2",
        password: "9f6a5f53cd637b1d3ac5f072c6468a80cde6e5885d0239b47ce23414febef25e9a5a9ceecff9b4be4ef7a347eca5498a5d5c9d23d211c5787c4c4e7365e1b041.383732333332366630643933343030", // "password" hashed
        email: "student2@example.com",
        fullName: "Jamie Smith",
        role: UserRole.STUDENT
      });

      const tutorUser1 = await this.createUser({
        username: "tutor1",
        password: "9f6a5f53cd637b1d3ac5f072c6468a80cde6e5885d0239b47ce23414febef25e9a5a9ceecff9b4be4ef7a347eca5498a5d5c9d23d211c5787c4c4e7365e1b041.383732333332366630643933343030", // "password" hashed
        email: "tutor1@example.com",
        fullName: "Dr. Emily Chen",
        role: UserRole.TUTOR
      });

      const tutorUser2 = await this.createUser({
        username: "tutor2",
        password: "9f6a5f53cd637b1d3ac5f072c6468a80cde6e5885d0239b47ce23414febef25e9a5a9ceecff9b4be4ef7a347eca5498a5d5c9d23d211c5787c4c4e7365e1b041.383732333332366630643933343030", // "password" hashed
        email: "tutor2@example.com",
        fullName: "Prof. Michael Williams",
        role: UserRole.TUTOR
      });

      const tutorUser3 = await this.createUser({
        username: "tutor3",
        password: "9f6a5f53cd637b1d3ac5f072c6468a80cde6e5885d0239b47ce23414febef25e9a5a9ceecff9b4be4ef7a347eca5498a5d5c9d23d211c5787c4c4e7365e1b041.383732333332366630643933343030", // "password" hashed
        email: "tutor3@example.com",
        fullName: "Sarah Martinez",
        role: UserRole.TUTOR
      });

      // Create tutor profiles
      const tutorProfile1 = await this.createTutorProfile({
        user_id: tutorUser1.id,
        education: "Ph.D. in Mathematics, Stanford University",
        experience: "10+ years teaching advanced mathematics",
        subjects: "Mathematics, Calculus, Statistics, Algebra",
        hourly_rate: 50,
        bio: "I'm a passionate mathematics educator with over a decade of experience teaching at university level. I specialize in making complex math concepts simple to understand. My teaching style focuses on building strong fundamentals and critical thinking skills.",
        languages: "English, Mandarin",
        location: "San Francisco, CA (Online)",
        profile_image_url: "https://api.dicebear.com/7.x/personas/svg?seed=Emily&backgroundType=gradientLinear&backgroundColor=b6e3f4,c2d8fc",
        is_online: true
      });

      const tutorProfile2 = await this.createTutorProfile({
        user_id: tutorUser2.id,
        education: "M.Sc. in Physics, MIT",
        experience: "8 years teaching physics and computer science",
        subjects: "Physics, Computer Science, Programming, Robotics",
        hourly_rate: 45,
        bio: "Former software engineer turned educator with a passion for physics and programming. I believe in a hands-on approach to learning technical subjects, with plenty of real-world examples and projects.",
        languages: "English, French",
        location: "Boston, MA (Online & In-person)",
        profile_image_url: "https://api.dicebear.com/7.x/personas/svg?seed=Michael&backgroundType=gradientLinear&backgroundColor=d1ebfe,b2c4f7",
        is_online: false
      });

      const tutorProfile3 = await this.createTutorProfile({
        user_id: tutorUser3.id,
        education: "B.A. in English Literature, NYU",
        experience: "5 years as an ESL teacher and writing coach",
        subjects: "English, Literature, ESL, Creative Writing, Essay Writing",
        hourly_rate: 35,
        bio: "I help students improve their English language skills through personalized lessons tailored to their specific needs and goals. Whether you're learning English as a second language or need help with writing essays, I can provide the guidance you need.",
        languages: "English, Spanish",
        location: "New York, NY (Online Only)",
        profile_image_url: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah&backgroundType=gradientLinear&backgroundColor=ffd4d4,ffcee7",
        is_online: true
      });

      // Create sample jobs
      const job1 = await this.createJob({
        title: "Calculus Tutor Needed for AP Exam Prep",
        description: "I'm a high school senior preparing for the AP Calculus BC exam and need help with integration techniques and series. Looking for an experienced tutor who can explain concepts clearly and provide practice problems. Prefer twice weekly sessions for the next two months.",
        student_id: studentUser1.id,
        subjects: "Mathematics, Calculus, AP Exam Prep",
        location: "Online (Zoom)",
        budget: "$40-50/hour",
        hours_per_week: 3
      });

      const job2 = await this.createJob({
        title: "Python Programming Tutor for Beginner",
        description: "I'm new to programming and want to learn Python for data analysis. Need a patient tutor who can start from the basics and gradually move to more advanced topics. Looking for weekly 1-hour sessions for at least 3 months.",
        student_id: studentUser2.id,
        subjects: "Programming, Python, Computer Science",
        location: "Online (Google Meet)",
        budget: "$30-40/hour",
        hours_per_week: 2
      });

      const job3 = await this.createJob({
        title: "ESL Tutor for Conversation Practice",
        description: "I'm an intermediate English learner looking to improve my conversation skills for business contexts. Need a tutor who can help with pronunciation, vocabulary, and common business expressions. Flexible schedule, prefer weekends.",
        student_id: studentUser1.id,
        subjects: "English, ESL, Business English",
        location: "Online (Zoom)",
        budget: "$25-35/hour",
        hours_per_week: 2
      });

      // Create job bids
      const bid1 = await this.createJobBid({
        job_id: job1.id,
        tutor_id: tutorUser1.id,
        message: "As a mathematics Ph.D. with extensive experience teaching calculus, I'm confident I can help you prepare for your AP exam. I'll focus on integration techniques and series, providing clear explanations and targeted practice problems. My students have consistently achieved 5s on their AP exams.",
        rate: 45
      });

      const bid2 = await this.createJobBid({
        job_id: job2.id,
        tutor_id: tutorUser2.id,
        message: "I've taught Python programming to many beginners and have a structured curriculum that starts from the absolute basics and gradually introduces more complex concepts. We'll use practical data analysis examples so you can see the real-world applications of what you're learning.",
        rate: 40
      });

      const bid3 = await this.createJobBid({
        job_id: job3.id,
        tutor_id: tutorUser3.id,
        message: "With my background in teaching ESL with a focus on business English, I can help you improve your conversation skills for professional settings. We'll practice real-world business scenarios, work on pronunciation, and build your vocabulary of business expressions.",
        rate: 35
      });

      // Update job 3 to assigned status since bid was accepted
      await this.updateJob(job3.id, { status: "assigned" });
      await this.updateJobBid(bid3.id, { status: "accepted" });

      // Create sample reviews
      await this.createReview({
        tutor_id: tutorUser1.id,
        student_id: studentUser2.id,
        rating: 5,
        comment: "Dr. Chen is an exceptional math tutor! She explains complex concepts in a way that's easy to understand and is always patient with questions. Her practice problems helped me master calculus concepts I was struggling with.",
        job_id: null
      });

      await this.createReview({
        tutor_id: tutorUser1.id,
        student_id: studentUser1.id,
        rating: 4,
        comment: "Very knowledgeable and methodical in her teaching approach. Provides great examples and practice materials. Sometimes goes too fast, but always willing to repeat when asked.",
        job_id: null
      });

      await this.createReview({
        tutor_id: tutorUser2.id,
        student_id: studentUser1.id,
        rating: 5,
        comment: "Professor Williams is fantastic! His background in both industry and academia gives him a unique perspective that makes learning programming relevant and practical. Highly recommend!",
        job_id: null
      });

      await this.createReview({
        tutor_id: tutorUser3.id,
        student_id: studentUser2.id,
        rating: 4,
        comment: "Sarah is a supportive and encouraging ESL tutor. She creates a comfortable environment for practicing conversation and gently corrects mistakes. I've seen significant improvement in my fluency.",
        job_id: null
      });

      // Create sample messages
      await this.createMessage({
        sender_id: studentUser1.id,
        receiver_id: tutorUser1.id,
        content: "Hi Dr. Chen, I saw your profile and I'm interested in math tutoring for my AP Calculus exam. Are you available for a trial session this week?"
      });

      await this.createMessage({
        sender_id: tutorUser1.id,
        receiver_id: studentUser1.id,
        content: "Hello Alex, I'd be happy to help you with AP Calculus. I have availability on Thursday evening or Saturday morning this week. Would either of those times work for you?"
      });

      await this.createMessage({
        sender_id: studentUser2.id,
        receiver_id: tutorUser2.id,
        content: "Professor Williams, I'm interested in learning Python for data analysis. I'm a complete beginner - would you be able to start from the basics?"
      });

      await this.createMessage({
        sender_id: tutorUser2.id,
        receiver_id: studentUser2.id,
        content: "Hi Jamie, absolutely! I have a structured curriculum designed specifically for beginners that starts from the very basics and gradually builds up to data analysis applications. When would you like to start?"
      });
    } catch (error) {
      console.error("Error adding sample data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...userData, id, created_at: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Handle profile image upload - log when a profile image is being updated
    if (userData.profile_image_url) {
      console.log(`Updating user ${id} with profile image (first 30 chars): ${userData.profile_image_url.substring(0, 30)}...`);
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Tutor profile operations
  async getTutorProfile(userId: number): Promise<TutorProfile | undefined> {
    return Array.from(this.tutorProfiles.values()).find(
      (profile) => profile.user_id === userId,
    );
  }

  async createTutorProfile(profileData: InsertTutorProfile): Promise<TutorProfile> {
    const id = this.currentTutorProfileId++;
    const profile: TutorProfile = { 
      ...profileData, 
      id, 
      average_rating: 0, 
      total_reviews: 0,
      hourly_rate: profileData.hourly_rate || null,
      bio: profileData.bio || null
    };
    this.tutorProfiles.set(id, profile);
    return profile;
  }

  async updateTutorProfile(userId: number, profileData: Partial<TutorProfile>): Promise<TutorProfile | undefined> {
    const profile = Array.from(this.tutorProfiles.values()).find(
      (p) => p.user_id === userId,
    );
    
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData };
    this.tutorProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async getAllTutorProfiles(): Promise<TutorProfile[]> {
    return Array.from(this.tutorProfiles.values());
  }

  // Job operations
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(jobData: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const job: Job = { ...jobData, id, created_at: new Date(), status: "open" };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: number, jobData: Partial<Job>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...jobData };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJobsByStudent(studentId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.student_id === studentId,
    );
  }

  async getOpenJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === "open",
    );
  }

  // Job bid operations
  async getJobBid(id: number): Promise<JobBid | undefined> {
    return this.jobBids.get(id);
  }

  async createJobBid(bidData: InsertJobBid): Promise<JobBid> {
    const id = this.currentJobBidId++;
    const bid: JobBid = { ...bidData, id, created_at: new Date(), status: "pending" };
    this.jobBids.set(id, bid);
    return bid;
  }

  async updateJobBid(id: number, bidData: Partial<JobBid>): Promise<JobBid | undefined> {
    const bid = this.jobBids.get(id);
    if (!bid) return undefined;
    
    const updatedBid = { ...bid, ...bidData };
    this.jobBids.set(id, updatedBid);
    return updatedBid;
  }

  async getJobBidsByJob(jobId: number): Promise<JobBid[]> {
    return Array.from(this.jobBids.values()).filter(
      (bid) => bid.job_id === jobId,
    );
  }

  async getJobBidsByTutor(tutorId: number): Promise<JobBid[]> {
    return Array.from(this.jobBids.values()).filter(
      (bid) => bid.tutor_id === tutorId,
    );
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { ...messageData, id, created_at: new Date(), is_read: false };
    this.messages.set(id, message);
    return message;
  }

  async updateMessage(id: number, messageData: Partial<Message>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...messageData };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.sender_id === user1Id && message.receiver_id === user2Id) ||
        (message.sender_id === user2Id && message.receiver_id === user1Id)
    ).sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }

  async getUserConversations(userId: number): Promise<{userId: number, unreadCount: number}[]> {
    const allMessages = Array.from(this.messages.values()).filter(
      (message) => message.sender_id === userId || message.receiver_id === userId
    );
    
    const conversationMap = new Map<number, {userId: number, unreadCount: number}>();
    
    allMessages.forEach(message => {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          unreadCount: 0
        });
      }
      
      if (message.receiver_id === userId && !message.is_read) {
        const current = conversationMap.get(otherUserId)!;
        conversationMap.set(otherUserId, {
          ...current,
          unreadCount: current.unreadCount + 1
        });
      }
    });
    
    return Array.from(conversationMap.values());
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { ...reviewData, id, created_at: new Date() };
    this.reviews.set(id, review);
    
    // Update tutor's average rating
    const tutorProfile = await this.getTutorProfile(reviewData.tutor_id);
    if (tutorProfile) {
      const tutorReviews = await this.getReviewsByTutor(reviewData.tutor_id);
      const totalRating = tutorReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / tutorReviews.length;
      
      await this.updateTutorProfile(reviewData.tutor_id, {
        average_rating: averageRating,
        total_reviews: tutorReviews.length
      });
    }
    
    return review;
  }

  async getReviewsByTutor(tutorId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.tutor_id === tutorId,
    );
  }
}

import { db } from './db';
import connectPg from "connect-pg-simple";
import session from "express-session";
import { eq, and, or, asc, desc, isNull } from 'drizzle-orm';
import { pool } from './db';
import { 
  users, tutorProfiles, jobs, jobBids, messages, reviews,
  UserRole, JobStatus, BidStatus, TutorApprovalStatus
} from '@shared/schema';

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session'
    });
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Tutor Profiles
  async getTutorProfile(userId: number): Promise<TutorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(tutorProfiles)
      .where(eq(tutorProfiles.user_id, userId));
    return profile;
  }

  async createTutorProfile(profileData: InsertTutorProfile): Promise<TutorProfile> {
    const [profile] = await db
      .insert(tutorProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updateTutorProfile(userId: number, profileData: Partial<TutorProfile>): Promise<TutorProfile | undefined> {
    const [updatedProfile] = await db
      .update(tutorProfiles)
      .set(profileData)
      .where(eq(tutorProfiles.user_id, userId))
      .returning();
    return updatedProfile;
  }

  async getAllTutorProfiles(): Promise<TutorProfile[]> {
    return await db.select().from(tutorProfiles);
  }
  
  // Jobs
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(jobData: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(jobData).returning();
    return job;
  }

  async updateJob(id: number, jobData: Partial<Job>): Promise<Job | undefined> {
    const [updatedJob] = await db
      .update(jobs)
      .set(jobData)
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs);
  }

  async getJobsByStudent(studentId: number): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.student_id, studentId));
  }

  async getOpenJobs(): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, JobStatus.OPEN));
  }
  
  // Job Bids
  async getJobBid(id: number): Promise<JobBid | undefined> {
    const [bid] = await db
      .select()
      .from(jobBids)
      .where(eq(jobBids.id, id));
    return bid;
  }

  async createJobBid(bidData: InsertJobBid): Promise<JobBid> {
    const [bid] = await db
      .insert(jobBids)
      .values(bidData)
      .returning();
    return bid;
  }

  async updateJobBid(id: number, bidData: Partial<JobBid>): Promise<JobBid | undefined> {
    const [updatedBid] = await db
      .update(jobBids)
      .set(bidData)
      .where(eq(jobBids.id, id))
      .returning();
    return updatedBid;
  }

  async getJobBidsByJob(jobId: number): Promise<JobBid[]> {
    return await db
      .select()
      .from(jobBids)
      .where(eq(jobBids.job_id, jobId));
  }

  async getJobBidsByTutor(tutorId: number): Promise<JobBid[]> {
    return await db
      .select()
      .from(jobBids)
      .where(eq(jobBids.tutor_id, tutorId));
  }
  
  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async updateMessage(id: number, messageData: Partial<Message>): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set(messageData)
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.sender_id, user1Id),
            eq(messages.receiver_id, user2Id)
          ),
          and(
            eq(messages.sender_id, user2Id),
            eq(messages.receiver_id, user1Id)
          )
        )
      )
      .orderBy(asc(messages.created_at));
  }

  async getUserConversations(userId: number): Promise<{ userId: number; unreadCount: number }[]> {
    // This is more complex in SQL, we'll need to create a custom query
    // First, get all unique users this user has messaged with
    const sentMessages = await db
      .select({ otherUserId: messages.receiver_id })
      .from(messages)
      .where(eq(messages.sender_id, userId));
      
    const receivedMessages = await db
      .select({ otherUserId: messages.sender_id })
      .from(messages)
      .where(eq(messages.receiver_id, userId));
    
    // Combine and get unique user IDs
    const allUserIds = [
      ...sentMessages.map(m => m.otherUserId),
      ...receivedMessages.map(m => m.otherUserId)
    ];
    const uniqueUserIds = [...new Set(allUserIds)];
    
    // For each unique user, count unread messages
    const conversations = await Promise.all(
      uniqueUserIds.map(async (otherUserId) => {
        const unreadMessages = await db
          .select()
          .from(messages)
          .where(
            and(
              eq(messages.sender_id, otherUserId),
              eq(messages.receiver_id, userId),
              eq(messages.is_read, false)
            )
          );
        
        return {
          userId: otherUserId,
          unreadCount: unreadMessages.length
        };
      })
    );
    
    return conversations;
  }
  
  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id));
    return review;
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    return review;
  }

  async getReviewsByTutor(tutorId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.tutor_id, tutorId));
  }
}

// Choose storage implementation based on database availability
// If db is null (no DATABASE_URL), use in-memory storage
// Otherwise, use the database storage
export const storage = db ? new DatabaseStorage() : new MemStorage();
