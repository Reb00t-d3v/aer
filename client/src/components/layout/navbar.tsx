import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-primary-dark font-bold text-2xl">Removo</span>
              </a>
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link href="/#features">
                <a className="px-3 py-2 text-sm font-medium hover:text-primary">Features</a>
              </Link>
              <Link href="/#pricing">
                <a className="px-3 py-2 text-sm font-medium hover:text-primary">Pricing</a>
              </Link>
              {user && (
                <>
                  <Link href="/dashboard">
                    <a className={`px-3 py-2 text-sm font-medium hover:text-primary ${location === "/dashboard" ? "text-primary" : ""}`}>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/profile">
                    <a className={`px-3 py-2 text-sm font-medium hover:text-primary ${location === "/profile" ? "text-primary" : ""}`}>
                      Profile
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <>
                <span className="text-sm">{user.username}</span>
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth?tab=signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="mt-6 flex flex-col gap-4">
                <Link href="/#features" onClick={() => setMobileMenuOpen(false)}>
                  <a className="px-3 py-2 text-base hover:text-primary">Features</a>
                </Link>
                <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)}>
                  <a className="px-3 py-2 text-base hover:text-primary">Pricing</a>
                </Link>
                {user && (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <a className="px-3 py-2 text-base hover:text-primary">Dashboard</a>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <a className="px-3 py-2 text-base hover:text-primary">Profile</a>
                    </Link>
                  </>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <Button 
                    className="w-full flex items-center justify-start px-3" 
                    variant="ghost" 
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5 mr-2" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <>
                      <div className="px-3 py-2 mb-2">Signed in as <span className="font-semibold">{user.username}</span></div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link href="/auth?tab=signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
