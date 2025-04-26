import { Link } from "wouter";
import { Star } from "lucide-react";

export default function SuccessStories() {
  // Sample rating stars component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Success Stories</h1>
      
      <p className="text-xl mb-12">
        Discover how TeacherOn has transformed learning experiences for students and tutors alike.
      </p>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-500 relative">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-600 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">Michael's Journey</h3>
                  <p className="text-blue-100">From Struggling Student to Top Performer</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Mathematics Tutoring</span>
                  </div>
                  <RatingStars rating={5} />
                </div>
                <p className="mb-6">
                  "I was struggling with calculus and falling behind in my engineering program. After just 
                  two months of sessions with my tutor on TeacherOn, I not only caught up but ended up 
                  with the highest grade in my class on the final exam."
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Michael was facing potential academic probation due to his struggling grades in advanced 
                  calculus. Through TeacherOn, he connected with Dr. Sarah, a PhD mathematician who specialized 
                  in teaching engineering students. Their twice-weekly sessions transformed Michael's understanding 
                  of the material and his confidence in the subject.
                </p>
                <div className="font-semibold">
                  Michael J. - Engineering Student, Stanford University
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-purple-400 to-purple-500 relative">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-purple-600 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">Emma's Language Breakthrough</h3>
                  <p className="text-purple-100">From Beginner to Conversational in 3 Months</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Language Learning (Spanish)</span>
                  </div>
                  <RatingStars rating={5} />
                </div>
                <p className="mb-6">
                  "I needed to learn Spanish quickly for an upcoming job relocation to Madrid. Through 
                  TeacherOn, I found a native Spanish tutor who customized lessons to my specific needs. 
                  Within three months, I was comfortable having basic conversations in Spanish!"
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Emma had tried language apps before but found they didn't prepare her for real-world 
                  conversations. Her TeacherOn tutor, Carlos, focused on practical vocabulary and common 
                  phrases used in business settings. They practiced through role-playing scenarios relevant 
                  to Emma's work in marketing.
                </p>
                <div className="font-semibold">
                  Emma R. - Marketing Executive, London
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <RatingStars rating={5} />
              </div>
              <p className="mb-4 italic">
                "My son went from hating math to looking forward to his sessions. His grades improved from 
                a C- to an A in just one semester."
              </p>
              <div className="font-semibold">
                Jennifer T. - Parent of 7th Grader
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <RatingStars rating={5} />
              </div>
              <p className="mb-4 italic">
                "As a working professional, I needed flexible tutoring hours for my MBA coursework. TeacherOn 
                connected me with the perfect tutor who could meet on weekends."
              </p>
              <div className="font-semibold">
                Raymond C. - MBA Student
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <RatingStars rating={4} />
              </div>
              <p className="mb-4 italic">
                "Preparing for the LSAT seemed overwhelming until I found my tutor on TeacherOn. I increased my 
                practice test scores by 12 points!"
              </p>
              <div className="font-semibold">
                Aisha K. - Law School Applicant
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Tutor Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">From Part-time to Full-time Tutoring</h3>
              <p className="mb-4">
                Robert was a high school science teacher looking to earn extra income on weekends. 
                After creating his profile on TeacherOn, he began receiving so many requests that he 
                eventually transitioned to full-time tutoring, doubling his previous income.
              </p>
              <p className="mb-4">
                "TeacherOn gave me the platform to share my teaching expertise with a wider audience. 
                The flexibility allows me to teach students from around the world while maintaining a 
                healthy work-life balance. I'm now earning more than I did as a classroom teacher, with 
                fewer hours and more satisfaction."
              </p>
              <div className="font-semibold">
                Robert M. - Science Tutor, Former High School Teacher
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Building a Specialized Tutoring Business</h3>
              <p className="mb-4">
                Priya had deep expertise in coding and web development but didn't know how to reach 
                students who needed her skills. Through TeacherOn, she built a niche tutoring business 
                focused on teaching programming to women returning to the workforce after career breaks.
              </p>
              <p className="mb-4">
                "Finding students with specific needs was challenging before TeacherOn. Now, students who 
                specifically want to learn coding in a supportive environment can find me easily. I've 
                helped over 50 women transition into tech careers in the past year alone."
              </p>
              <div className="font-semibold">
                Priya T. - Web Development & Coding Tutor
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Academic Achievement Stories</h2>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4">From Academic Probation to Dean's List</h3>
            <div className="mb-4 flex items-center">
              <RatingStars rating={5} />
              <span className="ml-2 text-gray-600">Chemistry Tutoring</span>
            </div>
            <p className="mb-6">
              David was struggling with organic chemistry and at risk of losing his scholarship. After 
              connecting with a TeacherOn tutor who specialized in pre-med sciences, he not only passed 
              the course but earned an A-.
            </p>
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p className="italic mb-2">
                "I was ready to change my major because of one challenging course. My tutor didn't just 
                help me understand the material—he showed me how to think like a chemist. The strategies 
                I learned helped me in all my science courses."
              </p>
              <div className="font-semibold">
                David L. - Pre-Med Student
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-2">The Approach:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Twice-weekly sessions focused on underlying concepts rather than memorization</li>
                <li>Visual learning techniques to understand molecular interactions</li>
                <li>Practice problems that mirrored exam questions</li>
                <li>Study skills coaching specific to science courses</li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">SAT Score Improvement</h3>
              <div className="mb-3 flex items-center">
                <RatingStars rating={5} />
              </div>
              <p className="mb-4">
                "My daughter increased her SAT score by 320 points after working with her TeacherOn 
                tutor for just six weeks. This opened up scholarship opportunities that made her dream 
                school affordable."
              </p>
              <div className="font-semibold">
                Sandra M. - Parent
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Dissertation Support</h3>
              <div className="mb-3 flex items-center">
                <RatingStars rating={5} />
              </div>
              <p className="mb-4">
                "After struggling with my dissertation for months, I found a methodology expert on 
                TeacherOn who helped me restructure my research design. I successfully defended my 
                dissertation three months later."
              </p>
              <div className="font-semibold">
                Marcus J. - PhD Candidate
              </div>
            </div>
          </div>
        </section>
        
        <div className="bg-blue-50 rounded-lg p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h3>
          <p className="text-lg mb-6">
            Join thousands of students who have transformed their learning experience with TeacherOn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/tutors" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Find a Tutor
            </Link>
            <Link href="/post-job" className="inline-block bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              Post a Tutoring Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}