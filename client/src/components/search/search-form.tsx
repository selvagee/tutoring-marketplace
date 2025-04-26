import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book, MapPin } from "lucide-react";

export default function SearchForm() {
  const [, navigate] = useLocation();
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");

  const popularSubjects = [
    { name: "Mathematics", link: "/tutors?subject=Mathematics" },
    { name: "English", link: "/tutors?subject=English" },
    { name: "Programming", link: "/tutors?subject=Programming" },
    { name: "Physics", link: "/tutors?subject=Physics" },
    { name: "Spanish", link: "/tutors?subject=Spanish" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (subject.trim() === "" && location.trim() === "") {
      return;
    }
    
    const params = new URLSearchParams();
    if (subject) params.append("subject", subject);
    if (location) params.append("location", location);
    
    navigate(`/tutors?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <div className="relative">
                <Input
                  type="text"
                  id="subject"
                  placeholder="Math, Science, Language..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="pl-3 pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <Input
                  type="text"
                  id="location"
                  placeholder="City, State or Online"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-3 pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full md:w-auto">
                Search
              </Button>
            </div>
          </div>
        </form>
        <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-2">
          <span>Popular:</span>
          {popularSubjects.map((subject, index) => (
            <span key={index}>
              <a href={subject.link} className="text-primary hover:text-primary-700">
                {subject.name}
              </a>
              {index < popularSubjects.length - 1 && " · "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
