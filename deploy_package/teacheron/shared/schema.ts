import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types
export const UserRole = {
  STUDENT: "student",
  TUTOR: "tutor",
  ADMIN: "admin",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").$type<UserRoleType>().notNull(),
  bio: text("bio"),
  location: text("location"),
  hourlyRate: integer("hourly_rate"),
  profileImageUrl: text("profile_image_url"),
  isOnline: boolean("is_online").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email format"),
  });

// Tutor profile
// Tutor approval status type
export const TutorApprovalStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type TutorApprovalStatusType = (typeof TutorApprovalStatus)[keyof typeof TutorApprovalStatus];

export const tutorProfiles = pgTable("tutor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  education: text("education"),
  experience: text("experience"),
  languages: text("languages"),
  hourlyRate: integer("hourly_rate"),
  subjects: text("subjects").notNull(),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  location: text("location"),
  averageRating: doublePrecision("average_rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  approvalStatus: text("approval_status").$type<TutorApprovalStatusType>().default(TutorApprovalStatus.PENDING),
  rejectionReason: text("rejection_reason"),
});

export const insertTutorProfileSchema = createInsertSchema(tutorProfiles).omit({
  id: true,
  averageRating: true,
  totalReviews: true,
  approvalStatus: true,
  rejectionReason: true,
});

// Job postings
export const JobStatus = {
  OPEN: "open",
  ASSIGNED: "assigned",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type JobStatusType = (typeof JobStatus)[keyof typeof JobStatus];

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subjects: text("subjects").notNull(),
  location: text("location").notNull(),
  hoursPerWeek: integer("hours_per_week"),
  budget: text("budget").notNull(),
  status: text("status").$type<JobStatusType>().default(JobStatus.OPEN),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Job bids from tutors
export const BidStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type BidStatusType = (typeof BidStatus)[keyof typeof BidStatus];

export const jobBids = pgTable("job_bids", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  tutorId: integer("tutor_id").notNull(),
  proposal: text("proposal").notNull(),
  bidAmount: integer("bid_amount").notNull(),
  status: text("status").$type<BidStatusType>().default(BidStatus.PENDING),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobBidSchema = createInsertSchema(jobBids).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Messages between users
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  tutorId: integer("tutor_id").notNull(),
  jobId: integer("job_id"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TutorProfile = typeof tutorProfiles.$inferSelect;
export type InsertTutorProfile = z.infer<typeof insertTutorProfileSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type JobBid = typeof jobBids.$inferSelect;
export type InsertJobBid = z.infer<typeof insertJobBidSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
