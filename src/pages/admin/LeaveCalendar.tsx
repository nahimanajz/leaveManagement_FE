
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { employees, leaveRequests, departments } from "@/data/mockData";
import { LeaveRequest } from "@/types/leaveTypes";
import CalendarDay from "@/components/leave/CalendarDay";
import LeaveLegend from "@/components/leave/LeaveLegend";
import UpcomingLeaveTable from "@/components/leave/UpcomingLeaveTable";

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
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        if (!result[dateKey]) {
          result[dateKey] = [];
        }
        result[dateKey].push(request);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return result;
  };
  
  const datesWithLeave = getDatesWithLeaveInfo();

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
              components={{
                day: ({ date }) => {
                  const dateKey = date.toISOString().split('T')[0];
                  const dayLeaveRequests = datesWithLeave[dateKey] || [];
                  return <CalendarDay day={date} leaveRequests={dayLeaveRequests} />;
                }
              }}
            />
          </div>
          
          <LeaveLegend />
          <UpcomingLeaveTable filteredRequests={filteredRequests} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveCalendar;
