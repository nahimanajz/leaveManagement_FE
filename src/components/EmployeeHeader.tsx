import { Bell, Search, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserSession, signOut } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/services/notifications";
import { toast } from "sonner";

const EmployeeHeader = () => {
  const user = getUserSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user.id],
    queryFn: () => getNotifications(user.id),
  });


  if (!user) {
    // Redirect to login if no user session
    return <Navigate to="/" replace />;
  }
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-white">
      <div className="flex-1 flex items-center">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">
          Employee Portal
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 w-full" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
            navigate("/employee/notifications"); // Redirect to notifications page
          }}
        >
          <Bell className="h-5 w-5" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>

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

export default EmployeeHeader;
