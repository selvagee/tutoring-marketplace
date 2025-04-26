import { db } from './db';
import { 
  users, tutorProfiles, jobs, jobBids, messages, reviews,
  UserRole, JobStatus, BidStatus, TutorApprovalStatus, UserStatus 
} from '@shared/schema';
import { hashPassword } from './auth';

// Clear all existing data
async function clearDatabase() {
  console.log('Clearing existing data...');
  
  // Delete in reverse order of dependencies
  await db.delete(reviews);
  await db.delete(messages);
  await db.delete(jobBids);
  await db.delete(jobs);
  await db.delete(tutorProfiles);
  await db.delete(users);
  
  console.log('Database cleared successfully');
}

// Seed users (tutors, students, admin)
async function seedUsers() {
  console.log('Seeding users...');
  
  // Common password for all test users
  const commonPassword = await hashPassword('password123');
  
  // Create admin
  const [admin] = await db.insert(users).values({
    username: 'admin',
    password: commonPassword,
    email: 'admin@teacheron.com',
    full_name: 'Admin User',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    created_at: new Date()
  }).returning();
  
  console.log('Admin created:', admin.id);
  
  // Create tutors
  const tutorData = [
    {
      username: 'tutor1',
      password: commonPassword,
      email: 'tutor1@example.com',
      full_name: 'John Smith',
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
      created_at: new Date()
    },
    {
      username: 'tutor2',
      password: commonPassword,
      email: 'tutor2@example.com',
      full_name: 'Emily Johnson',
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
      created_at: new Date()
    },
    {
      username: 'tutor3',
      password: commonPassword,
      email: 'tutor3@example.com',
      full_name: 'David Williams',
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
      created_at: new Date()
    },
    {
      username: 'selvagee',
      password: commonPassword,
      email: 'selvagee@gmail.com',
      full_name: 'Selvagee Ravi',
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
      created_at: new Date()
    }
  ];
  
  const tutors = await db.insert(users).values(tutorData).returning();
  console.log(`${tutors.length} tutors created`);
  
  // Create students
  const studentData = [
    {
      username: 'student1',
      password: commonPassword,
      email: 'student1@example.com',
      full_name: 'Sarah Brown',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      created_at: new Date()
    },
    {
      username: 'student2',
      password: commonPassword,
      email: 'student2@example.com',
      full_name: 'Michael Davis',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      created_at: new Date()
    },
    {
      username: 'student3',
      password: commonPassword,
      email: 'student3@example.com',
      full_name: 'Jennifer Wilson',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      created_at: new Date()
    }
  ];
  
  const students = await db.insert(users).values(studentData).returning();
  console.log(`${students.length} students created`);
  
  return { admin, tutors, students };
}

// Seed tutor profiles
async function seedTutorProfiles(tutors: any[]) {
  console.log('Seeding tutor profiles...');
  
  const profileData = tutors.map((tutor, index) => {
    const subjects = [
      "Mathematics, Physics, Computer Science",
      "English, Literature, Writing",
      "Biology, Chemistry, Science",
      "Computer Programming, Web Development, Data Science"
    ][index % 4];
    
    const bio = [
      "Experienced tutor with a passion for teaching sciences. I specialize in making complex concepts easy to understand.",
      "I love helping students improve their writing and analytical skills. I have 5 years of experience teaching at university level.",
      "Certified teacher with expertise in biology and chemistry. I make learning fun and engaging!",
      "Software developer with 10+ years of industry experience. I can help you master programming fundamentals and advanced topics."
    ][index % 4];
    
    return {
      user_id: tutor.id,
      bio,
      subjects,
      hourly_rate: 25 + (index * 5),
      location: ["New York", "Los Angeles", "Chicago", "Houston"][index % 4],
      education: ["Ph.D. in Physics", "Master's in English Literature", "B.Sc in Biology", "M.Sc in Computer Science"][index % 4],
      experience: `${3 + (index * 2)} years of tutoring experience`,
      languages: "English, Spanish",
      profile_image_url: `/assets/tutor${index + 1}.jpg`,
      approval_status: TutorApprovalStatus.APPROVED
    };
  });
  
  const tutorProfilesResult = await db.insert(tutorProfiles).values(profileData).returning();
  console.log(`${tutorProfilesResult.length} tutor profiles created`);
  
  return tutorProfilesResult;
}

// Seed jobs
async function seedJobs(students: any[]) {
  console.log('Seeding jobs...');
  
  const jobData = [
    {
      title: "Calculus Tutor Needed for AP Exam Prep",
      description: "I'm a high school student preparing for the AP Calculus AB exam and need help with derivatives and integrals.",
      subjects: "Mathematics, Calculus",
      location: "Online",
      hours_per_week: 4,
      budget: "$30-40/hour",
      student_id: students[0].id,
      status: JobStatus.OPEN,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      title: "English Literature Tutoring for College Essays",
      description: "Looking for an experienced English tutor to help review and improve my college application essays.",
      subjects: "English, Writing",
      location: "New York",
      hours_per_week: 2,
      budget: "$25-35/hour",
      student_id: students[1].id,
      status: JobStatus.OPEN,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      title: "Physics Help for High School Student",
      description: "Need help understanding mechanics and electromagnetism concepts for my high school physics class.",
      subjects: "Physics",
      location: "Online",
      hours_per_week: 3,
      budget: "$20-30/hour",
      student_id: students[2].id,
      status: JobStatus.OPEN,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      title: "Programming Tutor for JavaScript Beginner",
      description: "I'm learning JavaScript and need help with functions, objects, and basic DOM manipulation.",
      subjects: "Computer Science, Programming",
      location: "Chicago",
      hours_per_week: 5,
      budget: "$35-45/hour",
      student_id: students[0].id,
      status: JobStatus.OPEN,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ];
  
  const jobsResult = await db.insert(jobs).values(jobData).returning();
  console.log(`${jobsResult.length} jobs created`);
  
  return jobsResult;
}

// Seed job bids
async function seedJobBids(tutors: any[], jobs: any[]) {
  console.log('Seeding job bids...');
  
  const bidData = [
    {
      job_id: jobs[0].id,
      tutor_id: tutors[0].id,
      // Use column names that match the actual database schema
      message: "I have extensive experience tutoring AP Calculus and have helped many students succeed on their exams. I can provide focused practice on derivatives and integrals.",
      rate: 35,
      status: BidStatus.PENDING,
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      job_id: jobs[0].id,
      tutor_id: tutors[2].id,
      message: "I'm a math tutor with 5 years of experience helping students prepare for AP exams. I can provide comprehensive materials and practice problems.",
      rate: 30,
      status: BidStatus.PENDING,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      job_id: jobs[1].id,
      tutor_id: tutors[1].id,
      message: "I specialize in college essay writing and have helped dozens of students get accepted to their top choice schools. I'd love to help you craft compelling essays.",
      rate: 30,
      status: BidStatus.PENDING,
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      job_id: jobs[2].id,
      tutor_id: tutors[0].id,
      message: "Physics is my specialty, and I'm confident I can help you understand these concepts. I use lots of practical examples to make the material relatable.",
      rate: 25,
      status: BidStatus.PENDING,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      job_id: jobs[3].id,
      tutor_id: tutors[2].id,
      message: "I'm a professional software developer who specializes in JavaScript. I can help you get up to speed with hands-on exercises and real-world examples.",
      rate: 40,
      status: BidStatus.PENDING,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];
  
  const bids = await db.insert(jobBids).values(bidData).returning();
  console.log(`${bids.length} job bids created`);
  
  return bids;
}

// Seed messages
async function seedMessages(users: any[]) {
  console.log('Seeding messages...');
  
  const allUsers = users.tutors.concat(users.students);
  allUsers.push(users.admin);
  
  const messageData = [];
  
  // Generate some messages between users
  for (let i = 0; i < allUsers.length; i++) {
    for (let j = i + 1; j < allUsers.length; j++) {
      if (Math.random() > 0.5) { // Only create conversations for some user pairs
        const numMessages = Math.floor(Math.random() * 5) + 1; // 1-5 messages
        
        for (let k = 0; k < numMessages; k++) {
          // Randomly decide sender and receiver
          const sender = Math.random() > 0.5 ? allUsers[i] : allUsers[j];
          const receiver = sender === allUsers[i] ? allUsers[j] : allUsers[i];
          
          const messageContent = [
            "Hello, I'm interested in your tutoring services. Are you available?",
            "I saw your job post and would like to apply. Can we discuss the details?",
            "Thanks for your message. I'm available to start next week.",
            "I have experience with this subject and would be happy to help you.",
            "What times are you available for tutoring sessions?",
            "Do you prefer online or in-person tutoring?",
            "I charge $30 per hour for this subject. Does that work for you?",
            "I'm looking forward to our first session!"
          ][Math.floor(Math.random() * 8)];
          
          messageData.push({
            sender_id: sender.id,
            receiver_id: receiver.id,
            content: messageContent,
            is_read: Math.random() > 0.3, // 70% chance of being read
            created_at: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
          });
        }
      }
    }
  }
  
  const messagesResult = await db.insert(messages).values(messageData).returning();
  console.log(`${messagesResult.length} messages created`);
  
  return messagesResult;
}

// Seed reviews
async function seedReviews(tutors: any[], students: any[], jobs: any[]) {
  console.log('Seeding reviews...');
  
  // Create some sample reviews
  const reviewData = tutors.map((tutor, index) => {
    const student = students[index % students.length];
    const job = jobs[index % jobs.length];
    
    return {
      tutor_id: tutor.id,
      student_id: student.id,
      job_id: job.id,
      rating: 4 + (index % 2), // Ratings between 4-5
      comment: [
        "Great tutor! Very knowledgeable and patient.",
        "Helped me understand difficult concepts easily. Highly recommended!",
        "Excellent teaching skills and very reliable.",
        "Amazing tutor who really cares about student success."
      ][index % 4],
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    };
  });
  
  const reviewsResult = await db.insert(reviews).values(reviewData).returning();
  console.log(`${reviewsResult.length} reviews created`);
  
  return reviewsResult;
}

// Main function to seed all data
export async function seedAll() {
  try {
    await clearDatabase();
    
    const users = await seedUsers();
    const tutorProfiles = await seedTutorProfiles(users.tutors);
    const jobs = await seedJobs(users.students);
    const bids = await seedJobBids(users.tutors, jobs);
    const messages = await seedMessages(users);
    const reviews = await seedReviews(users.tutors, users.students, jobs);
    
    console.log('Database seeding completed successfully!');
    
    return {
      users,
      tutorProfiles,
      jobs,
      bids,
      messages,
      reviews
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// This ES module is always run directly when imported with tsx
// No need for require.main check in ES modules
if (import.meta.url.includes('seedDatabase')) {
  seedAll()
    .then(() => {
      console.log('Seeding finished!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}