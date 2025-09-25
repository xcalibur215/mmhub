import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Menu, X, User, Heart, MessageCircle, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { emergencyLogout } from "@/utils/emergency-logout";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isAdmin, logout, refreshProfile } = useAuth();
  
  const handleRefreshProfile = async () => {
    try {
      await refreshProfile();
      toast({
        title: "Profile refreshed",
        description: "Your profile data has been updated.",
      });
    } catch (error) {
      console.error('Profile refresh failed:', error);
      toast({
        title: "Refresh failed",
        description: "There was an error refreshing your profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      console.log('Header: Starting logout...');
      await logout();
      console.log('Header: Logout successful, navigating...');
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Header: Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive"
      });
      
      // Force logout by clearing everything and refreshing
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const handleForceLogout = () => {
    console.log('Header: Force logout initiated');
    emergencyLogout();
  };
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/listings", label: "Browse Properties", icon: null },
    ...(user ? [{ href: isAdmin ? "/admin" : "/dashboard", label: isAdmin ? "Admin" : "Dashboard", icon: User }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground">MM Hub</span>
      </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/favorites">
                    <Heart className="w-4 h-4" />
                    Favorites
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/messages">
                    <MessageCircle className="w-4 h-4" />
                    Messages
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{profile?.username || user?.email?.split('@')[0] || 'User'}</span>
                      {isAdmin && (
                        <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          Admin
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={isAdmin ? '/admin' : '/dashboard'}>{isAdmin ? 'Admin Panel' : 'Dashboard'}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRefreshProfile}>
                      <RefreshCw className="w-4 h-4 mr-2" /> Refresh Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleForceLogout} className="text-red-800">
                      <LogOut className="w-4 h-4 mr-2" /> Force Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {!user && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4 flex flex-col space-y-2">
                {!user && (
                  <>
                    <Button variant="outline" size="sm" className="justify-start" asChild>
                      <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button variant="hero" size="sm" className="justify-start" asChild>
                      <Link to="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
                {user && (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setIsMobileMenuOpen(false)}>
                        {isAdmin ? 'Admin Panel' : 'Dashboard'}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                        Settings
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start" 
                      onClick={() => { 
                        handleRefreshProfile(); 
                        setIsMobileMenuOpen(false); 
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Profile
                    </Button>
                    <Button variant="destructive" size="sm" className="justify-start" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                    <Button variant="destructive" size="sm" className="justify-start" onClick={() => { handleForceLogout(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Force Logout
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;