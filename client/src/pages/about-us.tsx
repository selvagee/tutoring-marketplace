import { Link } from "wouter";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About TeacherOn</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8">
            <p className="text-xl italic text-center">
              "To connect passionate educators with eager learners worldwide, making quality education accessible to all."
            </p>
          </div>
          
          <p className="mb-4">
            At TeacherOn, we believe that personalized education has the power to transform lives. Our platform serves as a bridge between knowledgeable tutors and students seeking to enhance their learning experience. Whether you're a student looking for academic support or a tutor wanting to share your expertise, TeacherOn provides the tools and community to make meaningful educational connections.
          </p>
          
          <p>
            Founded in 2023, TeacherOn has grown from a simple tutoring matching service to a comprehensive educational marketplace that facilitates not just connections, but complete educational journeys from initial contact to successful learning outcomes.
          </p>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What Makes Us Different</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Transparent Bidding System</h3>
              <p>
                Our job posting and bidding system allows students to receive customized proposals from tutors specifically tailored to their needs, while tutors can showcase their unique approach to teaching the requested subject.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Verified Tutors</h3>
              <p>
                All tutors on TeacherOn go through a verification process to ensure they have the qualifications and expertise they claim. Students can browse tutor profiles with confidence.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Integrated Learning Tools</h3>
              <p>
                Our platform includes built-in messaging, scheduling, and resource sharing tools to make the tutoring experience seamless and effective for both students and tutors.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                <p className="text-gray-600 mb-4">Co-Founder & CEO</p>
                <p>
                  Former education consultant with 15 years of experience in EdTech. Sarah is passionate about making quality education accessible to everyone regardless of location or background.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-indigo-400 to-indigo-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
                <p className="text-gray-600 mb-4">Co-Founder & CTO</p>
                <p>
                  Software engineer with a background in educational applications. Michael leads our technology team in building intuitive and powerful tools for the TeacherOn community.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-purple-400 to-purple-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Olivia Rodriguez</h3>
                <p className="text-gray-600 mb-4">Head of Tutor Success</p>
                <p>
                  Former university professor with a passion for pedagogy. Olivia works with our tutors to implement best practices and enhance the teaching experience on our platform.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-600">
            Our team also includes dedicated professionals in customer support, marketing, and product development, all working together to create the best possible experience for our users.
          </p>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p>
                We believe quality education should be accessible to everyone. We strive to create a platform that connects students with the right tutors regardless of geographic location.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p>
                We maintain high standards for our tutors and continuously work to improve the tools and resources available on our platform to ensure effective learning experiences.
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p>
                We foster a supportive community of students and educators who share knowledge, resources, and best practices to enhance the learning experience for everyone.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p>
                We continuously explore new technologies and approaches to make tutoring more effective, engaging, and convenient for both students and tutors.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-xl mb-8">
              Whether you're looking to learn or to teach, we invite you to join the TeacherOn community and be part of our educational journey.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/tutors" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Find a Tutor
              </Link>
              <Link href="/auth" className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Become a Tutor
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}