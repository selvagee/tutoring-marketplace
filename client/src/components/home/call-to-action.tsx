import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CallToAction() {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to transform your learning?</span>
          <span className="block text-primary-300">Get started with TeacherOn today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/auth">
              <Button variant="secondary" size="lg" className="text-primary">
                Sign up as a student
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link href="/auth">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-primary-800">
                Register as a tutor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
