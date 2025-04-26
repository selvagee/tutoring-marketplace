import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import JobCard from "@/components/jobs/job-card";

interface JobsSectionProps {
  jobs: any[];
  isLoading?: boolean;
}

export default function JobsSection({ jobs, isLoading = false }: JobsSectionProps) {
  // Show loading state or empty array if no jobs are available
  const displayJobs = jobs || [];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">For Tutors</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find teaching opportunities
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Browse through tutoring requests from students and apply to those that match your expertise.
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : displayJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No job postings available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link href="/jobs">
              <Button size="lg" className="inline-flex items-center">
                View all job postings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
