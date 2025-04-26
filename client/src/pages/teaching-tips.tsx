export default function TeachingTips() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Teaching Tips</h1>
      
      <p className="text-xl mb-12">
        Enhance your tutoring skills with these proven teaching strategies and best practices.
      </p>
      
      <div className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-bold mb-6">Understanding Different Learning Styles</h2>
        
        <p className="mb-6">
          Students learn in different ways. By identifying and adapting to your student's learning style, 
          you can significantly improve their understanding and retention of material.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Visual Learners</h3>
            <p className="mb-3">Learn best through images, diagrams, and spatial understanding.</p>
            <p className="font-medium">Tips:</p>
            <ul className="list-disc pl-5">
              <li>Use diagrams, charts, and mind maps</li>
              <li>Highlight important information with colors</li>
              <li>Demonstrate processes visually when possible</li>
              <li>Encourage note-taking with visual elements</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Auditory Learners</h3>
            <p className="mb-3">Prefer learning through listening and verbal explanations.</p>
            <p className="font-medium">Tips:</p>
            <ul className="list-disc pl-5">
              <li>Explain concepts verbally in detail</li>
              <li>Use discussion-based teaching</li>
              <li>Encourage the student to explain concepts back to you</li>
              <li>Consider using mnemonic devices</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Kinesthetic Learners</h3>
            <p className="mb-3">Learn best through hands-on activities and physical engagement.</p>
            <p className="font-medium">Tips:</p>
            <ul className="list-disc pl-5">
              <li>Incorporate physical activities or manipulatives</li>
              <li>Use role-playing or simulation exercises</li>
              <li>Take short breaks for movement</li>
              <li>Apply concepts to real-world situations</li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Effective Session Structure</h2>
        
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <ol className="space-y-6">
            <li>
              <h3 className="text-xl font-semibold">1. Begin with a Warm-Up (5-10 minutes)</h3>
              <p>Start with a brief review of previous material and check for retention. Ask about any challenges since the last session.</p>
            </li>
            
            <li>
              <h3 className="text-xl font-semibold">2. Set Clear Objectives (2-3 minutes)</h3>
              <p>Clearly communicate what you'll cover in the session and what the student should be able to do by the end.</p>
            </li>
            
            <li>
              <h3 className="text-xl font-semibold">3. Direct Instruction (15-20 minutes)</h3>
              <p>Present new material, demonstrating key concepts and skills. Be concise and focus on the most important aspects.</p>
            </li>
            
            <li>
              <h3 className="text-xl font-semibold">4. Guided Practice (15-20 minutes)</h3>
              <p>Work through examples together, gradually reducing your assistance as the student gains confidence.</p>
            </li>
            
            <li>
              <h3 className="text-xl font-semibold">5. Independent Practice (10-15 minutes)</h3>
              <p>Have the student work through problems independently while you observe and provide feedback.</p>
            </li>
            
            <li>
              <h3 className="text-xl font-semibold">6. Wrap-Up and Assignment (5-10 minutes)</h3>
              <p>Summarize key points, answer final questions, and assign practice work for between sessions.</p>
            </li>
          </ol>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Building a Positive Tutoring Relationship</h2>
        
        <ul className="list-disc pl-6 mb-12 space-y-4">
          <li>
            <span className="font-semibold">Create a safe learning environment</span> where students feel comfortable making mistakes and asking questions.
          </li>
          <li>
            <span className="font-semibold">Use positive reinforcement</span> to acknowledge progress and effort, not just correct answers.
          </li>
          <li>
            <span className="font-semibold">Be patient and adaptable</span>, recognizing that learning is not always linear and students may need concepts explained in different ways.
          </li>
          <li>
            <span className="font-semibold">Set realistic expectations</span> and celebrate small victories along the way to larger goals.
          </li>
          <li>
            <span className="font-semibold">Maintain professional boundaries</span> while still being approachable and supportive.
          </li>
        </ul>
        
        <h2 className="text-3xl font-bold mb-6">Online Tutoring Best Practices</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Technical Setup</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure good lighting and a neutral background</li>
              <li>Use a quality microphone for clear audio</li>
              <li>Have a stable internet connection</li>
              <li>Test your equipment before each session</li>
              <li>Have a backup plan for technical difficulties</li>
              <li>Use a digital whiteboard or document camera when needed</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Engagement Strategies</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use frequent check-ins to ensure understanding</li>
              <li>Incorporate interactive elements like shared documents</li>
              <li>Keep sessions visually engaging with varied materials</li>
              <li>Minimize lecture time and maximize interaction</li>
              <li>Use screen sharing to guide through problems</li>
              <li>Provide digital resources that can be accessed after the session</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Put These Tips into Practice?</h3>
          <p className="text-lg mb-6">
            Find students looking for your expertise on TeacherOn.
          </p>
          <a href="/jobs" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Available Jobs
          </a>
        </div>
      </div>
    </div>
  );
}