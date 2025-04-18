
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { departments, leaveRequests as mockLeaveRequests, employees } from "@/data/mockData";
import { LeaveRequest } from "@/types/leaveTypes";
import CalendarDay from "@/components/leave/CalendarDay";
import LeaveLegend from "@/components/leave/LeaveLegend";
import UpcomingLeaveTable from "@/components/leave/UpcomingLeaveTable";

const LeaveCalendar = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [leaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  
  const filteredRequests = selectedDepartment === "all"
    ? leaveRequests
    : leaveRequests.filter(request => {
        const employee = employees.find(emp => emp.id === request.employeeId);
        return employee?.department === selectedDepartment;
      });

  const getRequestsForDay = (day: Date) => {
    return filteredRequests.filter(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return day >= start && day <= end;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leave Calendar</h2>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[180px]">
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
          <CardTitle>Team Leave Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="multiple"
            components={{
              Day: (props) => (
                <CalendarDay
                  {...props}
                  leaveRequests={getRequestsForDay(props.day)}
                />
              )
            }}
          />
          <LeaveLegend />
          <UpcomingLeaveTable filteredRequests={filteredRequests} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveCalendar;
