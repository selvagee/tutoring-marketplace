import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole, insertTutorProfileSchema } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, BarChart3, Users, User, MessageSquare, Bookmark, FileText, PlusCircle, Star, Clock, Pencil, Upload, ImageIcon } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import JobCard from "@/components/jobs/job-card";
import TutorCard from "@/components/tutors/tutor-card";

interface DashboardPageProps {
  initialTab?: string;
}

export default function DashboardPage({ initialTab = "overview" }: DashboardPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile editing form validation schema
  const tutorProfileSchema = z.object({
    subjects: z.string().min(1, "Please specify at least one subject you teach"),
    education: z.string().optional(),
    experience: z.string().optional(),
    languages: z.string().optional(),
    hourly_rate: z.string().optional().transform(val => val ? parseInt(val) : null),
    bio: z.string().optional(),
    profile_image_url: z.string().optional(),
    location: z.string().optional(),
  });
  
  // Form setup
  const form = useForm<z.infer<typeof tutorProfileSchema>>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      subjects: "",
      education: "",
      experience: "",
      languages: "",
      hourly_rate: "", // Use snake_case to match schema
      bio: "",
      profile_image_url: "",
      location: "",
    },
  });

  // Fetch user's profile data
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: [user?.role === UserRole.TUTOR ? `/api/tutors/${user?.id}` : `/api/user`],
    enabled: !!user,
  });
  
  // Update form values when profile data is loaded
  React.useEffect(() => {
    if (profileData && user?.role === UserRole.TUTOR) {
      // Pre-fill form with existing data when profile is loaded
      form.reset({
        subjects: profileData.subjects || "",
        education: profileData.education || "",
        experience: profileData.experience || "",
        languages: profileData.languages || "",
        hourly_rate: profileData.hourly_rate ? profileData.hourly_rate.toString() : "",
        bio: profileData.bio || "",
        profile_image_url: profileData.profile_image_url || "",
        location: profileData.location || "",
      });
    }
  }, [profileData, user, form]);
  
  // Mutation to update tutor profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof tutorProfileSchema>) => {
      const res = await apiRequest("POST", "/api/tutors/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      // Refresh profile data
      queryClient.invalidateQueries({ queryKey: [`/api/tutors/${user?.id}`] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle profile form submission
  const onSubmitProfile = (data: z.infer<typeof tutorProfileSchema>) => {
    // No need for conversion, field names already match the schema
    updateProfileMutation.mutate(data);
  };

  // Fetch user's jobs or bids
  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: [!!user ? (user.role === UserRole.STUDENT ? "/api/jobs" : "/api/bids") : "/api/jobs"],
    enabled: !!user,
  });

  // Fetch user's conversations
  const { data: conversationsData } = useQuery({
    queryKey: ["/api/messages/conversations"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center p-8">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Please Login</CardTitle>
              <CardDescription className="mb-4">
                You need to be logged in to access your dashboard.
              </CardDescription>
              <Button asChild>
                <Link href="/auth">Login or Register</Link>
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Dashboard tabs based on user role
  const getDashboardTabs = () => {
    const commonTabs = [
      { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
      { id: "messages", label: "Messages", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
      { id: "profile", label: "Profile", icon: <User className="h-4 w-4 mr-2" /> },
    ];

    if (user?.role === UserRole.STUDENT) {
      return [
        ...commonTabs,
        { id: "my-jobs", label: "My Jobs", icon: <FileText className="h-4 w-4 mr-2" /> },
        { id: "favorite-tutors", label: "Favorite Tutors", icon: <Bookmark className="h-4 w-4 mr-2" /> },
      ];
    } else if (user?.role === UserRole.TUTOR) {
      return [
        ...commonTabs,
        { id: "job-applications", label: "My Applications", icon: <FileText className="h-4 w-4 mr-2" /> },
        { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4 mr-2" /> },
      ];
    }

    return commonTabs;
  };

  const dashboardTabs = getDashboardTabs();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-lg text-gray-500">
                Manage your {user?.role === UserRole.STUDENT ? "learning" : "teaching"} activities
              </p>
            </div>
            {user?.role === UserRole.STUDENT && (
              <Link href="/post-job">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 text-center border-b border-gray-200">
                  <Avatar className="h-20 w-20 mx-auto">
                    <AvatarImage 
                      src={profileData && profileData.profile_image_url ? profileData.profile_image_url : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name || user?.username || 'User'}`} 
                    />
                    <AvatarFallback>{user?.full_name ? user.full_name.substring(0, 2) : (user?.username ? user.username.substring(0, 2).toUpperCase() : 'U')}</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.full_name || user?.username || 'User'}</h2>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {user?.role || 'User'}
                  </Badge>
                </div>

                <div className="p-4">
                  <div className="space-y-1">
                    {dashboardTabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.icon}
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Your {user?.role === UserRole.STUDENT ? "learning" : "teaching"} activity summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary-100 text-primary mr-3">
                            {user?.role === UserRole.STUDENT ? (
                              <FileText className="h-6 w-6" />
                            ) : (
                              <Users className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {user?.role === UserRole.STUDENT ? "Active Jobs" : "Active Students"}
                            </p>
                            <p className="text-2xl font-semibold">{Array.isArray(jobsData) ? jobsData.length : 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary-100 text-primary mr-3">
                            <MessageSquare className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Unread Messages</p>
                            <p className="text-2xl font-semibold">
                              {Array.isArray(conversationsData) 
                                ? conversationsData.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0) 
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary-100 text-primary mr-3">
                            <Clock className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {user?.role === UserRole.STUDENT ? "Tutoring Hours" : "Teaching Hours"}
                            </p>
                            <p className="text-2xl font-semibold">24</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {user?.role === UserRole.STUDENT ? (
                      <>
                        <h3 className="text-lg font-medium mb-4">Recent Job Postings</h3>
                        {isLoadingJobs ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                            <p>Loading your jobs...</p>
                          </div>
                        ) : jobsData && jobsData.length > 0 ? (
                          <div className="space-y-4">
                            {jobsData.slice(0, 2).map((job) => (
                              <JobCard key={job.id} job={job} />
                            ))}
                            {jobsData.length > 2 && (
                              <div className="text-center mt-4">
                                <Button variant="link" onClick={() => setActiveTab("my-jobs")}>
                                  View all jobs
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <h4 className="text-lg font-medium text-gray-900 mb-1">No jobs posted yet</h4>
                            <p className="text-gray-500 mb-4">Post your first tutoring job to find the perfect tutor</p>
                            <Link href="/post-job">
                              <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Post a Job
                              </Button>
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium mb-4">Recent Job Applications</h3>
                        {isLoadingJobs ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                            <p>Loading your applications...</p>
                          </div>
                        ) : jobsData && jobsData.length > 0 ? (
                          <div className="space-y-4">
                            {jobsData.slice(0, 2).map((application) => (
                              <div key={application.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Link href={`/jobs/${application.jobId}`}>
                                      <h4 className="text-lg font-medium text-primary hover:underline cursor-pointer">
                                        {application.job?.title || "Untitled Job"}
                                      </h4>
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                      Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                  <Badge variant={application.status === "accepted" ? "success" : "secondary"}>
                                    {application.status}
                                  </Badge>
                                </div>
                                <p className="mt-2 text-gray-700 line-clamp-2">{application.proposal}</p>
                                <div className="mt-2 flex justify-between items-center">
                                  <p className="text-sm text-gray-500">Your bid: <span className="font-medium">${application.bidAmount}/hr</span></p>
                                  <Link href={`/jobs/${application.jobId}`}>
                                    <Button variant="outline" size="sm">View Details</Button>
                                  </Link>
                                </div>
                              </div>
                            ))}
                            {jobsData.length > 2 && (
                              <div className="text-center mt-4">
                                <Button variant="link" onClick={() => setActiveTab("job-applications")}>
                                  View all applications
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <h4 className="text-lg font-medium text-gray-900 mb-1">No applications yet</h4>
                            <p className="text-gray-500 mb-4">Browse jobs and submit proposals to find teaching opportunities</p>
                            <Link href="/jobs">
                              <Button>Browse Jobs</Button>
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Recent conversations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(conversationsData) && conversationsData.length > 0 ? (
                      <div className="space-y-4">
                        {conversationsData.map((conversation) => (
                          <Link key={conversation.userId} href={`/messages/${conversation.userId}`}>
                            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={conversation.user?.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${conversation.user?.full_name || conversation.user?.username || ''}`} />
                                <AvatarFallback>{conversation.user?.full_name ? conversation.user.full_name.substring(0, 2) : (conversation.user?.username ? conversation.user.username.substring(0, 2).toUpperCase() : 'U')}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900">{conversation.user?.full_name || conversation.user?.username || 'Unknown User'}</p>
                                  {conversation.unreadCount > 0 && (
                                    <Badge variant="default" className="rounded-full px-2 py-0.5 text-xs">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{conversation.user?.role}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h4>
                        <p className="text-gray-500 mb-4">
                          Connect with {user?.role === UserRole.STUDENT ? "tutors" : "students"} to start conversations
                        </p>
                        <Link href={user?.role === UserRole.STUDENT ? "/tutors" : "/jobs"}>
                          <Button>
                            Find {user?.role === UserRole.STUDENT ? "Tutors" : "Jobs"}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Manage your profile details</CardDescription>
                    </div>
                    {user?.role === UserRole.TUTOR && !isLoadingProfile && (
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <>
                            Cancel
                          </>
                        ) : (
                          <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isLoadingProfile ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                        <p>Loading your profile...</p>
                      </div>
                    ) : isEditing && user?.role === UserRole.TUTOR ? (
                      // Edit mode - show form
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="relative avatar-upload-container">
                              <Avatar className="h-24 w-24">
                                <AvatarImage 
                                  src={form.watch('profile_image_url') || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name || user?.username || 'User'}`} 
                                />
                                <AvatarFallback>{user?.full_name ? user.full_name.substring(0, 2) : (user?.username ? user.username.substring(0, 2).toUpperCase() : 'U')}</AvatarFallback>
                              </Avatar>
                              <FormField
                                control={form.control}
                                name="profile_image_url"
                                render={({ field }) => (
                                  <FormItem className="avatar-upload-overlay">
                                    <FormControl>
                                      <div className="avatar-upload-button">
                                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                                          <Upload className="h-6 w-6 mb-1" />
                                          <span className="text-xs">Upload</span>
                                        </label>
                                        <input
                                          id="image-upload"
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              const file = e.target.files[0];
                                              // Convert to base64 for simple storage
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const base64String = reader.result as string;
                                                field.onChange(base64String);
                                                console.log("Image uploaded: ", base64String.substring(0, 50) + "...");
                                                
                                                // Force image refresh in UI
                                                const previewImg = document.querySelector('.avatar-preview img') as HTMLImageElement;
                                                if (previewImg) {
                                                  previewImg.src = base64String;
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                    <div className="sr-only"><FormMessage /></div>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{user?.full_name || 'User'}</h3>
                              <p className="text-gray-500">{user?.email || ''}</p>
                              <div className="mt-4">
                                <div className="flex flex-col">
                                  <FormLabel className="mb-1">Profile Image</FormLabel>
                                  <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <div className="avatar-preview mt-1 w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                                      <img 
                                        src={form.watch('profile_image_url') || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name || user?.username || 'User'}`} 
                                        alt="Profile preview" 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    
                                    <div className="flex-1">
                                      <FormField
                                        control={form.control}
                                        name="profile_image_url"
                                        render={({ field }) => (
                                          <FormItem className="w-full">
                                            <FormControl>
                                              <div className="flex gap-2">
                                                <Input
                                                  type="text"
                                                  placeholder="Paste image URL here"
                                                  {...field}
                                                  className="flex-1"
                                                  onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    // Update preview image too
                                                    const previewImg = document.querySelector('.avatar-preview img') as HTMLImageElement;
                                                    if (previewImg && e.target.value) {
                                                      previewImg.src = e.target.value;
                                                    }
                                                  }}
                                                />
                                                <Button 
                                                  type="button" 
                                                  variant="outline"
                                                  onClick={() => {
                                                    const fileInput = document.getElementById('image-upload');
                                                    if (fileInput) {
                                                      fileInput.click();
                                                    }
                                                  }}
                                                >
                                                  <Upload className="h-4 w-4 mr-2" />
                                                  Browse
                                                </Button>
                                              </div>
                                            </FormControl>
                                            <FormDescription className="mt-1">
                                              Enter an image URL or click "Browse" to upload from your device
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="mt-2 capitalize">
                                {user?.role || "User"}
                              </Badge>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-4">Professional Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="education"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Education</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Your educational background" {...field} value={field.value || ''} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="experience"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Experience</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Your teaching experience" {...field} value={field.value || ''} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="languages"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Languages</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Languages you speak" {...field} value={field.value || ''} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="hourly_rate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Hourly Rate ($)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number"
                                          placeholder="Your hourly rate" 
                                          {...field} 
                                          value={field.value || ''} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <FormField
                                control={form.control}
                                name="subjects"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Subjects</FormLabel>
                                    <FormDescription>
                                      Enter subjects separated by commas (e.g., "Math, Science, English")
                                    </FormDescription>
                                    <FormControl>
                                      <Input placeholder="Subjects you teach" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div>
                              <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Tell students about yourself and your teaching approach"
                                        className="min-h-[150px]" 
                                        {...field} 
                                        value={field.value || ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditing(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit"
                                disabled={updateProfileMutation.isPending}
                              >
                                {updateProfileMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : "Save Changes"}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      // View mode - show profile
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage 
                              src={profileData && profileData.profile_image_url ? profileData.profile_image_url : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name || user?.username || 'User'}`} 
                            />
                            <AvatarFallback>{user?.full_name ? user.full_name.substring(0, 2) : (user?.username ? user.username.substring(0, 2).toUpperCase() : 'U')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{user?.full_name || user?.username || 'User'}</h3>
                            <p className="text-gray-500">{user?.email || ''}</p>
                            <Badge variant="outline" className="mt-2 capitalize">
                              {user?.role || ''}
                            </Badge>
                          </div>
                        </div>

                        <Separator />

                        {user?.role === UserRole.TUTOR && profileData && (
                          <>
                            <div>
                              <h3 className="text-lg font-medium mb-2">Professional Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Education</p>
                                  <p className="text-gray-900">{profileData.education || "Not specified"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Experience</p>
                                  <p className="text-gray-900">{profileData.experience || "Not specified"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Languages</p>
                                  <p className="text-gray-900">{profileData.languages || "Not specified"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                                  <p className="text-gray-900">{profileData.hourly_rate ? `$${profileData.hourly_rate}/hour` : "Not specified"}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">Subjects</h3>
                              <div className="flex flex-wrap gap-2">
                                {profileData.subjects?.split(',').map((subject, index) => (
                                  <Badge key={index} variant="secondary">
                                    {subject.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">Bio</h3>
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {profileData.bio || "No bio provided yet."}
                              </p>
                            </div>
                          </>
                        )}

                        {user?.role === UserRole.STUDENT && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Username</p>
                                <p className="text-gray-900">{user?.username || ''}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Location</p>
                                <p className="text-gray-900">{user?.location || "Not specified"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Member since</p>
                                <p className="text-gray-900">{user?.created_at ? new Date(user?.created_at).toLocaleDateString() : "Not available"}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Change Password</Button>
                          <Button>Save Changes</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* My Jobs Tab (for students) */}
              {activeTab === "my-jobs" && user?.role === UserRole.STUDENT && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Job Postings</CardTitle>
                    <CardDescription>Manage your tutoring requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingJobs ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                        <p>Loading your jobs...</p>
                      </div>
                    ) : jobsData && jobsData.length > 0 ? (
                      <div className="space-y-4">
                        {jobsData.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No jobs posted yet</h4>
                        <p className="text-gray-500 mb-4">Post your first tutoring job to find the perfect tutor</p>
                        <Link href="/post-job">
                          <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post a Job
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Favorite Tutors Tab (for students) */}
              {activeTab === "favorite-tutors" && user?.role === UserRole.STUDENT && (
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Tutors</CardTitle>
                    <CardDescription>Your saved tutors for quick access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <h4 className="text-lg font-medium text-gray-900 mb-1">No favorite tutors yet</h4>
                      <p className="text-gray-500 mb-4">Browse tutors and save your favorites for quick access</p>
                      <Link href="/tutors">
                        <Button>Browse Tutors</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Job Applications Tab (for tutors) */}
              {activeTab === "job-applications" && user?.role === UserRole.TUTOR && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Applications</CardTitle>
                    <CardDescription>Track the status of your job applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingJobs ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                        <p>Loading your applications...</p>
                      </div>
                    ) : jobsData && jobsData.length > 0 ? (
                      <Tabs defaultValue="all" className="mb-6">
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="pending">Pending</TabsTrigger>
                          <TabsTrigger value="accepted">Accepted</TabsTrigger>
                          <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4 space-y-4">
                          {jobsData.map((application) => (
                            <div key={application.id} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start">
                                <div>
                                  <Link href={`/jobs/${application.jobId}`}>
                                    <h4 className="text-lg font-medium text-primary hover:underline cursor-pointer">
                                      {application.job?.title || "Untitled Job"}
                                    </h4>
                                  </Link>
                                  <p className="text-sm text-gray-500">
                                    Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <Badge variant={
                                  application.status === "accepted" ? "success" :
                                  application.status === "rejected" ? "destructive" :
                                  "secondary"
                                }>
                                  {application.status}
                                </Badge>
                              </div>
                              <p className="mt-2 text-gray-700 line-clamp-2">{application.proposal}</p>
                              <div className="mt-2 flex justify-between items-center">
                                <p className="text-sm text-gray-500">Your bid: <span className="font-medium">${application.bidAmount}/hr</span></p>
                                <Link href={`/jobs/${application.jobId}`}>
                                  <Button variant="outline" size="sm">View Details</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="pending" className="mt-4">
                          {/* Filter for pending applications */}
                        </TabsContent>
                        <TabsContent value="accepted" className="mt-4">
                          {/* Filter for accepted applications */}
                        </TabsContent>
                        <TabsContent value="rejected" className="mt-4">
                          {/* Filter for rejected applications */}
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No applications yet</h4>
                        <p className="text-gray-500 mb-4">Browse jobs and submit proposals to find teaching opportunities</p>
                        <Link href="/jobs">
                          <Button>Browse Jobs</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Reviews Tab (for tutors) */}
              {activeTab === "reviews" && user?.role === UserRole.TUTOR && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Reviews</CardTitle>
                    <CardDescription>Reviews from your students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profileData && profileData.reviews && profileData.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {profileData.reviews.map((review) => (
                          <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.student?.full_name}`} />
                                <AvatarFallback>{review.student?.full_name ? review.student.full_name.substring(0, 2) : ''}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900">{review.student?.full_name}</p>
                                  <p className="text-xs text-gray-500 ml-2">
                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <Star className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h4>
                        <p className="text-gray-500 mb-4">
                          As you complete tutoring sessions, students will be able to leave reviews
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
