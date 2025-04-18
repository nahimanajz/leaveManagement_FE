
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { CSVLink } from "react-csv";
import { FileDown, FileText, Filter } from "lucide-react";
import { leaveRequests, employees, departments, leaveTypes } from "@/data/mockData";
import { ReportType } from "@/types/leaveTypes";
import { formatDate, generateLeaveReportCSV } from "@/utils/leaveUtils";

const LeaveReports = () => {
  const [reportType, setReportType] = useState<ReportType>("employee-summary");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Filter leave requests based on selected filters
  const filteredRequests = leaveRequests.filter(request => {
    const employee = employees.find(emp => emp.id === request.employeeId);
    
    if (!employee) return false;
    
    if (departmentFilter !== "all" && employee.department !== departmentFilter) return false;
    
    if (leaveTypeFilter !== "all" && request.leaveTypeId !== leaveTypeFilter) return false;
    
    if (statusFilter !== "all" && request.status !== statusFilter) return false;
    
    return true;
  });
  
  // Generate CSV data for export
  const csvData = generateLeaveReportCSV(filteredRequests, employees, leaveTypes);
  
  // Generate data for charts based on report type
  const generateChartData = () => {
    switch (reportType) {
      case 'employee-summary':
        // Group by employee
        const employeeData: any[] = [];
        const employeeMap = new Map<string, number>();
        
        filteredRequests.forEach(request => {
          if (request.status === 'approved') {
            const employeeId = request.employeeId;
            const currentTotal = employeeMap.get(employeeId) || 0;
            employeeMap.set(employeeId, currentTotal + request.totalDays);
          }
        });
        
        employeeMap.forEach((totalDays, employeeId) => {
          const employee = employees.find(emp => emp.id === employeeId);
          if (employee) {
            employeeData.push({
              name: employee.name,
              days: totalDays
            });
          }
        });
        
        return employeeData.sort((a, b) => b.days - a.days).slice(0, 10);
        
      case 'department-summary':
        // Group by department
        const departmentData: any[] = [];
        const departmentMap = new Map<string, number>();
        
        filteredRequests.forEach(request => {
          if (request.status === 'approved') {
            const employee = employees.find(emp => emp.id === request.employeeId);
            if (employee) {
              const deptId = employee.department;
              const currentTotal = departmentMap.get(deptId) || 0;
              departmentMap.set(deptId, currentTotal + request.totalDays);
            }
          }
        });
        
        departmentMap.forEach((totalDays, deptId) => {
          const department = departments.find(dept => dept.id === deptId);
          if (department) {
            departmentData.push({
              name: department.name,
              days: totalDays
            });
          }
        });
        
        return departmentData;
        
      case 'leave-type-summary':
        // Group by leave type
        const leaveTypeData: any[] = [];
        const leaveTypeMap = new Map<string, number>();
        
        filteredRequests.forEach(request => {
          if (request.status === 'approved') {
            const typeId = request.leaveTypeId;
            const currentTotal = leaveTypeMap.get(typeId) || 0;
            leaveTypeMap.set(typeId, currentTotal + request.totalDays);
          }
        });
        
        leaveTypeMap.forEach((totalDays, typeId) => {
          const leaveType = leaveTypes.find(lt => lt.id === typeId);
          if (leaveType) {
            leaveTypeData.push({
              name: leaveType.name,
              value: totalDays,
              color: leaveType.color
            });
          }
        });
        
        return leaveTypeData;
        
      case 'leave-balance-summary':
        // Group leave balances by type
        const balanceData: any[] = [];
        
        leaveTypes.forEach(leaveType => {
          const totalBalance = employees.reduce((sum, emp) => {
            return sum + (emp.leaveBalances[leaveType.id] || 0);
          }, 0);
          
          balanceData.push({
            name: leaveType.name,
            balance: totalBalance,
            color: leaveType.color
          });
        });
        
        return balanceData;
        
      default:
        return [];
    }
  };
  
  const chartData = generateChartData();
  
  const renderChart = () => {
    if (reportType === 'leave-type-summary') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 100
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70}
          />
          <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey={reportType === 'leave-balance-summary' ? 'balance' : 'days'} 
            name={reportType === 'leave-balance-summary' ? 'Leave Balance' : 'Leave Days'} 
            fill="#8B5CF6" 
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leave Reports</h2>
        
        <div className="flex gap-2">
          <CSVLink 
            data={csvData} 
            filename={`leave-report-${new Date().toISOString().split('T')[0]}.csv`}
            className="inline-flex"
          >
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CSVLink>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
          <CardDescription>Configure your report view and filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select 
                value={reportType} 
                onValueChange={(value) => setReportType(value as ReportType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee-summary">By Employee</SelectItem>
                  <SelectItem value="department-summary">By Department</SelectItem>
                  <SelectItem value="leave-type-summary">By Leave Type</SelectItem>
                  <SelectItem value="leave-balance-summary">Leave Balances</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={departmentFilter} 
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Leave Type</label>
              <Select 
                value={leaveTypeFilter} 
                onValueChange={setLeaveTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {leaveTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === 'employee-summary' && 'Leave Usage by Employee'}
            {reportType === 'department-summary' && 'Leave Usage by Department'}
            {reportType === 'leave-type-summary' && 'Leave Usage by Type'}
            {reportType === 'leave-balance-summary' && 'Leave Balances by Type'}
          </CardTitle>
          <CardDescription>
            {reportType === 'employee-summary' && 'Total approved leave days taken by each employee'}
            {reportType === 'department-summary' && 'Total approved leave days taken by department'}
            {reportType === 'leave-type-summary' && 'Distribution of leave days by leave type'}
            {reportType === 'leave-balance-summary' && 'Remaining leave balances by type across all employees'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartData.length > 0 ? (
              renderChart()
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available for the selected filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Leave Records</CardTitle>
          <CardDescription>
            Detailed leave records based on the selected filters
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
                  <th className="text-left py-3 px-2">From</th>
                  <th className="text-left py-3 px-2">To</th>
                  <th className="text-left py-3 px-2">Days</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map(request => {
                    const employee = employees.find(emp => emp.id === request.employeeId);
                    const department = departments.find(dept => dept.id === employee?.department);
                    const leaveType = leaveTypes.find(lt => lt.id === request.leaveTypeId);
                    
                    return (
                      <tr key={request.id} className="border-b">
                        <td className="py-3 px-2">{employee?.name || 'Unknown'}</td>
                        <td className="py-3 px-2">{department?.name || 'Unknown'}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2" 
                              style={{ backgroundColor: leaveType?.color || '#ccc' }}
                            />
                            {leaveType?.name || 'Unknown'}
                          </div>
                        </td>
                        <td className="py-3 px-2">{formatDate(request.startDate)}</td>
                        <td className="py-3 px-2">{formatDate(request.endDate)}</td>
                        <td className="py-3 px-2">{request.totalDays}</td>
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
                  })
                ) : (
                  <tr>
                    <td className="py-4 px-2 text-center text-muted-foreground" colSpan={7}>
                      No leave records match the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveReports;
