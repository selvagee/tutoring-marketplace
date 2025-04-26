import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <div className="py-12 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple. Effective. Personalized.
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Finding the right tutor or teaching opportunity has never been easier.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <span className="text-lg font-bold">1</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">For Students</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">Search for tutors by subject, location, availability, or price</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">View detailed profiles, credentials, and student reviews</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">Contact tutors directly or post a job listing</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">Schedule lessons and start learning</p>
                  </div>
                </div>
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <span className="text-lg font-bold">2</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">For Tutors</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">Create a detailed profile showcasing your expertise and experience</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">Browse job listings or wait for students to contact you</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">Set your own rates and schedule</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="ml-3 text-sm">Collect reviews to build your reputation</p>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <Button asChild>
              <Link href="/tutors">Find a Tutor</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth">Become a Tutor</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
