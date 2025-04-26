import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Chatbot from "@/components/chatbot/chatbot";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TutorsPage from "@/pages/tutors-page";
import TutorProfile from "@/pages/tutor-profile";
import JobsPage from "@/pages/jobs-page";
import JobDetails from "@/pages/job-details";
import PostJob from "@/pages/post-job";
import MessagesPage from "@/pages/messages-page";
import DashboardPage from "@/pages/dashboard-page";
import AdminPage from "@/pages/admin-page";

// Footer pages
import AboutUs from "@/pages/about-us";
import HowItWorks from "@/pages/how-it-works";
import StudentResources from "@/pages/student-resources";
import SuccessStories from "@/pages/success-stories";
import TeachingTips from "@/pages/teaching-tips";
import TeacherResources from "@/pages/teacher-resources";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/tutors" component={TutorsPage} />
      <Route path="/tutors/:id" component={TutorProfile} />
      <Route path="/jobs" component={JobsPage} />
      <Route path="/jobs/:id" component={JobDetails} />
      <ProtectedRoute path="/post-job" component={PostJob} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/messages/:id" component={MessagesPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/profile" component={() => <DashboardPage initialTab="profile" />} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      
      {/* Footer Pages */}
      <Route path="/about-us" component={AboutUs} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/student-resources" component={StudentResources} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/teaching-tips" component={TeachingTips} />
      <Route path="/teacher-resources" component={TeacherResources} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <Chatbot />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
