import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaveRequest } from "@/types/leaveTypes";
import { LeaveResponse } from "@/types";
import CalendarDay from "@/components/leave/CalendarDay";
import LeaveLegend from "@/components/leave/LeaveLegend";
import UpcomingLeaveTable from "@/components/leave/UpcomingLeaveTable";
import { useQuery } from "@tanstack/react-query";
import { getAllLeaves } from "@/services/leave";
import { getAllUsers } from "@/services/user";
import { fetchTeams } from "@/services/departments";
import { isDateInRange } from "@/utils/leaveUtility";


const LeaveCalendar = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  
  // Fetch leave requests using React Query
  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves"],
    queryFn: getAllLeaves,
  });
  
  // Fetch employees data
  const { data: employees = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  
  // Fetch departments data
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchTeams,
  });
  
  const filteredRequests = selectedDepartment === "all"
    ? leaves
    : leaves.filter(request => {
        const employee = employees.find(emp => emp.id === request.user.id);
        return employee?.department.toLowerCase() === departments.find(d => d.id === selectedDepartment)?.name.toLowerCase();
      });

  const getRequestsForDay = (day: Date) => {
    return filteredRequests.filter(request => {
      return isDateInRange(day, request.startDate, request.endDate);
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
              Day: (props) => {
                const dayRequests = getRequestsForDay(props.date);
                return dayRequests.length > 0 ? (
                  <CalendarDay
                    {...props}
                    leaveRequests={dayRequests}
                  />
                ) : (
                  
                  <div className="h-9 w-9 p-0 font-normal">{props.date.getDate()}</div>
                );
              }
            }}
          />
          <LeaveLegend />
          <UpcomingLeaveTable filteredRequests={filteredRequests} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveCalendar