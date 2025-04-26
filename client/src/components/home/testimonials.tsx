import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "David Chen",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "I was struggling with calculus and worried about my upcoming AP exam. After just a month of sessions with my tutor from TeacherOn, I saw a huge improvement in my understanding and confidence. I ended up scoring a 5 on the exam!"
    },
    {
      id: 2,
      name: "Jennifer Torres",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "As a parent, finding the right tutor for my daughter's dyslexia was challenging. TeacherOn made it easy to connect with specialized educators. The difference in my daughter's reading confidence has been remarkable!"
    },
    {
      id: 3,
      name: "Marcus Johnson",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "As a retired professor, I wanted to continue teaching on a flexible schedule. TeacherOn has been the perfect platform to connect with motivated students. The booking and payment system is seamless, letting me focus on what I love: teaching."
    }
  ];

  return (
    <div className="py-12 bg-gray-50" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Success stories
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Hear from students and tutors who have transformed their educational journey with TeacherOn.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={testimonial.image} 
                      alt={`${testimonial.name} testimonial`} 
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
