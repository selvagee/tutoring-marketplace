import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole, TutorApprovalStatus } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Users, 
  FileText, 
  AlertCircle, 
  Settings, 
  BarChart3,
  Loader2,
  ChevronDown,
  CheckCircle,
  XCircle,
  Ban,
  User,
  UserCheck,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { format } from "date-fns";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch all users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!(user && user.role === UserRole.ADMIN),
  });

  // Fetch all jobs
  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["/api/jobs"],
    enabled: !!(user && user.role === UserRole.ADMIN),
  });
  
  // Fetch all tutor profiles
  const { data: tutorProfiles, isLoading: isLoadingTutorProfiles } = useQuery({
    queryKey: ["/api/admin/tutor-profiles"],
    enabled: !!(user && user.role === UserRole.ADMIN),
  });
  
  // Fetch analytics data
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
    enabled: !!(user && user.role === UserRole.ADMIN && activeTab === "dashboard"),
  });

  // Mutation to update user (e.g., change role, suspend account)
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User updated successfully",
        description: "The user's information has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "User deleted successfully",
        description: "The user has been permanently deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to approve a tutor
  const approveTutorMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("PATCH", `/api/admin/tutor-profiles/${userId}/approve`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tutor-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({
        title: "Tutor approved",
        description: "The tutor has been approved and can now start accepting jobs.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error approving tutor",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to reject a tutor
  const rejectTutorMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: number; reason: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/tutor-profiles/${userId}/reject`, { reason });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tutor-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setIsRejectDialogOpen(false);
      setSelectedTutor(null);
      setRejectionReason("");
      toast({
        title: "Tutor rejected",
        description: "The tutor application has been rejected with feedback.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error rejecting tutor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if user is an admin
  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center p-8">
              <CardTitle className="flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500 mr-4" />
                <span className="text-2xl font-bold text-gray-900">Access Denied</span>
              </CardTitle>
              <CardDescription className="text-lg mb-6">
                This area is restricted to administrators only.
              </CardDescription>
              <Button onClick={() => navigate("/")}>
                Return to Homepage
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter users based on search query
  const filteredUsers = users?.filter((user: any) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.fullName?.toLowerCase().includes(query)
    );
  });

  // Handle role change
  const handleRoleChange = (userId: number, newRole: string) => {
    updateUserMutation.mutate({
      userId,
      data: { role: newRole },
    });
  };


  
  // Handle user deletion confirmation
  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };
  
  // Handle tutor rejection confirmation
  const confirmRejectTutor = () => {
    if (selectedTutor && rejectionReason) {
      rejectTutorMutation.mutate({
        userId: selectedTutor.userId,
        reason: rejectionReason
      });
    } else {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-lg text-gray-500">
              Manage users, content, and system settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Admin Controls</h2>
                </div>

                <div className="p-4">
                  <div className="space-y-1">
                    <Button
                      variant={activeTab === "dashboard" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant={activeTab === "users" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                    <Button
                      variant={activeTab === "jobs" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("jobs")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Job Postings
                    </Button>
                    <Button
                      variant={activeTab === "tutors" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("tutors")}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Tutor Approval
                    </Button>
                    <Button
                      variant={activeTab === "reports" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("reports")}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Reported Content
                    </Button>
                    <Button
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Dashboard Overview Tab */}
              {activeTab === "dashboard" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Overview</CardTitle>
                    <CardDescription>Platform statistics and analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary-100 text-primary mr-3">
                            <Users className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-2xl font-semibold">{users?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary-100 text-primary mr-3">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Active Jobs</p>
                            <p className="text-2xl font-semibold">{jobs?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary-100 text-primary mr-3">
                            <AlertCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Pending Reports</p>
                            <p className="text-2xl font-semibold">0</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Recent User Registrations</h3>
                        {isLoadingUsers ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                            <p>Loading users...</p>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {users?.slice(0, 5).map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                                        <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{user.fullName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      user.role === UserRole.ADMIN 
                                        ? "default"
                                        : user.role === UserRole.TUTOR
                                        ? "secondary"
                                        : "outline"
                                    }>
                                      {user.role}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => setActiveTab("users")}>
                            View All Users
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Recent Job Postings</h3>
                        {isLoadingJobs ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                            <p>Loading jobs...</p>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Posted</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {jobs?.slice(0, 5).map((job: any) => (
                                <TableRow key={job.id}>
                                  <TableCell>
                                    <p className="font-medium">{job.title}</p>
                                  </TableCell>
                                  <TableCell>
                                    {job.student?.fullName || 'Unknown'}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      job.status === "open" ? "success" :
                                      job.status === "assigned" ? "secondary" :
                                      job.status === "completed" ? "default" :
                                      "outline"
                                    }>
                                      {job.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {job.createdAt ? format(new Date(job.createdAt), 'MMM d, yyyy') : 'N/A'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => setActiveTab("jobs")}>
                            View All Jobs
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Management Tab */}
              {activeTab === "users" && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all users on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search users by name, email or username"
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="ml-4">
                        <Button variant="outline">
                          Filter
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {isLoadingUsers ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                        <p>Loading users...</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Username</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Joined</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers?.map((user: any) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                                      <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{user.fullName}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    user.role === UserRole.ADMIN 
                                      ? "default"
                                      : user.role === UserRole.TUTOR
                                      ? "secondary"
                                      : "outline"
                                  }>
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div className={`h-2 w-2 rounded-full mr-2 ${user.isOnline ? "bg-green-500" : "bg-gray-300"}`}></div>
                                    <span>{user.isOnline ? "Online" : "Offline"}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <span className="sr-only">Open menu</span>
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem 
                                        onClick={() => window.open(`/tutors/${user.id}`, '_blank')}
                                        className="cursor-pointer"
                                      >
                                        <User className="mr-2 h-4 w-4" />
                                        View Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                      <DropdownMenuItem
                                        onClick={() => handleRoleChange(user.id, UserRole.STUDENT)}
                                        className="cursor-pointer"
                                      >
                                        Set as Student
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleRoleChange(user.id, UserRole.TUTOR)}
                                        className="cursor-pointer"
                                      >
                                        Set as Tutor
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleRoleChange(user.id, UserRole.ADMIN)}
                                        className="cursor-pointer"
                                      >
                                        Set as Admin
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="cursor-pointer">
                                        <Ban className="mr-2 h-4 w-4" />
                                        Suspend Account
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600 cursor-pointer"
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setIsDeleteDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Account
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Job Postings Tab */}
              {activeTab === "jobs" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Job Postings</CardTitle>
                    <CardDescription>Review and manage all job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search jobs by title or description"
                          className="pl-10"
                        />
                      </div>
                      <div className="ml-4">
                        <Button variant="outline">
                          Filter
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {isLoadingJobs ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                        <p>Loading jobs...</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Posted</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {jobs?.map((job: any) => (
                            <TableRow key={job.id}>
                              <TableCell>
                                <p className="font-medium">{job.title}</p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">{job.description?.substring(0, 100)}...</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${job.student?.fullName}`} />
                                    <AvatarFallback>{job.student?.fullName?.substring(0, 2) || "U"}</AvatarFallback>
                                  </Avatar>
                                  <span>{job.student?.fullName || "Unknown"}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  job.status === "open" ? "success" :
                                  job.status === "assigned" ? "secondary" :
                                  job.status === "completed" ? "default" :
                                  "outline"
                                }>
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{job.budget}</TableCell>
                              <TableCell>
                                {job.createdAt ? format(new Date(job.createdAt), 'MMM d, yyyy') : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tutor Approval Tab */}
              {activeTab === "tutors" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tutor Approval</CardTitle>
                    <CardDescription>Review and approve tutor applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTutorProfiles ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                        <p>Loading tutor profiles...</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-medium">Pending Approval</h3>
                          <Badge variant="outline">
                            {tutorProfiles?.filter((profile: any) => 
                              profile.approvalStatus === TutorApprovalStatus.PENDING
                            ).length || 0} Pending
                          </Badge>
                        </div>
                        
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tutor</TableHead>
                                <TableHead>Subjects</TableHead>
                                <TableHead>Hourly Rate</TableHead>
                                <TableHead>Application Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tutorProfiles?.filter((profile: any) => 
                                profile.approvalStatus === TutorApprovalStatus.PENDING
                              ).map((profile: any) => {
                                const user = users?.find((u: any) => u.id === profile.userId);
                                
                                return (
                                  <TableRow key={profile.id}>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                          <AvatarImage 
                                            src={profile.profileImageUrl || 
                                              `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`} 
                                          />
                                          <AvatarFallback>{user?.fullName?.substring(0, 2) || 'NA'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{user?.fullName || 'Unknown'}</p>
                                          <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="max-w-xs truncate">
                                        {profile.subjects || 'Not specified'}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      ${profile.hourlyRate}/hr
                                    </TableCell>
                                    <TableCell>
                                      {user?.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            approveTutorMutation.mutate(profile.userId);
                                          }}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                          Approve
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            setSelectedTutor(profile);
                                            setIsRejectDialogOpen(true);
                                          }}
                                        >
                                          <XCircle className="h-4 w-4 mr-1 text-red-600" />
                                          Reject
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              
                              {tutorProfiles?.filter((profile: any) => 
                                profile.approvalStatus === TutorApprovalStatus.PENDING
                              ).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                    No pending tutor applications
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div className="mt-8 mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-medium">Recently Approved Tutors</h3>
                        </div>
                        
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tutor</TableHead>
                                <TableHead>Subjects</TableHead>
                                <TableHead>Hourly Rate</TableHead>
                                <TableHead>Approval Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tutorProfiles?.filter((profile: any) => 
                                profile.approvalStatus === TutorApprovalStatus.APPROVED
                              ).slice(0, 5).map((profile: any) => {
                                const user = users?.find((u: any) => u.id === profile.userId);
                                
                                return (
                                  <TableRow key={profile.id}>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                          <AvatarImage 
                                            src={profile.profileImageUrl || 
                                              `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`} 
                                          />
                                          <AvatarFallback>{user?.fullName?.substring(0, 2) || 'NA'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{user?.fullName || 'Unknown'}</p>
                                          <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="max-w-xs truncate">
                                        {profile.subjects || 'Not specified'}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      ${profile.hourlyRate}/hr
                                    </TableCell>
                                    <TableCell>
                                      {user?.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              
                              {tutorProfiles?.filter((profile: any) => 
                                profile.approvalStatus === TutorApprovalStatus.APPROVED
                              ).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                                    No approved tutors yet
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Reported Content Tab */}
              {activeTab === "reports" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Reported Content</CardTitle>
                    <CardDescription>Manage reported content and user complaints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear!</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        There are no pending reports to review at this time. All reported content has been addressed.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* System Settings Tab */}
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure platform settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">General Settings</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="site-name">Site Name</Label>
                            <Input id="site-name" defaultValue="TeacherOn" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-email">Contact Email</Label>
                            <Input id="contact-email" defaultValue="admin@teacheron.com" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site-description">Site Description</Label>
                          <Input id="site-description" defaultValue="Connecting tutors with students worldwide" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Settings</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="smtp-host">SMTP Host</Label>
                            <Input id="smtp-host" defaultValue="smtp.example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smtp-port">SMTP Port</Label>
                            <Input id="smtp-port" defaultValue="587" type="number" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="smtp-user">SMTP Username</Label>
                            <Input id="smtp-user" defaultValue="notifications@teacheron.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smtp-pass">SMTP Password</Label>
                            <Input id="smtp-pass" type="password" defaultValue="********" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account for {selectedUser?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm">
            <p>This will permanently remove all user data including:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Profile information</li>
              <li>Job postings and applications</li>
              <li>Messages and reviews</li>
              <li>Payment information</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutor Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Tutor Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this tutor application. This will be sent to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="reason" className="text-right">
              Rejection Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain why this application is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="h-32"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejectTutor}
              disabled={!rejectionReason.trim()}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
