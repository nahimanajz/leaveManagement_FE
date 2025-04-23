
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, CalendarCheck, Clock, UserPlus } from "lucide-react";
import { leaveRequests, employees, leaveTypes, departments } from "@/data/mockData";


const AdminDashboard = () => {
  // Quick stats
  const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const employeeCount = employees.length;
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved').length;
  
  // Leave usage by type
  const leaveUsageByType = leaveTypes.map(type => {
    const totalUsed = leaveRequests
      .filter(req => req.leaveTypeId === type.id && req.status === 'approved')
      .reduce((sum, req) => sum + req.totalDays, 0);
      
    return {
      name: type.name,
      value: totalUsed,
      color: type.color
    };
  });
  
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
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Leave Usage by Type</CardTitle>
            <CardDescription>
              Distribution of approved leave days by type
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveUsageByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {leaveUsageByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Department Leave Distribution</CardTitle>
            <CardDescription>
              Total approved leave days per department
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentLeaveData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="leave" name="Leave Days" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
          <CardDescription>
            Latest leave requests across all departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Employee</th>
                  <th className="text-left py-3 px-2">Department</th>
                  <th className="text-left py-3 px-2">Leave Type</th>
                  <th className="text-left py-3 px-2">Duration</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests
                  .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
                  .slice(0, 5)
                  .map((request) => {
                    const employee = employees.find(e => e.id === request.employeeId);
                    const department = departments.find(d => d.id === employee?.department);
                    const leaveType = leaveTypes.find(lt => lt.id === request.leaveTypeId);
                    
                    return (
                      <tr key={request.id} className="border-b">
                        <td className="py-3 px-2">{employee?.name || 'Unknown'}</td>
                        <td className="py-3 px-2">{department?.name || 'Unknown'}</td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center">
                            <span 
                              className="w-2 h-2 rounded-full mr-2" 
                              style={{ backgroundColor: leaveType?.color || '#ccc' }}
                            />
                            {leaveType?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-3 px-2">{request.totalDays} days</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : request.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
