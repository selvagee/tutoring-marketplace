import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import TutorCard from "@/components/tutors/tutor-card";

interface FeaturedTutorsProps {
  tutors: any[];
  isLoading?: boolean;
}

export default function FeaturedTutors({ tutors, isLoading = false }: FeaturedTutorsProps) {
  // Show loading state or empty array if no tutors are available
  const displayTutors = tutors || [];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Tutors</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Learn from the best
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our verified tutors are experts in their fields with proven teaching experience.
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : displayTutors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No tutors available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link href="/tutors">
              <Button size="lg" className="inline-flex items-center">
                View all tutors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
