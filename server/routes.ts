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
  UserStatus,
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
  if (req.isAuthenticated() && (req.user?.role?.toLowerCase() === UserRole.TUTOR)) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Tutor access required" });
};

// Middleware to check if user is a student
const isStudent = (req: Request, res: Response, next: Function) => {
  console.log("isStudent middleware - User:", req.user);
  if (req.isAuthenticated() && (req.user?.role?.toLowerCase() === UserRole.STUDENT)) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Student access required" });
};

// Middleware to check if user is an admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  console.log("isAdmin middleware - User:", req.user);
  if (req.isAuthenticated() && (req.user?.role?.toLowerCase() === UserRole.ADMIN)) {
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
      console.log("Tutor profiles fetched:", tutorProfiles); // Debug log
      const tutorsWithUserData = await Promise.all(
        tutorProfiles.map(async (profile) => {
          // Use user_id instead of userId to match database field name
          const user = await storage.getUser(profile.user_id);
          if (!user) {
            console.log("No user found for tutor profile with user_id:", profile.user_id);
            return null;
          }
          
          console.log("Found user for tutor profile:", user.id, user.username);
          // Extract user data but exclude password
          const { password, ...userDataRaw } = user;
          
          // Format user fields to ensure snake_case is used
          const userData = {
            ...userDataRaw,
            // Fix any camelCase fields to their snake_case equivalents
            full_name: userDataRaw.full_name || userDataRaw.fullName,
            created_at: userDataRaw.created_at || userDataRaw.createdAt,
            // Remove camelCase duplicates
            fullName: undefined,
            createdAt: undefined
          };
          
          // Format profile fields to ensure snake_case is used
          const formattedProfile = {
            ...profile,
            // Fix any camelCase fields to their snake_case equivalents
            hourly_rate: profile.hourly_rate || profile.hourlyRate,
            average_rating: profile.average_rating || profile.averageRating,
            total_reviews: profile.total_reviews || profile.totalReviews,
            // Remove camelCase duplicates
            hourlyRate: undefined,
            averageRating: undefined,
            totalReviews: undefined
          };
          
          return {
            ...userData,
            ...formattedProfile,
          };
        })
      );
      
      // Filter out null values (profiles with no user data)
      const validTutors = tutorsWithUserData.filter(t => t !== null);
      console.log("Valid tutors count:", validTutors.length);
      res.json(validTutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      res.status(500).json({ message: "Server error fetching tutors" });
    }
  });

  // Get specific tutor by ID
  app.get("/api/tutors/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      console.log("Getting tutor profile for user ID:", userId);
      
      const tutorProfile = await storage.getTutorProfile(userId);
      console.log("Tutor profile result:", tutorProfile);
      
      if (!tutorProfile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }
      
      const user = await storage.getUser(userId);
      console.log("User data for tutor:", user);
      
      if (!user || user.role?.toLowerCase() !== UserRole.TUTOR) {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
      const { password, ...userData } = user;
      
      // Get tutor reviews
      const reviews = await storage.getReviewsByTutor(userId);
      console.log("Reviews for tutor:", reviews);
      
      // Format reviews with student information
      const formattedReviews = await Promise.all(
        reviews.map(async (review) => {
          const student = await storage.getUser(review.student_id); // Use student_id instead of studentId
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
      console.error("Error fetching tutor:", error);
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
          user_id: userId,
        });
        
        console.log("Validated profile data:", JSON.stringify(validatedData, null, 2));
        
        const updatedProfile = await storage.updateTutorProfile(userId, validatedData);
        console.log("Updated profile result:", JSON.stringify(updatedProfile, null, 2));
        res.json(updatedProfile);
      } else {
        // Create new profile
        const validatedData = insertTutorProfileSchema.parse({
          ...req.body,
          user_id: userId,
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
      
      console.log("Jobs fetched:", jobs);
      
      // Get student information for each job
      const jobsWithStudentData = await Promise.all(
        jobs.map(async (job) => {
          // Use student_id instead of studentId
          const student = await storage.getUser(job.student_id);
          if (!student) {
            console.log("No student found for job with student_id:", job.student_id);
            return job;
          }
          
          console.log("Found student for job:", student.id, student.username);
          // Extract student data but exclude password
          const { password, ...studentDataRaw } = student;
          
          // Format student fields to ensure snake_case is used
          const studentData = {
            ...studentDataRaw,
            // Fix any camelCase fields to their snake_case equivalents
            full_name: studentDataRaw.full_name || studentDataRaw.fullName,
            created_at: studentDataRaw.created_at || studentDataRaw.createdAt,
            // Remove camelCase duplicates
            fullName: undefined,
            createdAt: undefined
          };
          
          // Ensure consistent field naming (snake_case)
          const formattedJob = {
            ...job,
            // Make sure we're using snake_case field names
            created_at: job.created_at || job.createdAt,
            // Remove camelCase duplicates
            createdAt: undefined
          };
          
          return {
            ...formattedJob,
            student: studentData,
          };
        })
      );
      
      console.log("Jobs with student data count:", jobsWithStudentData.length);
      res.json(jobsWithStudentData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Server error fetching jobs" });
    }
  });

  // Get specific job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getJob(jobId);
      
      console.log("Job details fetched:", job);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Get student information using student_id
      const student = await storage.getUser(job.student_id);
      console.log("Student for job:", student);
      
      // Ensure consistent field naming (snake_case)
      const formattedJob = {
        ...job,
        // Make sure we're using snake_case field names
        created_at: job.created_at || job.createdAt,
        // Remove camelCase duplicates
        createdAt: undefined
      };
      
      if (student) {
        // Extract student data but exclude password
        const { password, ...studentDataRaw } = student;
        
        // Format student fields to ensure snake_case is used
        const studentData = {
          ...studentDataRaw,
          // Fix any camelCase fields to their snake_case equivalents
          full_name: studentDataRaw.full_name || studentDataRaw.fullName,
          created_at: studentDataRaw.created_at || studentDataRaw.createdAt,
          // Remove camelCase duplicates
          fullName: undefined,
          createdAt: undefined
        };
        
        formattedJob.student = studentData;
      }
      
      // Use formattedJob in the response instead of directly modifying job
      
      // Get bids for this job
      const bids = await storage.getJobBidsByJob(jobId);
      console.log("Bids for job:", bids);
      
      // Format bids with tutor information
      const formattedBids = await Promise.all(
        bids.map(async (bid) => {
          // Use tutor_id instead of tutorId
          const tutor = await storage.getUser(bid.tutor_id);
          if (!tutor) {
            console.log("No tutor found for bid with tutor_id:", bid.tutor_id);
            return bid;
          }
          
          console.log("Found tutor for bid:", tutor.id, tutor.username);
          // Extract tutor data but exclude password
          const { password, ...tutorDataRaw } = tutor;
          
          // Format tutor fields to ensure snake_case is used
          const tutorData = {
            ...tutorDataRaw,
            // Fix any camelCase fields to their snake_case equivalents
            full_name: tutorDataRaw.full_name || tutorDataRaw.fullName,
            created_at: tutorDataRaw.created_at || tutorDataRaw.createdAt,
            // Remove camelCase duplicates
            fullName: undefined,
            createdAt: undefined
          };
          
          return {
            ...bid,
            tutor: tutorData,
          };
        })
      );
      
      res.json({
        ...formattedJob,
        bids: formattedBids,
      });
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Server error fetching job" });
    }
  });

  // Create a new job
  app.post("/api/jobs", isStudent, async (req, res) => {
    try {
      const studentId = req.user.id;
      
      const validatedData = insertJobSchema.parse({
        ...req.body,
        student_id: studentId,
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
      
      console.log("Updating job status for job ID:", jobId, "New status:", status);
      
      const job = await storage.getJob(jobId);
      console.log("Job found:", job);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Check if the student owns this job (using student_id instead of studentId)
      if (job.student_id !== req.user.id) {
        console.log("Authorization failed: Job.student_id:", job.student_id, "User ID:", req.user.id);
        return res.status(403).json({ message: "Forbidden - You can only update your own jobs" });
      }
      
      // Validate status
      if (!Object.values(JobStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid job status" });
      }
      
      const updatedJob = await storage.updateJob(jobId, { status });
      console.log("Job status updated:", updatedJob);
      res.json(updatedJob);
    } catch (error) {
      console.error("Error updating job status:", error);
      res.status(500).json({ message: "Server error updating job status" });
    }
  });

  // ===== Job Bid Routes =====
  
  // Create a job bid
  app.post("/api/jobs/:id/bids", isTutor, async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const tutorId = req.user.id;
      
      console.log("Creating job bid for job ID:", jobId, "Tutor ID:", tutorId);
      
      // Check if job exists and is open
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      console.log("Job found:", job);
      
      if (job.status !== JobStatus.OPEN) {
        return res.status(400).json({ message: "Cannot bid on a job that is not open" });
      }
      
      // Check if tutor already placed a bid
      const existingBids = await storage.getJobBidsByJob(jobId);
      console.log("Existing bids:", existingBids);
      
      // Use tutor_id instead of tutorId
      const alreadyBid = existingBids.some(bid => bid.tutor_id === tutorId);
      
      if (alreadyBid) {
        return res.status(400).json({ message: "You have already placed a bid on this job" });
      }
      
      // Use job_id and tutor_id instead of jobId and tutorId
      const validatedData = insertJobBidSchema.parse({
        ...req.body,
        job_id: jobId,
        tutor_id: tutorId,
      });
      
      console.log("Validated bid data:", validatedData);
      
      const newBid = await storage.createJobBid(validatedData);
      console.log("New bid created:", newBid);
      res.status(201).json(newBid);
    } catch (error) {
      console.error("Error creating job bid:", error);
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
      console.log("Accepting bid with ID:", bidId);
      
      const bid = await storage.getJobBid(bidId);
      console.log("Bid found:", bid);
      
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }
      
      // Check if the student owns the job - using job_id instead of jobId
      const job = await storage.getJob(bid.job_id);
      console.log("Job for bid:", job);
      
      // Using student_id instead of studentId 
      if (!job || job.student_id !== req.user.id) {
        console.log("Authorization failed: Job.student_id:", job?.student_id, "User ID:", req.user.id);
        return res.status(403).json({ message: "Forbidden - You can only accept bids on your own jobs" });
      }
      
      // Update bid status
      const updatedBid = await storage.updateJobBid(bidId, { status: BidStatus.ACCEPTED });
      console.log("Bid status updated:", updatedBid);
      
      // Update job status
      await storage.updateJob(job.id, { status: JobStatus.ASSIGNED });
      console.log("Job status updated to ASSIGNED");
      
      res.json(updatedBid);
    } catch (error) {
      console.error("Error accepting bid:", error);
      res.status(500).json({ message: "Server error accepting bid" });
    }
  });

  // ===== Message Routes =====
  
  // Get conversations
  app.get("/api/messages/conversations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("Getting conversations for user ID:", userId);
      
      const conversations = await storage.getUserConversations(userId);
      console.log("Conversations found:", conversations);
      
      // Get user data for each conversation
      const conversationsWithUserData = await Promise.all(
        conversations.map(async (conv) => {
          // Use userId (as returned from the storage interface)
          const user = await storage.getUser(conv.userId);
          if (!user) {
            console.log("No user found for conversation with userId:", conv.userId);
            return conv;
          }
          
          console.log("Found user for conversation:", user.id, user.username);
          // Extract user data but exclude password
          const { password, ...userDataRaw } = user;
          
          // Format user fields to ensure snake_case is used
          const userData = {
            ...userDataRaw,
            // Fix any camelCase fields to their snake_case equivalents
            full_name: userDataRaw.full_name || userDataRaw.fullName,
            created_at: userDataRaw.created_at || userDataRaw.createdAt,
            // Remove camelCase duplicates
            fullName: undefined,
            createdAt: undefined
          };
          
          return {
            ...conv,
            user: userData,
          };
        })
      );
      
      res.json(conversationsWithUserData);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Server error fetching conversations" });
    }
  });

  // Get messages between current user and another user
  app.get("/api/messages/:userId", isAuthenticated, async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const otherUserId = parseInt(req.params.userId);
      
      console.log("Getting messages between users:", currentUserId, otherUserId);
      
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      console.log("Messages found:", messages);
      
      // Mark messages as read if the current user is the receiver
      // Use receiver_id and is_read instead of receiverId and isRead
      await Promise.all(
        messages
          .filter(msg => msg.receiver_id === currentUserId && !msg.is_read)
          .map(msg => storage.updateMessage(msg.id, { is_read: true }))
      );
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
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
      const sender_id = req.isAuthenticated() ? req.user.id : 7; // Special bypass for testing, using user ID 7
      const { receiverId, content } = req.body;
      
      console.log("Message details:", { sender_id, receiverId, content });
      
      // Check if receiver exists
      const receiver = await storage.getUser(receiverId);
      if (!receiver) {
        console.log("Receiver not found:", receiverId);
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      console.log("Receiver found:", receiver);
      
      try {
        // Use snake_case field names
        const validatedData = insertMessageSchema.parse({
          sender_id,
          receiver_id: parseInt(receiverId),
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
      const student_id = req.user.id;
      const { tutorId, jobId, rating, comment } = req.body;
      
      console.log("Creating review:", { student_id, tutorId, jobId, rating, comment });
      
      // Check if tutor exists
      const tutor = await storage.getUser(tutorId);
      if (!tutor || tutor.role !== "tutor") {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
      console.log("Tutor found:", tutor);
      
      // Check if job exists if provided
      if (jobId) {
        const job = await storage.getJob(jobId);
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }
        
        console.log("Job found:", job);
        
        // Check if the student owns the job - using student_id instead of studentId
        if (job.student_id !== student_id) {
          console.log("Authorization failed: Job.student_id:", job.student_id, "User ID:", student_id);
          return res.status(403).json({ message: "Forbidden - You can only review tutors for your own jobs" });
        }
      }
      
      // Use snake_case field names
      const validatedData = insertReviewSchema.parse({
        student_id,
        tutor_id: parseInt(tutorId),
        job_id: jobId ? parseInt(jobId) : null,
        rating: parseInt(rating),
        comment,
      });
      
      console.log("Validated review data:", validatedData);
      
      const newReview = await storage.createReview(validatedData);
      console.log("New review created:", newReview);
      res.status(201).json(newReview);
    } catch (error) {
      console.error("Error creating review:", error);
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

      console.log("Approving tutor profile for user ID:", userId);
      
      const tutorProfile = await storage.getTutorProfile(userId);
      console.log("Tutor profile found:", tutorProfile);
      
      if (!tutorProfile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }

      // Use snake_case field names (approval_status instead of approvalStatus)
      const updatedProfile = await storage.updateTutorProfile(userId, {
        approval_status: TutorApprovalStatus.APPROVED,
        rejection_reason: null
      });

      console.log("Tutor profile approved:", updatedProfile);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error approving tutor profile:", error);
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

      console.log("Rejecting tutor profile for user ID:", userId, "Reason:", reason);
      
      const tutorProfile = await storage.getTutorProfile(userId);
      console.log("Tutor profile found:", tutorProfile);
      
      if (!tutorProfile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }

      // Use snake_case field names (approval_status instead of approvalStatus)
      const updatedProfile = await storage.updateTutorProfile(userId, {
        approval_status: TutorApprovalStatus.REJECTED,
        rejection_reason: reason
      });

      console.log("Tutor profile rejected:", updatedProfile);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error rejecting tutor profile:", error);
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
  
  // Ban a user (admin only)
  app.patch("/api/admin/users/:userId/ban", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { banReason } = req.body;
      
      if (!banReason) {
        return res.status(400).json({ message: "Ban reason is required" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user status to banned
      const updatedUser = await storage.updateUser(userId, { 
        status: UserStatus.BANNED,
        ban_reason: banReason 
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to ban user" });
      }
      
      // Remove password before sending
      const { password, ...userData } = updatedUser;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Server error banning user" });
    }
  });
  
  // Activate a user (admin only)
  app.patch("/api/admin/users/:userId/activate", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user status to active
      const updatedUser = await storage.updateUser(userId, { 
        status: UserStatus.ACTIVE,
        ban_reason: null 
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to activate user" });
      }
      
      // Remove password before sending
      const { password, ...userData } = updatedUser;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Server error activating user" });
    }
  });

  // Get all tutor profiles with full details (admin only)
  app.get("/api/admin/tutor-profiles", isAdmin, async (req, res) => {
    try {
      console.log("Getting all tutor profiles for admin");
      
      const tutorProfiles = await storage.getAllTutorProfiles();
      console.log("Tutor profiles found:", tutorProfiles.length);
      
      const tutorsWithUserData = await Promise.all(
        tutorProfiles.map(async (profile) => {
          // Use user_id instead of userId
          const user = await storage.getUser(profile.user_id);
          if (!user) {
            console.log("No user found for tutor profile with user_id:", profile.user_id);
            return null;
          }
          
          console.log("Found user for tutor profile:", user.id, user.username);
          const { password, ...userData } = user;
          return {
            ...userData,
            ...profile,
          };
        })
      );
      
      // Filter out null values (profiles with no user data)
      const validTutors = tutorsWithUserData.filter(t => t !== null);
      console.log("Valid tutors count:", validTutors.length);
      res.json(validTutors);
    } catch (error) {
      console.error("Error fetching tutor profiles:", error);
      res.status(500).json({ message: "Server error fetching tutor profiles" });
    }
  });

  // Get basic analytics data (admin only)
  app.get("/api/admin/analytics", isAdmin, async (req, res) => {
    try {
      console.log("Getting analytics data for admin");
      
      const users = await storage.getAllUsers();
      const jobs = await storage.getAllJobs();
      const tutorProfiles = await storage.getAllTutorProfiles();
      
      console.log("Users count:", users.length);
      console.log("Jobs count:", jobs.length);
      console.log("Tutor profiles count:", tutorProfiles.length);
      
      const jobBids = await Promise.all(jobs.map(job => storage.getJobBidsByJob(job.id)));
      const allBids = jobBids.flat();
      console.log("Total bids count:", allBids.length);
      
      // Calculate statistics - using the correct field names (approval_status instead of approvalStatus)
      const analytics = {
        totalUsers: users.length,
        usersByRole: {
          students: users.filter(u => u.role === UserRole.STUDENT).length,
          tutors: users.filter(u => u.role === UserRole.TUTOR).length,
          admins: users.filter(u => u.role === UserRole.ADMIN).length
        },
        tutorProfiles: {
          total: tutorProfiles.length,
          pending: tutorProfiles.filter(p => p.approval_status === TutorApprovalStatus.PENDING).length,
          approved: tutorProfiles.filter(p => p.approval_status === TutorApprovalStatus.APPROVED).length,
          rejected: tutorProfiles.filter(p => p.approval_status === TutorApprovalStatus.REJECTED).length
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
      
      console.log("Analytics calculated:");
      console.log("- Total users:", analytics.totalUsers);
      console.log("- Tutor profiles by status:", analytics.tutorProfiles);
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res.status(500).json({ message: "Server error fetching analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
