import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

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
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
