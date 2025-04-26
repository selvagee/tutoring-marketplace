import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  reviews: any[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const [helpfulReviews, setHelpfulReviews] = useState<{ [key: number]: boolean }>({});

  const markReviewHelpful = (reviewId: number) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Reviews Yet</h3>
        <p className="text-gray-500">
          This tutor hasn't received any reviews yet. Be the first to leave a review!
        </p>
      </div>
    );
  }

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.student?.fullName || 'Student'}`} />
                <AvatarFallback>
                  {review.student?.fullName?.substring(0, 2) || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {review.student?.fullName || "Anonymous Student"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.createdAt
                      ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                      : "Recently"}
                  </p>
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-gray-700">{review.comment}</p>
            
            {/* Review actions */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                  onClick={() => markReviewHelpful(review.id)}
                  disabled={helpfulReviews[review.id]}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>
                    {helpfulReviews[review.id] ? "Helpful" : "Mark helpful"}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  <span>Report</span>
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                {review.jobId && "Verified Session"}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {reviews.length > 5 && (
        <div className="mt-6 text-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      )}
    </div>
  );
}
