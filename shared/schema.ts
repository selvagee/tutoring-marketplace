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

// User status types
export const UserStatus = {
  ACTIVE: "active",
  PENDING: "pending",
  BANNED: "banned",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  full_name: text("full_name").notNull(),
  role: text("role").$type<UserRoleType>().notNull(),
  status: text("status").$type<UserStatusType>().default(UserStatus.ACTIVE),
  ban_reason: text("ban_reason"),
  bio: text("bio"),
  location: text("location"),
  hourly_rate: integer("hourly_rate"),
  profile_image_url: text("profile_image_url"),
  is_online: boolean("is_online").default(false),
  created_at: timestamp("created_at").defaultNow(),
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
  user_id: integer("user_id").notNull(),
  education: text("education"),
  experience: text("experience"),
  languages: text("languages"),
  hourly_rate: integer("hourly_rate"),
  subjects: text("subjects").notNull(),
  bio: text("bio"),
  profile_image_url: text("profile_image_url"),
  location: text("location"),
  average_rating: doublePrecision("average_rating").default(0),
  total_reviews: integer("total_reviews").default(0),
  approval_status: text("approval_status").$type<TutorApprovalStatusType>().default(TutorApprovalStatus.PENDING),
  rejection_reason: text("rejection_reason"),
});

export const insertTutorProfileSchema = createInsertSchema(tutorProfiles).omit({
  id: true,
  average_rating: true,
  total_reviews: true,
  approval_status: true,
  rejection_reason: true,
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
  student_id: integer("student_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subjects: text("subjects").notNull(),
  location: text("location").notNull(),
  hours_per_week: integer("hours_per_week"),
  budget: text("budget").notNull(),
  status: text("status").$type<JobStatusType>().default(JobStatus.OPEN),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  created_at: true,
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
  job_id: integer("job_id").notNull(),
  tutor_id: integer("tutor_id").notNull(),
  message: text("message").notNull(),
  rate: integer("rate").notNull(),
  status: text("status").$type<BidStatusType>().default(BidStatus.PENDING),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertJobBidSchema = createInsertSchema(jobBids).omit({
  id: true,
  created_at: true,
  status: true,
});

// Messages between users
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sender_id: integer("sender_id").notNull(),
  receiver_id: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  created_at: true,
  is_read: true,
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  student_id: integer("student_id").notNull(),
  tutor_id: integer("tutor_id").notNull(),
  job_id: integer("job_id"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  created_at: true,
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
