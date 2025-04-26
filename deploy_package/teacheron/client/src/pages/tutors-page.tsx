import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TutorCard from "@/components/tutors/tutor-card";
import SearchForm from "@/components/search/search-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, X, SlidersHorizontal } from "lucide-react";

export default function TutorsPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  
  const initialSubject = params.get("subject") || "";
  const initialLocation = params.get("location") || "";
  
  const [filters, setFilters] = useState({
    subject: initialSubject,
    location: initialLocation,
    priceRange: [20, 100],
    onlineOnly: false,
    hasReviews: false,
    sortBy: "rating" // rating, price-low, price-high
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Fetch tutors
  const { data: tutors, isLoading, error } = useQuery({
    queryKey: ["/api/tutors"],
    staleTime: 60000, // 1 minute
  });
  
  // Apply filters to tutors
  const filteredTutors = tutors?.filter((tutor: any) => {
    // Subject filter
    if (filters.subject && !tutor.subjects?.toLowerCase().includes(filters.subject.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (filters.location && tutor.location && !tutor.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (tutor.hourlyRate !== undefined && tutor.hourlyRate !== null) {
      if (tutor.hourlyRate < filters.priceRange[0] || tutor.hourlyRate > filters.priceRange[1]) {
        return false;
      }
    }
    
    // Online only filter
    if (filters.onlineOnly && tutor.isOnline !== undefined && !tutor.isOnline) {
      return false;
    }
    
    // Has reviews filter
    if (filters.hasReviews && (!tutor.totalReviews || tutor.totalReviews === 0)) {
      return false;
    }
    
    return true;
  }) || [];
  
  // Sort tutors
  const sortedTutors = [...filteredTutors].sort((a: any, b: any) => {
    if (filters.sortBy === "rating") {
      return (b.averageRating || 0) - (a.averageRating || 0);
    } else if (filters.sortBy === "price-low") {
      return (a.hourlyRate || 0) - (b.hourlyRate || 0);
    } else if (filters.sortBy === "price-high") {
      return (b.hourlyRate || 0) - (a.hourlyRate || 0);
    }
    return 0;
  });
  
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      subject: "",
      location: "",
      priceRange: [20, 100],
      onlineOnly: false,
      hasReviews: false,
      sortBy: "rating"
    });
  };
  
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Find Tutors</h1>
            <SearchForm />
          </div>
          
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters - Desktop View */}
            <div className="hidden lg:block">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="block mb-2">Subject</Label>
                    <Input 
                      type="text" 
                      placeholder="e.g. Mathematics"
                      value={filters.subject}
                      onChange={(e) => handleFilterChange("subject", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Location</Label>
                    <Input 
                      type="text" 
                      placeholder="e.g. New York"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Price Range ($/hr)</Label>
                    <div className="pt-6 pb-2">
                      <Slider 
                        value={filters.priceRange}
                        min={10}
                        max={200}
                        step={5}
                        onValueChange={(value) => handleFilterChange("priceRange", value)}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="online-only"
                        checked={filters.onlineOnly}
                        onCheckedChange={(checked) => handleFilterChange("onlineOnly", !!checked)}
                      />
                      <Label htmlFor="online-only">Online tutors only</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="has-reviews"
                        checked={filters.hasReviews}
                        onCheckedChange={(checked) => handleFilterChange("hasReviews", !!checked)}
                      />
                      <Label htmlFor="has-reviews">Has reviews</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Sort By</Label>
                    <select 
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    >
                      <option value="rating">Highest Rating</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                onClick={toggleMobileFilters} 
                className="w-full flex justify-between items-center"
              >
                <span>Filters & Sorting</span>
                <SlidersHorizontal className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            {/* Mobile Filters Dropdown */}
            {isMobileFiltersOpen && (
              <div className="lg:hidden mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-2">Subject</Label>
                    <Input 
                      type="text" 
                      placeholder="e.g. Mathematics"
                      value={filters.subject}
                      onChange={(e) => handleFilterChange("subject", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Location</Label>
                    <Input 
                      type="text" 
                      placeholder="e.g. New York"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Price Range ($/hr)</Label>
                    <div className="pt-6 pb-2">
                      <Slider 
                        value={filters.priceRange}
                        min={10}
                        max={200}
                        step={5}
                        onValueChange={(value) => handleFilterChange("priceRange", value)}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mobile-online-only"
                        checked={filters.onlineOnly}
                        onCheckedChange={(checked) => handleFilterChange("onlineOnly", !!checked)}
                      />
                      <Label htmlFor="mobile-online-only">Online tutors only</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mobile-has-reviews"
                        checked={filters.hasReviews}
                        onCheckedChange={(checked) => handleFilterChange("hasReviews", !!checked)}
                      />
                      <Label htmlFor="mobile-has-reviews">Has reviews</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Sort By</Label>
                    <select 
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    >
                      <option value="rating">Highest Rating</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  
                  <Button variant="default" onClick={toggleMobileFilters} className="w-full mt-4">
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
            
            {/* Tutors Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-800">
                  An error occurred while loading tutors. Please try again later.
                </div>
              ) : sortedTutors.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
                  <p className="text-gray-500">
                    No tutors match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedTutors.map((tutor: any) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
