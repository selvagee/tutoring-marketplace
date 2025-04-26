import { Link } from "wouter";
import { ArrowRight, Search, Calendar, MessageCircle, Star, Clock, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">How TeacherOn Works</h1>
        
        <p className="text-xl mb-12 text-center">
          We've designed TeacherOn to be simple and effective, connecting students with qualified tutors in just a few steps.
        </p>
        
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">For Students</h2>
          
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">1. Find the Perfect Tutor</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Browse through our extensive database of qualified tutors. Filter by subject, price range, rating, and availability to find the perfect match for your learning needs.
                </p>
                <Link href="/tutors" className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center">
                  Search for Tutors <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 md:order-2 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="md:w-2/3 md:order-1">
                <h3 className="text-2xl font-bold mb-4">2. Connect and Discuss</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Reach out to tutors directly through our messaging system. Discuss your learning goals, schedule, and any specific needs you might have before committing.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">3. Schedule Sessions</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Arrange tutoring sessions at times that work for both you and your tutor. Our platform helps manage scheduling, reminders, and session confirmations.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 md:order-2 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
                  <Star className="w-12 h-12 text-orange-600" />
                </div>
              </div>
              <div className="md:w-2/3 md:order-1">
                <h3 className="text-2xl font-bold mb-4">4. Learn and Review</h3>
                <p className="text-lg text-gray-700 mb-4">
                  After your sessions, leave feedback and ratings for your tutor. This helps maintain quality and assists other students in finding the right tutors.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-blue-50 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Need Specific Help?</h3>
            <p className="text-lg mb-6">
              You can also post a specific job detailing exactly what you need help with and let tutors come to you with personalized proposals.
            </p>
            <Link href="/post-job" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Post a Tutoring Job
            </Link>
          </div>
        </div>
        
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">For Tutors</h2>
          
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-indigo-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">1. Create Your Profile</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Build a comprehensive tutor profile highlighting your expertise, qualifications, teaching style, and availability. A complete profile attracts more students.
                </p>
                <Link href="/auth" className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center">
                  Register as a Tutor <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 md:order-2 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                  <Search className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <div className="md:w-2/3 md:order-1">
                <h3 className="text-2xl font-bold mb-4">2. Find Tutoring Opportunities</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Browse tutoring job postings from students or wait for students to discover your profile. You can also bid on specific job postings with customized proposals.
                </p>
                <Link href="/jobs" className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center">
                  Browse Available Jobs <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-yellow-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">3. Connect with Students</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Use our messaging system to communicate with potential students, understand their needs, and establish a tutoring relationship built on clear expectations.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 md:order-2 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
                  <Clock className="w-12 h-12 text-teal-600" />
                </div>
              </div>
              <div className="md:w-2/3 md:order-1">
                <h3 className="text-2xl font-bold mb-4">4. Teach and Build Your Reputation</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Deliver high-quality tutoring sessions and encourage your students to leave reviews. Positive reviews help you build your reputation and attract more students.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-green-50 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Teaching?</h3>
            <p className="text-lg mb-6">
              Join our community of tutors and start sharing your knowledge with students from around the world.
            </p>
            <Link href="/auth" className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Become a Tutor
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">How much does it cost to use TeacherOn?</h3>
              <p className="text-gray-700">
                TeacherOn is free to join for both students and tutors. Students pay tutors directly for their services, and tutors set their own rates.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">How are tutors verified?</h3>
              <p className="text-gray-700">
                Tutors go through a verification process that includes identity verification and credential checks. Additionally, student reviews provide social proof of a tutor's effectiveness.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Can I try a tutor before committing to multiple sessions?</h3>
              <p className="text-gray-700">
                Yes, many tutors offer trial sessions or consultations. You can discuss this possibility with any tutor through our messaging system.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">What subjects are available for tutoring?</h3>
              <p className="text-gray-700">
                TeacherOn supports tutoring in a wide range of subjects, from academic subjects like mathematics and science to language learning, music, and professional skills.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/tutors" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Find a Tutor
            </Link>
            <Link href="/auth" className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Become a Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}