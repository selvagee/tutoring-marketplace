import { Link } from "wouter";
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Code, 
  Music, 
  Lightbulb, 
  Brain,
  FileText
} from "lucide-react";

export default function StudentResources() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Student Resources</h1>
      
      <p className="text-xl mb-12">
        A collection of useful resources, tools, and guides to help you succeed in your studies.
      </p>
      
      <div className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-bold mb-6">Study Skills & Learning Strategies</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-semibold">Effective Study Techniques</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <a href="https://www.learningscientists.org/downloadable-materials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Spaced Practice & Retrieval Practice Resources
                </a>
              </li>
              <li>
                <a href="https://pomofocus.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Pomodoro Timer for Focused Study Sessions
                </a>
              </li>
              <li>
                <a href="https://www.mindmeister.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Mind Mapping Tools
                </a>
              </li>
              <li>
                <a href="https://www.notion.so/templates/categories/students" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Study Organization Templates
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-semibold">Learning Style Resources</h3>
            </div>
            <p className="mb-4">
              Understanding your learning style can help you choose the most effective study methods:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <a href="https://vark-learn.com/the-vark-questionnaire/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  VARK Learning Style Assessment
                </a>
              </li>
              <li>
                <a href="https://www.educationplanner.org/students/self-assessments/learning-styles-quiz.shtml" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Learning Style Quiz
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/playlist?list=PL12qpKVMCvKoVaQ0CtbV9RNPipXs6FCkd" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Video Guides for Different Learning Styles
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Subject-Specific Resources</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calculator className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold">Mathematics</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://www.khanacademy.org/math" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Khan Academy Math Courses
                </a>
              </li>
              <li>
                <a href="https://www.wolframalpha.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Wolfram Alpha Problem Solver
                </a>
              </li>
              <li>
                <a href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Desmos Graphing Calculator
                </a>
              </li>
              <li>
                <a href="https://www.mathway.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Mathway Step-by-Step Solutions
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">Languages</h3>
            </div>
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
                <a href="https://www.tandem.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Tandem Language Exchange
                </a>
              </li>
              <li>
                <a href="https://forvo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Forvo Pronunciation Guide
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-xl font-semibold">Literature & Writing</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://www.grammarly.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Grammarly Writing Assistant
                </a>
              </li>
              <li>
                <a href="https://owl.purdue.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Purdue Online Writing Lab
                </a>
              </li>
              <li>
                <a href="https://www.sparknotes.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  SparkNotes Literature Guides
                </a>
              </li>
              <li>
                <a href="https://www.litcharts.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LitCharts Analysis Tools
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold">Computer Science</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://www.codecademy.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Codecademy Interactive Lessons
                </a>
              </li>
              <li>
                <a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  freeCodeCamp
                </a>
              </li>
              <li>
                <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LeetCode Practice Problems
                </a>
              </li>
              <li>
                <a href="https://replit.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Replit Online IDE
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-xl font-semibold">Research & Citation</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://scholar.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Scholar
                </a>
              </li>
              <li>
                <a href="https://www.zotero.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Zotero Citation Manager
                </a>
              </li>
              <li>
                <a href="https://www.citationmachine.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Citation Machine
                </a>
              </li>
              <li>
                <a href="https://www.sciencedirect.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ScienceDirect Research Database
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Music className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">Music & Arts</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a href="https://www.musictheory.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Music Theory Lessons
                </a>
              </li>
              <li>
                <a href="https://www.artyfactory.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Art Techniques & Tutorials
                </a>
              </li>
              <li>
                <a href="https://www.teoria.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Teoria Music Theory Exercises
                </a>
              </li>
              <li>
                <a href="https://www.ultimate-guitar.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Ultimate Guitar Tabs
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Test Preparation Resources</h2>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <p className="mb-6">
            Preparing for standardized tests requires specific strategies and resources. 
            Here are some helpful tools for common exams:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">SAT/ACT</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>
                  <a href="https://www.khanacademy.org/test-prep/sat" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Khan Academy SAT Prep
                  </a>
                </li>
                <li>
                  <a href="https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/free-act-test-prep.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Official ACT Practice Tests
                  </a>
                </li>
                <li>
                  <a href="https://www.princetonreview.com/college/free-sat-practice-test" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Princeton Review Free Practice Tests
                  </a>
                </li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">AP Exams</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <a href="https://apstudents.collegeboard.org/ap-exams-preparation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    College Board AP Resources
                  </a>
                </li>
                <li>
                  <a href="https://www.albert.io/ap" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Albert.io AP Practice
                  </a>
                </li>
                <li>
                  <a href="https://www.edx.org/learn/ap" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    edX AP Courses
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">GRE/GMAT</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>
                  <a href="https://www.ets.org/gre/test-takers/general-test/prepare.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Official GRE Prep Materials
                  </a>
                </li>
                <li>
                  <a href="https://www.mba.com/exams/gmat-exam/prepare-for-the-gmat-exam" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    GMAT Official Starter Kit
                  </a>
                </li>
                <li>
                  <a href="https://www.magoosh.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Magoosh Test Prep
                  </a>
                </li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Language Proficiency Tests</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <a href="https://www.ets.org/toefl/test-takers/ibt/prepare.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    TOEFL Preparation Materials
                  </a>
                </li>
                <li>
                  <a href="https://www.britishcouncil.org/exam/ielts/prepare" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    IELTS Practice Resources
                  </a>
                </li>
                <li>
                  <a href="https://www.duolingo.com/course/en/es/Learn-English" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Duolingo English Test Prep
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Need Personalized Help?</h3>
          <p className="text-lg mb-6">
            While these resources are valuable, sometimes you need personalized guidance. 
            Our tutors can provide customized support for your specific learning needs.
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