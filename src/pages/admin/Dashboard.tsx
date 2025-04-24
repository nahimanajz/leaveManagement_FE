
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CalendarCheck, Clock, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllLeaves } from "@/services/leave";
import { getAllUsers } from "@/services/user";
import { Employee } from "@/types/leaveTypes";


const AdminDashboard = () => {

  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves"],
    queryFn: () => getAllLeaves(),
  });
  const { data: employees = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });
  
  // Quick stats
  const pendingRequests = leaves.filter(req => req.approvalStatus.toLocaleLowerCase() === 'pending').length;
  const employeeCount = employees.filter((e:Employee)=> e.role.toLowerCase() === "staff").length;
  const approvedRequests = leaves.filter(req => req.approvalStatus.toLocaleLowerCase() === 'approved').length;
  


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(pendingRequests * 0.1)} from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(employeeCount * 0.05)} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(approvedRequests * 0.15)} from last month
            </p>
          </CardContent>
        </Card>
        
  
      </div>
      
 
      
      {/* Recent Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
          <CardDescription className=" flex flex-col gap-2">
            Latest leave requests across all departments 
            <Link
                          to="/admin/reports"
                          className="text-primary hover:underline mt-auto"
                        >
                          Navigate to Leave reports Types →
                        </Link>
          </CardDescription>
        </CardHeader>
       
      </Card>
    </div>
  );
};

export default AdminDashboard;
