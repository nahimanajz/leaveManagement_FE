import { Bell, Search, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, Navigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserSession, signOut } from "@/utils";
import { getAllNotifications } from "@/services/notifications";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const user = getUserSession();
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user.id],
    queryFn: () => getAllNotifications(),
    refetchInterval: 10000,
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }
  const hasNewNotification = notifications.some((n) =>
    n.message.toLowerCase().includes("created")
  );

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-white">
      <div className="flex-1 flex items-center">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">
          Leave Management
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 w-full" />
        </div>

        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {hasNewNotification && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
      )}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-80 max-h-60 overflow-auto">
    {notifications.length === 0 ? (
      <DropdownMenuItem>No notifications</DropdownMenuItem>
    ) : (
      notifications.map((n) => (
        <DropdownMenuItem key={n.id} className={n.isRead ? "" : "font-semibold"}>
          {n.message}
        </DropdownMenuItem>
      ))
    )}
  </DropdownMenuContent>
</DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium">{user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
