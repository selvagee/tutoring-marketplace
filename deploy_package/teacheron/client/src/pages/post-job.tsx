import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";

// Job posting form schema
const jobPostSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  subjects: z.string().min(1, "At least one subject is required"),
  location: z.string().min(1, "Location is required"),
  hoursPerWeek: z.coerce.number().min(1, "Hours per week is required"),
  budget: z.string().min(1, "Budget is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type JobPostFormValues = z.infer<typeof jobPostSchema>;

export default function PostJob() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Check if user is logged in and is a student
  const isStudent = user && user.role === UserRole.STUDENT;

  // Form setup
  const form = useForm<JobPostFormValues>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: "",
      description: "",
      subjects: "",
      location: "",
      hoursPerWeek: 1,
      budget: "$30-40/hour",
      termsAccepted: false,
    },
  });

  // Mutation to submit job
  const mutation = useMutation({
    mutationFn: async (data: JobPostFormValues) => {
      const { termsAccepted, ...jobData } = data;
      const res = await apiRequest("POST", "/api/jobs", jobData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Job posted successfully",
        description: "Your tutoring job has been posted and is now visible to tutors.",
      });
      setIsSubmitSuccess(true);
      // Reset form after success
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post job",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobPostFormValues) => {
    mutation.mutate(data);
  };

  // Budget options
  const budgetOptions = [
    { value: "$20-30/hour", label: "$20-30 per hour" },
    { value: "$30-40/hour", label: "$30-40 per hour" },
    { value: "$40-50/hour", label: "$40-50 per hour" },
    { value: "$50-75/hour", label: "$50-75 per hour" },
    { value: "$75-100/hour", label: "$75-100 per hour" },
    { value: "$100+/hour", label: "More than $100 per hour" },
  ];

  // Location options
  const locationOptions = [
    { value: "Online (Zoom)", label: "Online (Zoom)" },
    { value: "Online (Google Meet)", label: "Online (Google Meet)" },
    { value: "Local (Student's home)", label: "Local (Student's home)" },
    { value: "Local (Tutor's location)", label: "Local (Tutor's location)" },
    { value: "Local (Public place)", label: "Local (Public place)" },
  ];

  // Subject options
  const subjectOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Literature",
    "History",
    "Geography",
    "Computer Science",
    "Programming",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Music",
    "Art",
    "SAT Prep",
    "ACT Prep",
    "GRE Prep",
    "GMAT Prep",
  ];

  // Redirect if user is not a student
  if (user && user.role !== UserRole.STUDENT) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Only students can post tutoring jobs.</p>
                <Button onClick={() => navigate("/jobs")} variant="outline">
                  Browse available jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show success message if form was submitted successfully
  if (isSubmitSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle>Your job has been posted!</CardTitle>
                <CardDescription>
                  Tutors will now be able to see your job and submit applications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  You'll receive notifications when tutors apply for your job. You can also check your dashboard to see all applications.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button onClick={() => navigate("/jobs")} variant="default">
                    Browse more jobs
                  </Button>
                  <Button onClick={() => navigate("/dashboard")} variant="outline">
                    Go to Dashboard
                  </Button>
                  <Button onClick={() => setIsSubmitSuccess(false)} variant="secondary">
                    Post another job
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Post a Tutoring Job</h1>
            <p className="mt-2 text-lg text-gray-600">
              Describe what you need help with and find the perfect tutor
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide details about the tutoring help you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Math Tutor Needed for High School Algebra"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about the subject and level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you need help with, your goals, current level, and any specific requirements..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more details you provide, the better matches you'll get
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="subjects"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjects</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Mathematics, Algebra"
                              list="subject-options"
                              {...field}
                            />
                          </FormControl>
                          <datalist id="subject-options">
                            {subjectOptions.map((subject) => (
                              <option key={subject} value={subject} />
                            ))}
                          </datalist>
                          <FormDescription>
                            Separate multiple subjects with commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Where you'd like the tutoring to take place
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hoursPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours per Week</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="40"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Estimated hours of tutoring needed weekly
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {budgetOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Your budget range per hour of tutoring
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the terms and conditions
                          </FormLabel>
                          <FormDescription>
                            By posting this job, you agree to our terms of service and privacy policy.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Tips for a Great Job Posting</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary mr-2">1</span>
                    <span>Be specific about the subject, topics, and goals you want to achieve</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary mr-2">2</span>
                    <span>Mention your current level and any specific challenges you're facing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary mr-2">3</span>
                    <span>Include your availability (days/times) for tutoring sessions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary mr-2">4</span>
                    <span>Describe any specific teaching style or approach you prefer</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
