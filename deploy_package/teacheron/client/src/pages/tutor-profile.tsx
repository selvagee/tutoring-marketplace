import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ReviewList from "@/components/reviews/review-list";
import ReviewForm from "@/components/reviews/review-form";
import { UserRole } from "@shared/schema";
import {
  GraduationCap,
  Briefcase,
  Languages,
  DollarSign,
  Star,
  Mail,
  MapPin,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function TutorProfile() {
  const params = useParams();
  const tutorId = params.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch tutor details
  const {
    data: tutorData,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: [`/api/tutors/${tutorId}`],
    enabled: !!tutorId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="md:w-2/3 space-y-6">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !tutorData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutor Not Found</h2>
              <p className="text-gray-600 mb-4">The tutor you're looking for could not be found or has been removed.</p>
              <Button asChild>
                <Link href="/tutors">Browse All Tutors</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    fullName,
    email,
    location,
    bio,
    subjects,
    education,
    experience,
    languages,
    hourlyRate,
    isOnline,
    averageRating,
    totalReviews,
    reviews = [],
  } = tutorData;

  // Split subjects into array if it's a string
  const subjectsList = typeof subjects === 'string' ? subjects.split(',').map(s => s.trim()) : [];

  // Check if current user can review this tutor (must be a student)
  const canReview = user && user.role === UserRole.STUDENT;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left column - Profile info */}
                <div className="md:w-1/3">
                  <div className="relative">
                    <Avatar className="h-48 w-48 mx-auto">
                      <AvatarImage 
                        src={tutorData.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}&backgroundType=gradientLinear&backgroundRotation=360&backgroundColor=4f46e5,60a5fa`} 
                      />
                      <AvatarFallback>{fullName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online
                      </Badge>
                    )}
                  </div>

                  <div className="mt-6 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      <span className="ml-1 text-gray-700 font-medium">
                        {averageRating?.toFixed(1) || "New"}{" "}
                        <span className="text-gray-500 font-normal">({totalReviews || 0} reviews)</span>
                      </span>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="ml-2 text-gray-600">{location || "Location not specified"}</span>
                      </div>
                      <div className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="ml-2 text-gray-600">{education || "Education not specified"}</span>
                      </div>
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="ml-2 text-gray-600">{experience || "Experience not specified"}</span>
                      </div>
                      <div className="flex items-start">
                        <Languages className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="ml-2 text-gray-600">{languages || "Languages not specified"}</span>
                      </div>
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="ml-2 text-gray-600">{hourlyRate ? `$${hourlyRate}/hour` : "Rate not specified"}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      {user ? (
                        <Button asChild className="w-full">
                          <Link href={`/messages/${tutorId}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild className="w-full">
                          <Link href="/auth">
                            <Mail className="h-4 w-4 mr-2" />
                            Login to Contact
                          </Link>
                        </Button>
                      )}
                      {user ? (
                        <Button variant="outline" className="w-full" onClick={() => toast({
                          title: "Booking Request Sent",
                          description: "Your booking request has been sent to the tutor. They will contact you soon.",
                        })}>
                          <Clock className="h-4 w-4 mr-2" />
                          Book a Session
                        </Button>
                      ) : (
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/auth">
                            <Clock className="h-4 w-4 mr-2" />
                            Login to Book
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right column - Bio, subjects, reviews */}
                <div className="md:w-2/3 mt-8 md:mt-0">
                  <Tabs defaultValue="about">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="subjects">Subjects</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about">
                      <Card>
                        <CardContent className="pt-6">
                          <h2 className="text-xl font-semibold mb-4">About Me</h2>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {bio || "This tutor has not provided a bio yet."}
                          </p>

                          <h2 className="text-xl font-semibold mt-8 mb-4">Teaching Approach</h2>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                                <Check className="h-4 w-4" />
                              </div>
                              <span className="ml-3 text-gray-700">Personalized learning plans tailored to each student's needs</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                                <Check className="h-4 w-4" />
                              </div>
                              <span className="ml-3 text-gray-700">Clear explanations with real-world examples</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                                <Check className="h-4 w-4" />
                              </div>
                              <span className="ml-3 text-gray-700">Regular progress assessments and feedback</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary">
                                <Check className="h-4 w-4" />
                              </div>
                              <span className="ml-3 text-gray-700">Homework help and exam preparation</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="subjects">
                      <Card>
                        <CardContent className="pt-6">
                          <h2 className="text-xl font-semibold mb-4">Subjects I Teach</h2>
                          {subjectsList.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {subjectsList.map((subject, index) => (
                                <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-primary-100 text-primary-800 hover:bg-primary-200">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No subjects specified.</p>
                          )}

                          <h2 className="text-xl font-semibold mt-8 mb-4">Availability</h2>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            <div className="border border-gray-200 rounded-md p-3 text-center">
                              <div className="font-medium">Monday</div>
                              <div className="text-sm text-gray-500">3PM - 8PM</div>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 text-center">
                              <div className="font-medium">Tuesday</div>
                              <div className="text-sm text-gray-500">3PM - 8PM</div>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 text-center">
                              <div className="font-medium">Wednesday</div>
                              <div className="text-sm text-gray-500">3PM - 8PM</div>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 text-center">
                              <div className="font-medium">Thursday</div>
                              <div className="text-sm text-gray-500">3PM - 8PM</div>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 text-center">
                              <div className="font-medium">Friday</div>
                              <div className="text-sm text-gray-500">2PM - 6PM</div>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 text-center">
                              <div className="font-medium">Saturday</div>
                              <div className="text-sm text-gray-500">10AM - 4PM</div>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 text-center">
                              <div className="font-medium">Sunday</div>
                              <div className="text-sm text-gray-500">Unavailable</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="reviews">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Reviews</h2>
                            <div className="flex items-center">
                              <Star className="h-5 w-5 text-amber-500" />
                              <span className="ml-1 text-gray-700 font-medium">
                                {averageRating?.toFixed(1) || "New"}{" "}
                                <span className="text-gray-500 font-normal">({totalReviews || 0} reviews)</span>
                              </span>
                            </div>
                          </div>
                          
                          {user && user.role === UserRole.STUDENT ? (
                            <div className="mb-8">
                              <ReviewForm tutorId={tutorId} />
                            </div>
                          ) : user ? (
                            <div className="mb-8 p-4 bg-gray-50 rounded-md text-center">
                              <p className="text-gray-600">Only students can leave reviews for tutors.</p>
                            </div>
                          ) : (
                            <div className="mb-8 p-4 bg-gray-50 rounded-md text-center">
                              <p className="text-gray-600 mb-2">Log in to leave a review for this tutor.</p>
                              <Button asChild size="sm">
                                <Link href="/auth">
                                  <Star className="h-4 w-4 mr-2" />
                                  Login to Review
                                </Link>
                              </Button>
                            </div>
                          )}
                          
                          <ReviewList reviews={reviews} />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
