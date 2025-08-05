
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LoginModal from './LoginModal';
import ProfileModal from './ProfileModal';
import { 
  Home, 
  Calculator, 
  TrendingUp, 
  Info, 
  BarChart3, 
  Menu, 
  X,
  Zap,
  LogIn,
  User,
  LogOut,
  Settings,
  Edit,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUser(currentUser);
      }
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowLogoutConfirm(false);
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/predict', icon: Calculator, label: 'Predict' },
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/insights', icon: TrendingUp, label: 'Insights' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg energy-gradient">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              EnergyAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-500/20 text-green-400 energy-glow'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            ))}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/10">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => setShowProfile(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-medium">Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </NavLink>
              ))}
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 text-gray-300">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={() => { setShowLogoutConfirm(true); setIsOpen(false); }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/10 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setIsOpen(false); }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/10 w-full text-left"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-none w-full h-full p-0 bg-transparent backdrop-blur-sm">
          <LoginModal onClose={() => setShowLogin(false)} onLogin={(userData) => { setUser(userData); setShowLogin(false); }} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-none w-full h-full p-0 bg-black/50 backdrop-blur-sm">
          <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdate={(updatedUser) => { setUser(updatedUser); localStorage.setItem('user', JSON.stringify(updatedUser)); }} />
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navigation;
