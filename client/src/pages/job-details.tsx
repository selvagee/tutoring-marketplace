import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole, BidStatus, JobStatus } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ReviewForm from "@/components/reviews/review-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Book,
  Send,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "wouter";

// Bid form schema
const bidSchema = z.object({
  proposal: z.string().min(20, "Proposal must be at least 20 characters long"),
  bidAmount: z.coerce.number().min(1, "Bid amount is required"),
});

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);

  // Fetch job details with bids
  const {
    data: jobData,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: [`/api/jobs/${jobId}`],
    enabled: !!jobId,
  });

  // Form for submitting bids
  const form = useForm<z.infer<typeof bidSchema>>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      proposal: "",
      bidAmount: 0,
    },
  });

  // Mutation to submit a bid
  const bidMutation = useMutation({
    mutationFn: async (data: z.infer<typeof bidSchema>) => {
      const res = await apiRequest("POST", `/api/jobs/${jobId}/bids`, data);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch job data to show the new bid
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      
      toast({
        title: "Bid submitted successfully",
        description: "Your bid has been sent to the student.",
      });
      
      setIsBidDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit bid",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to accept a bid
  const acceptBidMutation = useMutation({
    mutationFn: async (bidId: number) => {
      const res = await apiRequest("PATCH", `/api/bids/${bidId}/accept`, {});
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch job data to show the updated status
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      
      toast({
        title: "Bid accepted",
        description: "You've accepted a tutor for this job. You can now contact them directly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to accept bid",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to mark job as completed
  const completeJobMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/jobs/${jobId}/status`, { status: "completed" });
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch job data to show the updated status
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      
      toast({
        title: "Job marked as completed",
        description: "You can now leave a review for your tutor.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to mark job as completed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitBid = (data: z.infer<typeof bidSchema>) => {
    bidMutation.mutate(data);
  };
  
  // Helper function to check if user has already bid on this job
  const hasUserBid = () => {
    if (!user || !jobData?.bids) return false;
    
    // Debug
    console.log("Current user ID:", user.id);
    console.log("Checking bids:", jobData.bids);
    
    return Array.isArray(jobData.bids) && 
           jobData.bids.some((bid: any) => bid.tutorId === user.id);
  };

  // Helper function to format job creation date
  const formatCreationDate = (createdAt: string) => {
    const date = new Date(createdAt);
    return format(date, "MMMM d, yyyy");
  };

  // Helper function to format relative time
  const formatRelativeTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center p-6">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</CardTitle>
              <CardDescription className="mb-4">
                The job posting you're looking for could not be found or has been removed.
              </CardDescription>
              <Button asChild>
                <Link href="/jobs">Browse All Jobs</Link>
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { 
    title, 
    description, 
    location, 
    hoursPerWeek, 
    budget, 
    status, 
    createdAt, 
    subjects,
    studentId,
    student, 
    bids = [] 
  } = jobData;
  
  // Debug student information
  console.log("Student data:", student);
  console.log("Student ID from job:", studentId);

  // Split subjects into array if it's a string
  const subjectsList = typeof subjects === 'string' ? subjects.split(',').map(s => s.trim()) : [];

  // Check if the current user is the student who posted this job
  const isJobOwner = user && student && user.id === student.id;

  // Check if the job is already assigned
  const isJobAssigned = status === "assigned" || status === "completed";

  // Get the accepted bid if there is one
  const acceptedBid = bids.find((bid: any) => bid.status === BidStatus.ACCEPTED);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Job Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <Badge variant={status === "open" ? "success" : "secondary"} className="text-sm">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                {location}
              </div>
              {hoursPerWeek && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-400" />
                  {hoursPerWeek} hours/week
                </div>
              )}
              <div className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
                {budget}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                Posted on {formatCreationDate(createdAt)} ({formatRelativeTime(createdAt)})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">{description}</p>
                  
                  {subjectsList.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Skills Required:</h3>
                      <div className="flex flex-wrap gap-2">
                        {subjectsList.map((subject, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bids */}
              {isJobOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tutor Applications ({bids.length})</CardTitle>
                    <CardDescription>
                      Review tutors who have applied to your job
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bids.length === 0 ? (
                      <div className="text-center py-6">
                        <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No applications yet</h3>
                        <p className="text-gray-500">
                          Tutors will apply to your job soon. Check back later.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {bids.map((bid: any) => (
                          <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${bid.tutor?.fullName}`} />
                                  <AvatarFallback>{bid.tutor?.fullName?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                  <Link href={`/tutors/${bid.tutorId}`}>
                                    <h3 className="text-sm font-medium text-gray-900 hover:text-primary cursor-pointer">
                                      {bid.tutor?.fullName}
                                    </h3>
                                  </Link>
                                  <div className="flex items-center mt-1">
                                    <Star className="h-3 w-3 text-amber-500" />
                                    <span className="ml-1 text-xs text-gray-500">
                                      {bid.tutor?.averageRating?.toFixed(1) || "New"} ({bid.tutor?.totalReviews || 0} reviews)
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-medium text-gray-900">${bid.bidAmount}/hr</span>
                                <div className="mt-1 text-xs text-gray-500">
                                  {formatRelativeTime(bid.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Proposal:</h4>
                              <p className="text-sm text-gray-600">{bid.proposal}</p>
                            </div>
                            {bid.status === BidStatus.PENDING && status === "open" && (
                              <div className="mt-4 flex justify-end space-x-2">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => acceptBidMutation.mutate(bid.id)}
                                  disabled={acceptBidMutation.isPending}
                                >
                                  {acceptBidMutation.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      Accept Bid
                                    </>
                                  )}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <X className="mr-2 h-4 w-4" />
                                  Decline
                                </Button>
                              </div>
                            )}
                            {bid.status === BidStatus.ACCEPTED && (
                              <div className="mt-4 flex justify-end">
                                <Badge variant="success" className="text-xs">
                                  <Check className="mr-1 h-3 w-3" />
                                  Accepted
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {/* Completion Button - only show for assigned jobs with accepted bids */}
                  {isJobOwner && status === "assigned" && acceptedBid && (
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => completeJobMutation.mutate()}
                        disabled={completeJobMutation.isPending}
                      >
                        {completeJobMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Mark Job as Completed
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )}

              {/* Accepted Tutor Info (for non-owners when assigned) */}
              {!isJobOwner && isJobAssigned && acceptedBid && (
                <Card>
                  <CardHeader>
                    <CardTitle>Job Assigned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Check className="h-8 w-8 text-green-500 mr-4" />
                      <div>
                        <p className="text-gray-700">
                          This job has been assigned to {' '}
                          <span className="font-semibold">{acceptedBid.tutor?.fullName}</span>.
                        </p>
                        {acceptedBid.tutorId === user?.id && (
                          <p className="mt-2 text-gray-600">
                            Congratulations! You can now coordinate with the student to begin tutoring.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Review Form for Students (only visible on completed jobs) */}
              {isJobOwner && status === "completed" && acceptedBid && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review your Tutor</CardTitle>
                    <CardDescription>
                      Share your experience with {acceptedBid.tutor?.fullName} to help other students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewForm 
                      tutorId={acceptedBid.tutorId} 
                      jobId={jobId} 
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Student</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student?.fullName}`} />
                      <AvatarFallback>{student?.fullName?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{student?.fullName}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="ml-1 text-sm text-gray-500">
                          {student?.averageRating?.toFixed(1) || "New"} ({student?.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Member since</span>
                      <span className="text-sm text-gray-700">January 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Jobs posted</span>
                      <span className="text-sm text-gray-700">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Response rate</span>
                      <span className="text-sm text-gray-700">95%</span>
                    </div>
                  </div>

                  {!isJobOwner && user && (user.role === UserRole.TUTOR || user.role === "tutor") && (
                    <Button 
                      className="w-full mt-4"
                      onClick={() => {
                        console.log("Contact Student button clicked");
                        console.log("User:", user);
                        console.log("Student ID:", studentId);
                        
                        // Check if user is authenticated before redirecting
                        fetch("/api/user", {
                          method: "GET",
                          credentials: "include"
                        })
                          .then(response => {
                            if (response.ok) {
                              console.log("User authenticated, redirecting to messages");
                              window.location.href = `/messages/${studentId}`;
                            } else {
                              console.error("Authentication failed:", response.status);
                              toast({
                                title: "Authentication Error",
                                description: "You need to be logged in to contact students. Please log in and try again.",
                                variant: "destructive"
                              });
                            }
                          })
                          .catch(error => {
                            console.error("Error checking authentication:", error);
                            toast({
                              title: "Error",
                              description: "Failed to verify your login status. Please try again.",
                              variant: "destructive"
                            });
                          });
                      }}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Contact Student
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Apply Button (for tutors) */}
              {user && 
                (user.role === UserRole.TUTOR || user.role === "tutor") && 
                status === "open" && 
                !isJobOwner && 
                !hasUserBid() && (
                <Card>
                  <CardHeader>
                    <CardTitle>Apply for this Job</CardTitle>
                    <CardDescription>
                      Send your proposal and hourly rate to the student
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Send className="mr-2 h-4 w-4" />
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Submit a Proposal</DialogTitle>
                          <DialogDescription>
                            Tell the student why you're a good fit for this tutoring job.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmitBid)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="proposal"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Proposal</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Explain why you're a good fit for this job, your relevant experience, and approach to teaching this subject..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Be specific about your experience with this subject and how you can help.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="bidAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Hourly Rate ($)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="40"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    The student's budget is {budget}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button 
                                type="submit" 
                                disabled={bidMutation.isPending}
                              >
                                {bidMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : "Submit Proposal"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )}

              {/* Already Applied Note */}
              {user && 
                (user.role === UserRole.TUTOR || user.role === "tutor") && 
                status === "open" && 
                !isJobOwner && 
                hasUserBid() && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <Check className="h-6 w-6 text-green-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Proposal Submitted</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          You've already applied to this job. The student will review your application.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h3 className="text-sm font-medium text-gray-900 hover:text-primary cursor-pointer">
                        Math Tutor for AP Calculus
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>Online • </span>
                        <DollarSign className="h-3 w-3 mx-1" />
                        <span>$35-45/hr</span>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h3 className="text-sm font-medium text-gray-900 hover:text-primary cursor-pointer">
                        Physics Tutor Needed for College Student
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>New York, NY • </span>
                        <DollarSign className="h-3 w-3 mx-1" />
                        <span>$40-50/hr</span>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h3 className="text-sm font-medium text-gray-900 hover:text-primary cursor-pointer">
                        Chemistry Tutor for High School Student
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>Online • </span>
                        <DollarSign className="h-3 w-3 mx-1" />
                        <span>$30-40/hr</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="link" asChild className="w-full mt-2 px-0">
                    <Link href="/jobs">View All Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
