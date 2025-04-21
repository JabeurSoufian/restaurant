import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Calendar,
  PackageOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu as MenuIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  currentPath: string;
  onClick: (path: string) => void;
  roles?: ('admin' | 'server' | 'chef')[];
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  path,
  currentPath,
  onClick,
  roles = ['admin', 'server', 'chef'],
}) => {
  const { user } = useAuthStore();
  
  // If user role is not in the allowed roles, don't render the item
  if (user && !roles.includes(user.role)) {
    return null;
  }
  
  const isActive = currentPath === path;
  
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start gap-3 my-1',
        isActive && 'bg-secondary text-secondary-foreground font-medium'
      )}
      onClick={() => onClick(path)}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const { user, logout } = useAuthStore();
  
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/dashboard',
      roles: ['admin', 'server', 'chef'] as const,
    },
    {
      icon: <Utensils size={20} />,
      label: 'Menu',
      path: '/menu',
      roles: ['admin', 'server', 'chef'] as const,
    },
    {
      icon: <ClipboardList size={20} />,
      label: 'Orders',
      path: '/orders',
      roles: ['admin', 'server', 'chef'] as const,
    },
    {
      icon: <MenuIcon size={20} />,
      label: 'Tables',
      path: '/tables',
      roles: ['admin', 'server'] as const,
    },
    {
      icon: <Calendar size={20} />,
      label: 'Reservations',
      path: '/reservations',
      roles: ['admin', 'server'] as const,
    },
    {
      icon: <PackageOpen size={20} />,
      label: 'Inventory',
      path: '/inventory',
      roles: ['admin', 'chef'] as const,
    },
    {
      icon: <BarChart3 size={20} />,
      label: 'Statistics',
      path: '/statistics',
      roles: ['admin'] as const,
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      path: '/settings',
      roles: ['admin'] as const,
    },
  ];

  const SidebarContent = () => (
    <div className="h-full py-6 flex flex-col">
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold">Restaurant Manager</h2>
      </div>
      
      <div className="flex-1 px-4">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            currentPath={currentPath}
            onClick={onNavigate}
            roles={item.roles}
          />
        ))}
      </div>
      
      {user && (
        <div className="mt-auto px-4">
          <Separator className="my-4" />
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback>
                {user.name?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={() => logout()}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </Button>
        </div>
      )}
    </div>
  );

  // Mobile responsive sidebar using Sheet component
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col h-full w-64 border-r bg-background">
        <SidebarContent />
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <MenuIcon size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}