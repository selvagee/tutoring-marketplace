import { Link } from "wouter";

export default function TeacherResources() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Teacher Resources</h1>
      
      <p className="text-xl mb-12">
        Enhance your tutoring practice with these valuable resources, tools, and materials.
      </p>
      
      <div className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-bold mb-6">Lesson Planning Resources</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Lesson Plan Templates</h3>
            <p className="mb-4">
              Well-structured lesson plans are essential for effective tutoring sessions. 
              Use these templates to organize your teaching materials and session flow.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  General Tutoring Session Template
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Math Lesson Template
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Language Learning Template
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Test Preparation Template
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Assessment Tools</h3>
            <p className="mb-4">
              Track student progress effectively with these assessment resources.
              Regular assessment helps identify strengths and areas for improvement.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Progress Tracking Spreadsheet
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Subject-Specific Assessment Rubrics
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Self-Assessment Questionnaires for Students
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Goal Setting Framework
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Subject-Specific Resources</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Mathematics</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://www.khanacademy.org/math" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Khan Academy Math
                </a>
              </li>
              <li>
                <a href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Desmos Graphing Calculator
                </a>
              </li>
              <li>
                <a href="https://www.wolframalpha.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Wolfram Alpha
                </a>
              </li>
              <li>
                <a href="https://www.geogebra.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GeoGebra
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Languages</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://www.duolingo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Duolingo
                </a>
              </li>
              <li>
                <a href="https://www.memrise.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Memrise
                </a>
              </li>
              <li>
                <a href="https://www.bbc.co.uk/languages/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  BBC Languages
                </a>
              </li>
              <li>
                <a href="https://www.vocabulary.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Vocabulary.com
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Science</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://phet.colorado.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  PhET Interactive Simulations
                </a>
              </li>
              <li>
                <a href="https://www.khanacademy.org/science" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Khan Academy Science
                </a>
              </li>
              <li>
                <a href="https://www.biointeractive.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  BioInteractive
                </a>
              </li>
              <li>
                <a href="https://www.chemcollective.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ChemCollective
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Online Teaching Tools</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Digital Whiteboards</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <a href="https://www.bitpaper.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    BitPaper
                  </a>
                  <p className="text-sm text-gray-600">Interactive whiteboard designed specifically for online tutoring</p>
                </li>
                <li>
                  <a href="https://miro.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Miro
                  </a>
                  <p className="text-sm text-gray-600">Collaborative whiteboard platform with many features</p>
                </li>
                <li>
                  <a href="https://jamboard.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Google Jamboard
                  </a>
                  <p className="text-sm text-gray-600">Simple digital whiteboard that integrates with Google Workspace</p>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">Interactive Learning</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <a href="https://kahoot.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Kahoot!
                  </a>
                  <p className="text-sm text-gray-600">Game-based learning platform</p>
                </li>
                <li>
                  <a href="https://quizlet.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Quizlet
                  </a>
                  <p className="text-sm text-gray-600">Flashcards and study tools</p>
                </li>
                <li>
                  <a href="https://www.mentimeter.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Mentimeter
                  </a>
                  <p className="text-sm text-gray-600">Interactive presentations and polls</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Professional Development</h2>
        
        <div className="mb-12">
          <p className="mb-6">
            Continually improving your teaching skills is essential for providing the best learning experience for your students. 
            Here are some resources to help you grow as an educator:
          </p>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <span className="font-semibold">Courses for Tutors:</span>
              <ul className="list-circle pl-6 mt-2">
                <li>
                  <a href="https://www.coursera.org/specializations/teaching" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Coursera: Foundations of Teaching for Learning
                  </a>
                </li>
                <li>
                  <a href="https://www.edx.org/learn/teaching" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    edX: Teaching Courses
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Books on Effective Teaching:</span>
              <ul className="list-circle pl-6 mt-2">
                <li>"Make It Stick: The Science of Successful Learning" by Peter C. Brown</li>
                <li>"Teaching What You Don't Know" by Therese Huston</li>
                <li>"Small Teaching" by James M. Lang</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Tutoring Certifications:</span>
              <ul className="list-circle pl-6 mt-2">
                <li>
                  <a href="https://www.crla.net/index.php/certifications/ittpc-international-tutor-training-program" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    College Reading & Learning Association (CRLA) Certification
                  </a>
                </li>
                <li>
                  <a href="https://www.ntatutor.com/certification.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    National Tutoring Association Certification
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Apply These Resources?</h3>
          <p className="text-lg mb-6">
            Find students looking for your expertise on TeacherOn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/jobs" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Browse Available Jobs
            </Link>
            <Link href="/teaching-tips" className="inline-block bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              View Teaching Tips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}