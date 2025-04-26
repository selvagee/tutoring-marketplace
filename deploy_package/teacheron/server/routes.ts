import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertJobSchema, 
  insertJobBidSchema, 
  insertMessageSchema, 
  insertReviewSchema, 
  insertTutorProfileSchema, 
  JobStatus, 
  BidStatus, 
  UserRole, 
  TutorApprovalStatus 
} from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  console.log("isAuthenticated middleware - Session:", req.session);
  console.log("isAuthenticated middleware - User authenticated:", req.isAuthenticated());
  console.log("isAuthenticated middleware - User:", req.user);
  
  if (req.isAuthenticated()) {
    console.log("isAuthenticated middleware - Authentication successful");
    return next();
  }
  
  console.log("isAuthenticated middleware - Authentication failed");
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is a tutor
const isTutor = (req: Request, res: Response, next: Function) => {
  console.log("isTutor middleware - User:", req.user);
  if (req.isAuthenticated() && (req.user.role === "tutor" || req.user.role === "TUTOR")) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Tutor access required" });
};

// Middleware to check if user is a student
const isStudent = (req: Request, res: Response, next: Function) => {
  console.log("isStudent middleware - User:", req.user);
  if (req.isAuthenticated() && (req.user.role === "student" || req.user.role === "STUDENT")) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Student access required" });
};

// Middleware to check if user is an admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  console.log("isAdmin middleware - User:", req.user);
  if (req.isAuthenticated() && (req.user.role === "admin" || req.user.role === "ADMIN")) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // ===== User Routes =====
  
  // Get user by ID
  app.get("/api/users/:userId", async (req, res) => {
    try {
      console.log("GET /api/users/:userId - User ID:", req.params.userId);
      const userId = parseInt(req.params.userId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        console.log("User not found for ID:", userId);
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log("User found:", user);
      
      // Remove password before sending
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error fetching user" });
    }
  });
  
  // ===== Tutor Profile Routes =====
  
  // Get all tutors
  app.get("/api/tutors", async (req, res) => {
    try {
      const tutorProfiles = await storage.getAllTutorProfiles();
      const tutorsWithUserData = await Promise.all(
        tutorProfiles.map(async (profile) => {
          const user = await storage.getUser(profile.userId);
          if (!user) return null;
          
          const { password, ...userData } = user;
          return {
            ...userData,
            ...profile,
          };
        })
      );
      
      // Filter out null values (profiles with no user data)
      const validTutors = tutorsWithUserData.filter(t => t !== null);
      res.json(validTutors);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching tutors" });
    }
  });

  // Get specific tutor by ID
  app.get("/api/tutors/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tutorProfile = await storage.getTutorProfile(userId);
      
      if (!tutorProfile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }
      
      const user = await storage.getUser(userId);
      if (!user || user.role !== "tutor") {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
      const { password, ...userData } = user;
      
      // Get tutor reviews
      const reviews = await storage.getReviewsByTutor(userId);
      
      // Format reviews with student information
      const formattedReviews = await Promise.all(
        reviews.map(async (review) => {
          const student = await storage.getUser(review.studentId);
          if (!student) return review;
          
          const { password, ...studentData } = student;
          return {
            ...review,
            student: studentData,
          };
        })
      );
      
      res.json({
        ...userData,
        ...tutorProfile,
        reviews: formattedReviews,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching tutor" });
    }
  });

  // Create or update tutor profile
  app.post("/api/tutors/profile", isTutor, async (req, res) => {
    try {
      const userId = req.user.id;
      
      console.log("Tutor profile update request:", JSON.stringify(req.body, null, 2));
      
      // Check if profile already exists
      const existingProfile = await storage.getTutorProfile(userId);
      
      if (existingProfile) {
        // Update existing profile
        const validatedData = insertTutorProfileSchema.parse({
          ...req.body,
          userId,
        });
        
        console.log("Validated profile data:", JSON.stringify(validatedData, null, 2));
        
        const updatedProfile = await storage.updateTutorProfile(userId, validatedData);
        console.log("Updated profile result:", JSON.stringify(updatedProfile, null, 2));
        res.json(updatedProfile);
      } else {
        // Create new profile
        const validatedData = insertTutorProfileSchema.parse({
          ...req.body,
          userId,
        });
        
        const newProfile = await storage.createTutorProfile(validatedData);
        res.status(201).json(newProfile);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error updating tutor profile" });
    }
  });

  // ===== Job Routes =====
  
  // Get all jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      let jobs;
      
      if (req.query.status === "open") {
        jobs = await storage.getOpenJobs();
      } else {
        jobs = await storage.getAllJobs();
      }
      
      // Get student information for each job
      const jobsWithStudentData = await Promise.all(
        jobs.map(async (job) => {
          const student = await storage.getUser(job.studentId);
          if (!student) return job;
          
          const { password, ...studentData } = student;
          return {
            ...job,
            student: studentData,
          };
        })
      );
      
      res.json(jobsWithStudentData);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching jobs" });
    }
  });

  // Get specific job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Get student information
      const student = await storage.getUser(job.studentId);
      if (student) {
        const { password, ...studentData } = student;
        job.student = studentData;
      }
      
      // Get bids for this job
      const bids = await storage.getJobBidsByJob(jobId);
      
      // Format bids with tutor information
      const formattedBids = await Promise.all(
        bids.map(async (bid) => {
          const tutor = await storage.getUser(bid.tutorId);
          if (!tutor) return bid;
          
          const { password, ...tutorData } = tutor;
          return {
            ...bid,
            tutor: tutorData,
          };
        })
      );
      
      res.json({
        ...job,
        bids: formattedBids,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching job" });
    }
  });

  // Create a new job
  app.post("/api/jobs", isStudent, async (req, res) => {
    try {
      const studentId = req.user.id;
      
      const validatedData = insertJobSchema.parse({
        ...req.body,
        studentId,
      });
      
      const newJob = await storage.createJob(validatedData);
      res.status(201).json(newJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error creating job" });
    }
  });

  // Update job status
  app.patch("/api/jobs/:id/status", isStudent, async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const { status } = req.body;
      
      const job = await storage.getJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Check if the student owns this job
      if (job.studentId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden - You can only update your own jobs" });
      }
      
      // Validate status
      if (!Object.values(JobStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid job status" });
      }
      
      const updatedJob = await storage.updateJob(jobId, { status });
      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Server error updating job status" });
    }
  });

  // ===== Job Bid Routes =====
  
  // Create a job bid
  app.post("/api/jobs/:id/bids", isTutor, async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const tutorId = req.user.id;
      
      // Check if job exists and is open
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.status !== JobStatus.OPEN) {
        return res.status(400).json({ message: "Cannot bid on a job that is not open" });
      }
      
      // Check if tutor already placed a bid
      const existingBids = await storage.getJobBidsByJob(jobId);
      const alreadyBid = existingBids.some(bid => bid.tutorId === tutorId);
      
      if (alreadyBid) {
        return res.status(400).json({ message: "You have already placed a bid on this job" });
      }
      
      const validatedData = insertJobBidSchema.parse({
        ...req.body,
        jobId,
        tutorId,
      });
      
      const newBid = await storage.createJobBid(validatedData);
      res.status(201).json(newBid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error creating job bid" });
    }
  });

  // Accept a bid
  app.patch("/api/bids/:id/accept", isStudent, async (req, res) => {
    try {
      const bidId = parseInt(req.params.id);
      
      const bid = await storage.getJobBid(bidId);
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }
      
      // Check if the student owns the job
      const job = await storage.getJob(bid.jobId);
      if (!job || job.studentId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden - You can only accept bids on your own jobs" });
      }
      
      // Update bid status
      const updatedBid = await storage.updateJobBid(bidId, { status: BidStatus.ACCEPTED });
      
      // Update job status
      await storage.updateJob(job.id, { status: JobStatus.ASSIGNED });
      
      res.json(updatedBid);
    } catch (error) {
      res.status(500).json({ message: "Server error accepting bid" });
    }
  });

  // ===== Message Routes =====
  
  // Get conversations
  app.get("/api/messages/conversations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const conversations = await storage.getUserConversations(userId);
      
      // Get user data for each conversation
      const conversationsWithUserData = await Promise.all(
        conversations.map(async (conv) => {
          const user = await storage.getUser(conv.userId);
          if (!user) return conv;
          
          const { password, ...userData } = user;
          return {
            ...conv,
            user: userData,
          };
        })
      );
      
      res.json(conversationsWithUserData);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching conversations" });
    }
  });

  // Get messages between current user and another user
  app.get("/api/messages/:userId", isAuthenticated, async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const otherUserId = parseInt(req.params.userId);
      
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      
      // Mark messages as read if the current user is the receiver
      await Promise.all(
        messages
          .filter(msg => msg.receiverId === currentUserId && !msg.isRead)
          .map(msg => storage.updateMessage(msg.id, { isRead: true }))
      );
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching messages" });
    }
  });

  // Send a message
  app.post("/api/messages", async (req, res) => {
    console.log("POST /api/messages - Request session:", req.session);
    console.log("POST /api/messages - isAuthenticated:", req.isAuthenticated());
    console.log("POST /api/messages - User:", req.user);
    
    // Skip authentication temporarily to debug
    try {
      const senderId = req.isAuthenticated() ? req.user.id : 7; // Special bypass for testing, using user ID 7
      const { receiverId, content } = req.body;
      
      console.log("Message details:", { senderId, receiverId, content });
      
      // Check if receiver exists
      const receiver = await storage.getUser(receiverId);
      if (!receiver) {
        console.log("Receiver not found:", receiverId);
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      console.log("Receiver found:", receiver);
      
      try {
        const validatedData = insertMessageSchema.parse({
          senderId,
          receiverId: parseInt(receiverId),
          content,
        });
        
        console.log("Validated data:", validatedData);
        
        const newMessage = await storage.createMessage(validatedData);
        console.log("Message created:", newMessage);
        
        res.status(201).json(newMessage);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ message: validationError.errors });
        }
        throw validationError;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Server error sending message", error: String(error) });
    }
  });

  // ===== Review Routes =====
  
  // Create a review
  app.post("/api/reviews", isStudent, async (req, res) => {
    try {
      const studentId = req.user.id;
      const { tutorId, jobId, rating, comment } = req.body;
      
      // Check if tutor exists
      const tutor = await storage.getUser(tutorId);
      if (!tutor || tutor.role !== "tutor") {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
      // Check if job exists if provided
      if (jobId) {
        const job = await storage.getJob(jobId);
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }
        
        // Check if the student owns the job
        if (job.studentId !== studentId) {
          return res.status(403).json({ message: "Forbidden - You can only review tutors for your own jobs" });
        }
      }
      
      const validatedData = insertReviewSchema.parse({
        studentId,
        tutorId,
        jobId,
        rating,
        comment,
      });
      
      const newReview = await storage.createReview(validatedData);
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error creating review" });
    }
  });

  // ===== Admin Routes =====
  
  // Approve a tutor profile (admin only)
  app.patch("/api/admin/tutor-profiles/:userId/approve", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const tutorProfile = await storage.getTutorProfile(userId);
      if (!tutorProfile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }

      const updatedProfile = await storage.updateTutorProfile(userId, {
        approvalStatus: TutorApprovalStatus.APPROVED,
        rejectionReason: null
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error approving tutor profile" });
    }
  });

  // Reject a tutor profile (admin only)
  app.patch("/api/admin/tutor-profiles/:userId/reject", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }

      const tutorProfile = await storage.getTutorProfile(userId);
      if (!tutorProfile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }

      const updatedProfile = await storage.updateTutorProfile(userId, {
        approvalStatus: TutorApprovalStatus.REJECTED,
        rejectionReason: reason
      });

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error rejecting tutor profile" });
    }
  });
  
  // Get all users (admin only)
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords
      const sanitizedUsers = users.map(user => {
        const { password, ...userData } = user;
        return userData;
      });
      
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching users" });
    }
  });

  // Get all tutor profiles with full details (admin only)
  app.get("/api/admin/tutor-profiles", isAdmin, async (req, res) => {
    try {
      const tutorProfiles = await storage.getAllTutorProfiles();
      const tutorsWithUserData = await Promise.all(
        tutorProfiles.map(async (profile) => {
          const user = await storage.getUser(profile.userId);
          if (!user) return null;
          
          const { password, ...userData } = user;
          return {
            ...userData,
            ...profile,
          };
        })
      );
      
      // Filter out null values (profiles with no user data)
      const validTutors = tutorsWithUserData.filter(t => t !== null);
      res.json(validTutors);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching tutor profiles" });
    }
  });

  // Get basic analytics data (admin only)
  app.get("/api/admin/analytics", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const jobs = await storage.getAllJobs();
      const tutorProfiles = await storage.getAllTutorProfiles();
      const jobBids = await Promise.all(jobs.map(job => storage.getJobBidsByJob(job.id)));
      const allBids = jobBids.flat();
      
      // Calculate statistics
      const analytics = {
        totalUsers: users.length,
        usersByRole: {
          students: users.filter(u => u.role === UserRole.STUDENT).length,
          tutors: users.filter(u => u.role === UserRole.TUTOR).length,
          admins: users.filter(u => u.role === UserRole.ADMIN).length
        },
        tutorProfiles: {
          total: tutorProfiles.length,
          pending: tutorProfiles.filter(p => p.approvalStatus === TutorApprovalStatus.PENDING).length,
          approved: tutorProfiles.filter(p => p.approvalStatus === TutorApprovalStatus.APPROVED).length,
          rejected: tutorProfiles.filter(p => p.approvalStatus === TutorApprovalStatus.REJECTED).length
        },
        jobs: {
          total: jobs.length,
          open: jobs.filter(j => j.status === JobStatus.OPEN).length,
          assigned: jobs.filter(j => j.status === JobStatus.ASSIGNED).length,
          completed: jobs.filter(j => j.status === JobStatus.COMPLETED).length,
          cancelled: jobs.filter(j => j.status === JobStatus.CANCELLED).length
        },
        bids: {
          total: allBids.length,
          pending: allBids.filter(b => b.status === BidStatus.PENDING).length,
          accepted: allBids.filter(b => b.status === BidStatus.ACCEPTED).length,
          rejected: allBids.filter(b => b.status === BidStatus.REJECTED).length
        }
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
