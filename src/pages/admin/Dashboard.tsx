
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, CalendarCheck, Clock, UserPlus } from "lucide-react";
import { leaveRequests, employees, leaveTypes, departments } from "@/data/mockData";
import { Link } from "react-router-dom";


const AdminDashboard = () => {
  // Quick stats
  const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const employeeCount = employees.length;
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved').length;
  
  
  
  // Department leave distribution
  const departmentLeaveData = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept.id);
    const deptEmployeeIds = deptEmployees.map(emp => emp.id);
    
    const approvedLeave = leaveRequests
      .filter(req => 
        deptEmployeeIds.includes(req.employeeId) && 
        req.status === 'approved'
      )
      .reduce((sum, req) => sum + req.totalDays, 0);
    
    return {
      name: dept.name,
      leave: approvedLeave
    };
  });


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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Leave Days</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(leaveRequests.reduce((sum, req) => sum + req.totalDays, 0) / leaveRequests.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              +0.5 days from last quarter
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
