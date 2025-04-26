import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardFooter
} from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  Star
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  // Parse job subjects into array if it's a string
  const subjectTags = typeof job.subjects === 'string' 
    ? job.subjects.split(',').map((s: string) => s.trim()) 
    : [];

  // Format creation date
  const postedTime = job.createdAt
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: false })
    : "recently";

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-all hover:shadow-md">
      <CardHeader className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {job.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 flex flex-wrap items-center gap-3">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
              {job.location}
            </span>
            {job.hoursPerWeek && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                {job.hoursPerWeek} hours/week
              </span>
            )}
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
              {job.budget}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              Posted {postedTime} ago
            </span>
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex-shrink-0">
          <Badge variant={job.status === "open" ? "success" : "secondary"} className="text-xs">
            {job.status === "open" ? "Open" : job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <p className="text-sm text-gray-600">
          {job.description}
        </p>
        {subjectTags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {subjectTags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${job.student?.fullName || 'Student'}`} />
              <AvatarFallback>{(job.student?.fullName || 'S').substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{job.student?.fullName || "Student"}</p>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="ml-1 text-xs text-gray-500">
                  {job.student?.isNew
                    ? "New Student"
                    : job.student?.averageRating
                    ? `${job.student.averageRating} (${job.student.totalReviews} reviews)`
                    : "No reviews yet"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <Button 
              variant="outline"
              onClick={() => window.location.href = `/jobs/${job.id}`}
            >
              View Details
            </Button>
            <Button 
              className="ml-3"
              onClick={() => window.location.href = `/jobs/${job.id}`}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
