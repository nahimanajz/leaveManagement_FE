
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, Filter, Upload } from "lucide-react";
import { employees as initialEmployees, departments, leaveTypes } from "@/data/mockData";
import { Employee } from "@/types/leaveTypes";
import { calculateLeaveUsage, formatDate } from "@/utils/leaveUtils";
import UserForm from "@/components/users/UserForm";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  
  const filteredEmployees = employees.filter(employee => {
    // Apply search filter
    if (
      searchQuery && 
      !employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Apply department filter
    if (departmentFilter !== "all" && employee.department !== departmentFilter) {
      return false;
    }
    
    return true;
  });
  
  const handleOpenDialog = (employee?: Employee) => {
    setIsDialogOpen(true);  
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };
  
  const handleChange = (key: keyof Employee, value: any) => {
    if (!currentEmployee) return;
    
    setCurrentEmployee({
      ...currentEmployee,
      [key]: value
    });
  };
  
  const handleLeaveBalanceChange = (leaveTypeId: string, value: number) => {
    if (!currentEmployee) return;
    
    setCurrentEmployee({
      ...currentEmployee,
      leaveBalances: {
        ...currentEmployee.leaveBalances,
        [leaveTypeId]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manage Employees</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter the employee list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select 
                value={departmentFilter} 
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
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
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            View and manage employee information and leave balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Leave Balances</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => {
                    const department = departments.find(d => d.id === employee.department);
                    
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{department?.name || 'Unknown'}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{formatDate(employee.startDate)}</TableCell>
                        <TableCell className="max-w-[260px]">
                          <div className="space-y-1 text-sm">
                            {leaveTypes
                              .filter(lt => lt.isActive)
                              .map(leaveType => {
                                const usagePercent = calculateLeaveUsage(
                                  employee, 
                                  leaveType.id, 
                                  leaveTypes, 
                                  []
                                );
                                
                                return (
                                  <div key={leaveType.id} className="space-y-0.5">
                                    <div className="flex justify-between">
                                      <span>{leaveType.name}</span>
                                      <span className="font-medium">
                                        {employee.leaveBalances[leaveType.id] || 0} days
                                      </span>
                                    </div>
                                    <Progress 
                                      value={usagePercent} 
                                      className="h-1.5"
                                      style={{ 
                                        backgroundColor: `${leaveType.color}40`,
                                        "--progress-color": leaveType.color
                                      } as any}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No employees found matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <UserForm isDialogOpen={isDialogOpen} 
        setIsDialogOpen={setIsDialogOpen}
        currentEmployee={currentEmployee}
        handleLeaveBalanceChange={handleLeaveBalanceChange} 
      />
    </div>  
  );
};

export default ManageEmployees;
