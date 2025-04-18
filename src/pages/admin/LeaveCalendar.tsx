
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { employees, leaveRequests, leaveTypes, departments } from "@/data/mockData";
import { LeaveRequest } from "@/types/leaveTypes";
import { formatDate } from "@/utils/leaveUtils";

const LeaveCalendar = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Filter leave requests based on department selection
  const filteredRequests = leaveRequests.filter(request => {
    const employee = employees.find(emp => emp.id === request.employeeId);
    
    if (!employee) return false;
    if (selectedDepartment !== "all" && employee.department !== selectedDepartment) return false;
    
    return request.status === 'approved';
  });
  
  // Generate calendar dates with leave information
  const getDatesWithLeaveInfo = () => {
    const result: { [date: string]: LeaveRequest[] } = {};
    
    filteredRequests.forEach(request => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      
      // For each day in the leave period
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        
        if (!result[dateKey]) {
          result[dateKey] = [];
        }
        
        result[dateKey].push(request);
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return result;
  };
  
  const datesWithLeave = getDatesWithLeaveInfo();
  
  // Generate calendar view with leave info
  const renderCalendarDay = (day: Date) => {
    const dateKey = day.toISOString().split('T')[0];
    const leaveRequests = datesWithLeave[dateKey] || [];
    
    if (leaveRequests.length === 0) return null;
    
    // Group requests by leave type
    const leaveTypeCount: { [key: string]: number } = {};
    leaveRequests.forEach(request => {
      if (!leaveTypeCount[request.leaveTypeId]) {
        leaveTypeCount[request.leaveTypeId] = 0;
      }
      leaveTypeCount[request.leaveTypeId]++;
    });
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full h-full">
              <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 justify-center">
                {Object.entries(leaveTypeCount).map(([typeId, count]) => {
                  const leaveType = leaveTypes.find(lt => lt.id === typeId);
                  return (
                    <div
                      key={typeId}
                      className="w-1.5 h-1.5 rounded-full mb-0.5"
                      style={{ backgroundColor: leaveType?.color || '#ccc' }}
                    />
                  );
                })}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">
              <p className="font-semibold">{formatDate(dateKey)}</p>
              <div className="space-y-1">
                {leaveRequests.map(request => {
                  const employee = employees.find(emp => emp.id === request.employeeId);
                  const leaveType = leaveTypes.find(lt => lt.id === request.leaveTypeId);
                  return (
                    <div key={request.id} className="text-sm flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: leaveType?.color || '#ccc' }}
                      />
                      <span>{employee?.name} - {leaveType?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Leave Calendar</h2>
      
      <div className="flex space-x-4">
        <Select 
          value={selectedDepartment} 
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select department" />
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
      
      <Card>
        <CardHeader>
          <CardTitle>Team Leave Calendar</CardTitle>
          <CardDescription>
            View all approved leave requests in a calendar view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <Calendar
              mode="single"
              selected={selectedMonth}
              onSelect={(date) => date && setSelectedMonth(date)}
              className="rounded-md border"
              // Simplified calendar without custom components
              modifiers={{
                hasLeave: (date) => {
                  const dateKey = date.toISOString().split('T')[0];
                  return !!datesWithLeave[dateKey];
                }
              }}
              modifiersClassNames={{
                hasLeave: "bg-secondary/20"
              }}
            />
          </div>
            
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Legend</h3>
            <div className="flex flex-wrap gap-4">
              {leaveTypes.map(type => (
                <div key={type.id} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
            
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Upcoming Leave</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Employee</th>
                    <th className="text-left py-3 px-2">Department</th>
                    <th className="text-left py-3 px-2">Leave Type</th>
                    <th className="text-left py-3 px-2">From</th>
                    <th className="text-left py-3 px-2">To</th>
                    <th className="text-left py-3 px-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests
                    .filter(request => new Date(request.startDate) >= new Date())
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .slice(0, 5)
                    .map(request => {
                      const employee = employees.find(emp => emp.id === request.employeeId);
                      const department = departments.find(dept => dept.id === employee?.department);
                      const leaveType = leaveTypes.find(lt => lt.id === request.leaveTypeId);
                      
                      return (
                        <tr key={request.id} className="border-b">
                          <td className="py-3 px-2">{employee?.name}</td>
                          <td className="py-3 px-2">{department?.name}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-2" 
                                style={{ backgroundColor: leaveType?.color || '#ccc' }}
                              />
                              {leaveType?.name}
                            </div>
                          </td>
                          <td className="py-3 px-2">{formatDate(request.startDate)}</td>
                          <td className="py-3 px-2">{formatDate(request.endDate)}</td>
                          <td className="py-3 px-2">{request.totalDays} days</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveCalendar;
