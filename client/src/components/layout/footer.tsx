import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="text-white text-2xl font-bold">TeacherOn</div>
            <p className="text-gray-300 text-base">
              Connecting passionate educators with eager learners worldwide. Our platform makes it easy to find the perfect tutor or teaching opportunity.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  For Students
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/tutors" className="text-base text-gray-300 hover:text-white">
                      Find a Tutor
                    </Link>
                  </li>
                  <li>
                    <Link href="/post-job" className="text-base text-gray-300 hover:text-white">
                      Post a Job
                    </Link>
                  </li>
                  <li>
                    <Link href="/student-resources" className="text-base text-gray-300 hover:text-white">
                      Student Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/success-stories" className="text-base text-gray-300 hover:text-white">
                      Success Stories
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  For Tutors
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/auth" className="text-base text-gray-300 hover:text-white">
                      Become a Tutor
                    </Link>
                  </li>
                  <li>
                    <Link href="/jobs" className="text-base text-gray-300 hover:text-white">
                      Find Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/teaching-tips" className="text-base text-gray-300 hover:text-white">
                      Teaching Tips
                    </Link>
                  </li>
                  <li>
                    <Link href="/teacher-resources" className="text-base text-gray-300 hover:text-white">
                      Teacher Resources
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  About
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/about-us" className="text-base text-gray-300 hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="text-base text-gray-300 hover:text-white">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/success-stories" className="text-base text-gray-300 hover:text-white">
                      Testimonials
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} TeacherOn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
