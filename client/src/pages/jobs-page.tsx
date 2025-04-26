import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import JobCard from "@/components/jobs/job-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Loader2, Search, Filter, PlusCircle } from "lucide-react";

export default function JobsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    status: "open",
    sort: "newest",
    subject: "",
  });

  // Fetch all jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs", { status: filter.status !== "all" ? filter.status : undefined }],
  });

  // Fetch user's jobs if logged in as a student
  const { data: userJobs } = useQuery({
    queryKey: ["/api/jobs", { studentId: user?.id }],
    enabled: !!(user && user.role === UserRole.STUDENT),
  });

  // Apply filters and search to jobs
  const filteredJobs = jobs?.filter((job: any) => {
    // Search in title and description
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      if (
        !job.title.toLowerCase().includes(lowercaseQuery) &&
        !job.description.toLowerCase().includes(lowercaseQuery) &&
        !job.subjects.toLowerCase().includes(lowercaseQuery)
      ) {
        return false;
      }
    }

    // Subject filter
    if (filter.subject && filter.subject !== "all-subjects" && !job.subjects.toLowerCase().includes(filter.subject.toLowerCase())) {
      return false;
    }

    return true;
  }) || [];

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (filter.sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (filter.sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (filter.sort === "budget-high") {
      // Extract numeric value from budget string like "$30-40/hour"
      const getBudgetHigh = (budget: string) => {
        const match = budget.match(/\$(\d+)-(\d+)/);
        return match ? parseInt(match[2]) : 0;
      };
      return getBudgetHigh(b.budget) - getBudgetHigh(a.budget);
    } else if (filter.sort === "budget-low") {
      const getBudgetLow = (budget: string) => {
        const match = budget.match(/\$(\d+)-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      return getBudgetLow(a.budget) - getBudgetLow(b.budget);
    }
    return 0;
  });

  // Unique subject list for filter dropdown
  const allSubjects = new Set<string>();
  jobs?.forEach((job: any) => {
    if (job.subjects) {
      job.subjects.split(',').forEach((s: string) => allSubjects.add(s.trim()));
    }
  });
  const subjectList = Array.from(allSubjects);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Teaching Jobs</h1>
              <p className="mt-2 text-lg text-gray-600">
                Find tutoring opportunities that match your expertise and schedule
              </p>
            </div>
            {user && user.role === UserRole.STUDENT && (
              <Link href="/post-job">
                <Button className="mt-4 md:mt-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </Link>
            )}
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList>
              <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
              {user && user.role === UserRole.STUDENT && (
                <TabsTrigger value="myjobs">My Job Postings</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="browse">
              <Card>
                <CardHeader>
                  <CardTitle>Available Teaching Jobs</CardTitle>
                  <CardDescription>
                    Browse through tutoring requests from students and apply to those that match your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search by title, subject or description"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Select
                        value={filter.status}
                        onValueChange={(value) => setFilter({ ...filter, status: value })}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open Jobs</SelectItem>
                          <SelectItem value="assigned">Assigned Jobs</SelectItem>
                          <SelectItem value="completed">Completed Jobs</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={filter.sort}
                        onValueChange={(value) => setFilter({ ...filter, sort: value })}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                          <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={filter.subject}
                        onValueChange={(value) => setFilter({ ...filter, subject: value })}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-subjects">All Subjects</SelectItem>
                          {subjectList.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : sortedJobs.length === 0 ? (
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-500">
                          {searchQuery
                            ? "No jobs match your search criteria. Try a different search term."
                            : "No jobs are currently available. Check back later or try a different filter."}
                        </p>
                      </div>
                    ) : (
                      sortedJobs.map((job: any) => <JobCard key={job.id} job={job} />)
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {user && user.role === UserRole.STUDENT && (
              <TabsContent value="myjobs">
                <Card>
                  <CardHeader>
                    <CardTitle>My Job Postings</CardTitle>
                    <CardDescription>
                      View and manage all your job postings and applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {!userJobs ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : userJobs.length === 0 ? (
                        <div className="text-center py-8">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                          <p className="text-gray-500 mb-4">
                            You haven't posted any tutoring jobs yet. Create your first job posting to find the perfect tutor.
                          </p>
                          <Link href="/post-job">
                            <Button>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Post a Job
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        userJobs.map((job: any) => (
                          <div key={job.id} className="relative">
                            <JobCard job={job} />
                            <div className="absolute top-4 right-4">
                              <Badge
                                variant={
                                  job.status === "open"
                                    ? "success"
                                    : job.status === "assigned"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {job.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
