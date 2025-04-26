import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturedTutors from "@/components/home/featured-tutors";
import JobsSection from "@/components/home/jobs-section";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import CallToAction from "@/components/home/call-to-action";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  // Fetch featured tutors
  const { data: tutors, isLoading: isTutorsLoading } = useQuery<any[]>({
    queryKey: ["/api/tutors"],
    staleTime: 60000, // 1 minute
  });

  // Fetch featured jobs
  const { data: jobs, isLoading: isJobsLoading } = useQuery<any[]>({
    queryKey: ["/api/jobs", { status: "open" }],
    staleTime: 60000, // 1 minute
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedTutors tutors={tutors?.slice(0, 3) || []} isLoading={isTutorsLoading} />
        <JobsSection jobs={jobs?.slice(0, 2) || []} isLoading={isJobsLoading} />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
