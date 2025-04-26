import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Mail, 
  Menu, 
  User,
  Settings,
  LogOut, 
  LayoutDashboard,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch unread messages count for notification badge
  const { data: conversations = [] } = useQuery({
    queryKey: ["/api/messages/conversations"],
    enabled: !!user,
  });

  // Calculate total unread messages
  const unreadCount = conversations.reduce((total: number, convo: any) => {
    return total + (convo.unreadCount || 0);
  }, 0);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Find Tutors", href: "/tutors" },
    { name: "Teaching Jobs", href: "/jobs" },
    { name: "How It Works", href: "/#how-it-works" },
  ];
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary font-bold text-2xl cursor-pointer">TeacherOn</span>
              </Link>
            </div>
            
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === item.href 
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-gray-500" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs bg-red-500">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {conversations.length > 0 ? (
                      conversations.map((convo: any) => (
                        <Link key={convo.userId} href={`/messages/${convo.userId}`}>
                          <DropdownMenuItem className="py-3">
                            <div className="flex items-start w-full">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${convo.user?.full_name || convo.user?.username || 'User'}`} />
                                <AvatarFallback>{convo.user?.full_name ? convo.user.full_name.substring(0, 2) : (convo.user?.username ? convo.user.username.substring(0, 2).toUpperCase() : "U")}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium">{convo.user?.full_name || convo.user?.username || 'Unknown User'}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  You have {convo.unreadCount} unread {convo.unreadCount === 1 ? 'message' : 'messages'}
                                </p>
                              </div>
                              {convo.unreadCount > 0 && (
                                <Badge variant="default" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                                  {convo.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </DropdownMenuItem>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    )}
                    
                    <DropdownMenuSeparator />
                    <Link href="/messages">
                      <DropdownMenuItem className="justify-center font-medium text-primary">
                        View all messages
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name || user.username || 'User'}`} 
                        />
                        <AvatarFallback>{user.full_name ? user.full_name.substring(0, 2) : (user.username ? user.username.substring(0, 2).toUpperCase() : 'U')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700 hidden md:block">{user.full_name || user.username || 'User'}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/admin">
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {user.role === "student" && (
                  <Link href="/post-job">
                    <Button>Post a Job</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="default">Sign In</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location === item.href 
                    ? "bg-primary-50 border-primary text-primary-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage
                      src={user.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name || user.username || 'User'}`} 
                    />
                    <AvatarFallback>{user.full_name ? user.full_name.substring(0, 2) : (user.username ? user.username.substring(0, 2).toUpperCase() : 'U')}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.full_name || user.username || 'User'}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <Link href="/messages" className="ml-auto relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-6 w-6 text-gray-400" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center p-0 text-xs bg-red-500">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>
              <div className="mt-3 space-y-1">
                <Link 
                  href="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link 
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                {user.role === "admin" && (
                  <Link 
                    href="/admin"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button 
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1 px-2">
                <Link href="/auth">
                  <Button className="w-full justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="w-full justify-center" variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
