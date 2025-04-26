import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Briefcase, 
  Languages, 
  DollarSign,
  Star,
  User
} from "lucide-react";

interface TutorCardProps {
  tutor: any;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-all hover:shadow-md">
      <div className="relative pb-2/3">
        <img 
          className="h-48 w-full object-cover" 
          src={tutor.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.fullName}&backgroundType=gradientLinear&backgroundRotation=360&backgroundColor=4f46e5,60a5fa`}
          alt={`${tutor.fullName}'s profile image`} 
        />
        <div 
          className={`absolute top-2 right-2 ${
            tutor.isOnline 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          } text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full`}
        >
          <span className="relative flex h-2 w-2 mr-1">
            {tutor.isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              tutor.isOnline ? "bg-green-500" : "bg-gray-500"
            }`}></span>
          </span>
          {tutor.isOnline ? "Online" : "Offline"}
        </div>
      </div>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {tutor.fullName}
          </h3>
          <div className="flex items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="ml-1 text-sm text-gray-500">{tutor.averageRating?.toFixed(1) || "New"}</span>
            </div>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-sm text-gray-500">{tutor.totalReviews || 0} reviews</span>
          </div>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {tutor.subjects}
        </p>
        <div className="mt-4">
          <div className="flex items-center">
            <GraduationCap className="h-4 w-4 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">{tutor.education || "Education not specified"}</span>
          </div>
          <div className="mt-2 flex items-center">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">{tutor.experience || "Experience not specified"}</span>
          </div>
          <div className="mt-2 flex items-center">
            <Languages className="h-4 w-4 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">{tutor.languages || "Languages not specified"}</span>
          </div>
          <div className="mt-2 flex items-center">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">
              ${tutor.hourlyRate || "30"}-{tutor.hourlyRate ? tutor.hourlyRate + 15 : "45"}/hour
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {tutor.bio || "No bio available. This tutor has not provided additional information about their teaching style and methodology."}
        </p>
      </CardContent>
      <CardFooter className="px-4 py-4 sm:px-6 flex space-x-3">
        <Link href={`/tutors/${tutor.userId}`}>
          <Button className="flex-1">View Profile</Button>
        </Link>
        <Link href={`/messages/${tutor.userId}`}>
          <Button variant="outline" className="flex-1">Contact</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
