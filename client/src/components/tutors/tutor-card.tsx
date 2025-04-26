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
  // Generate a unique background color based on user id
  const getBackgroundColor = () => {
    const id = tutor.user_id || tutor.userId || tutor.id || 0;
    const colors = [
      '4f46e5', // Indigo
      '7c3aed', // Purple
      'ec4899', // Pink
      'ef4444', // Red
      'f59e0b', // Amber
      '10b981', // Emerald
      '06b6d4', // Cyan
      '0891b2', // Teal
    ];
    const colorIndex = id % colors.length;
    return colors[colorIndex];
  };

  // Function to check if URL is external (not local /assets/ path)
  const isExternalUrl = (url: string): boolean => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  // Get profile image URL, with appropriate fallbacks
  const getProfileImageUrl = (): string => {
    const profileUrl = tutor.profile_image_url || tutor.profileImageUrl;
    
    // For debugging - log the profile URL we're working with
    console.log("Tutor profile data:", {
      id: tutor.id,
      profile_url: profileUrl,
      user_id: tutor.user_id,
      fullName: tutor.full_name || tutor.fullName
    });
    
    // If the profile URL appears to be a Base64 encoded image
    if (profileUrl && (profileUrl.startsWith('data:image') || profileUrl.includes('base64'))) {
      return profileUrl;
    }
    
    // If URL exists and is external, use it
    if (profileUrl && isExternalUrl(profileUrl)) {
      return profileUrl;
    }
    
    // Use DiceBear as a more reliable image generator
    // This creates consistent, high-quality avatars based on the user's name
    return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(tutor.full_name || tutor.fullName || tutor.username || "Tutor")}&backgroundType=gradientLinear&backgroundColor=4f46e5,60a5fa`;
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-all hover:shadow-md">
      <div className="relative pb-2/3">
        <img 
          className="h-48 w-full object-cover" 
          src={getProfileImageUrl()}
          alt={`${tutor.fullName || tutor.full_name}'s profile image`} 
          onError={(e) => {
            // If image still fails to load, replace with UI Avatars
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.full_name || tutor.fullName || "Tutor")}&background=${getBackgroundColor()}&color=fff&size=256&bold=true`;
          }}
        />
        <div 
          className={`absolute top-2 right-2 ${
            tutor.is_online || tutor.isOnline
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          } text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full`}
        >
          <span className="relative flex h-2 w-2 mr-1">
            {(tutor.is_online || tutor.isOnline) && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              (tutor.is_online || tutor.isOnline) ? "bg-green-500" : "bg-gray-500"
            }`}></span>
          </span>
          {(tutor.is_online || tutor.isOnline) ? "Online" : "Offline"}
        </div>
      </div>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {tutor.full_name || tutor.fullName}
          </h3>
          <div className="flex items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="ml-1 text-sm text-gray-500">
                {tutor.average_rating ? parseFloat(tutor.average_rating).toFixed(1) : 
                 tutor.averageRating ? tutor.averageRating.toFixed(1) : "New"}
              </span>
            </div>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-sm text-gray-500">
              {tutor.total_reviews || tutor.totalReviews || 0} reviews
            </span>
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
              ${tutor.hourly_rate || tutor.hourlyRate || "30"}-
              {(tutor.hourly_rate || tutor.hourlyRate) 
                ? (parseInt(tutor.hourly_rate || tutor.hourlyRate) + 15) 
                : "45"}/hour
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {tutor.bio || "No bio available. This tutor has not provided additional information about their teaching style and methodology."}
        </p>
      </CardContent>
      <CardFooter className="px-4 py-4 sm:px-6 flex space-x-3">
        <Link href={`/tutors/${tutor.user_id || tutor.userId || tutor.id}`}>
          <Button className="flex-1">View Profile</Button>
        </Link>
        <Link href={`/messages/${tutor.user_id || tutor.userId || tutor.id}`}>
          <Button variant="outline" className="flex-1">Contact</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
