import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaveRequest } from "@/types/leaveTypes";
import { LeaveResponse } from "@/types";
import { getAllUsers } from "@/services/user";
import { getAllLeaveTypes } from "@/services/leavetypes";
import { formatDate, getLeaveDuration } from "@/utils/leaveUtils";

interface UpcomingLeaveTableProps {
  filteredRequests: LeaveRequest[] | LeaveResponse[];
}

const UpcomingLeaveTable = ({ filteredRequests }: UpcomingLeaveTableProps) => {
  // Fetch employees to get employee details
  const { data: employees = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Fetch leave types to get leave type details
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getAllLeaveTypes,
  });

  // Sort upcoming leaves by start date
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Filter for only upcoming and current leaves (not past)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingLeaves = sortedRequests.filter(leave => {
    const endDate = new Date(leave.endDate);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Upcoming Leaves</h3>
      
      {upcomingLeaves.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Employee</th>
                <th className="text-left py-3 px-2">Leave Type</th>
                <th className="text-left py-3 px-2">From</th>
                <th className="text-left py-3 px-2">To</th>
                <th className="text-left py-3 px-2">Duration</th>
                <th className="text-left py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingLeaves.map((leave) => {
                // Handle different object structures
                const leaveType = 'type' in leave ? leave.type : '';
                const status = 'status' in leave ? leave.status : 
                               'approvalStatus' in leave ? leave.approvalStatus : 'unknown';
                
                const employeeId = 'employeeId' in leave 
                  ? leave.employeeId 
                  : 'user' in leave ? leave.user.id : '';
                
                const employee = employees.find((emp) => emp.id === employeeId);
                
                const leaveTypeObj = leaveTypes.find(
                  type => type.id === leaveType || type.name.toLowerCase() === leaveType.toLowerCase()
                );
                
                return (
                  <tr key={leave.id} className="border-b">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={employee?.avatarUrl} />
                          <AvatarFallback>
                            {employee?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{employee?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: leaveTypeObj?.color || "#9E9E9E" }}
                        ></div>
                        <span>{leaveTypeObj?.name || leaveType}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">{formatDate(leave.startDate)}</td>
                    <td className="py-3 px-2">{formatDate(leave.endDate)}</td>
                    <td className="py-3 px-2">{getLeaveDuration(leave.startDate,leave.endDate)} days</td>

                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          status.toLowerCase() === "approved"
                            ? "bg-green-100 text-green-800"
                            : status.toLowerCase() === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming leaves found
        </div>
      )}
    </div>
  );
};

export default UpcomingLeaveTable;