
import React from "react";
import { LeaveResponse } from "@/types";
import { LeaveRequest } from "@/types/leaveTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllLeaveTypes } from "@/services/leavetypes";
import { getAllUsers } from "@/services/user";
import { getLeaveTypeColor } from "@/utils/leaveUtility";

type CalendarDayProps = {
  date: Date;
  leaveRequests: LeaveRequest[] | LeaveResponse[];
  disabled?: boolean;
  outside?: boolean;
  selected?: boolean;
};

const CalendarDay = ({ 
  date, 
  leaveRequests, 
  disabled = false, 
  outside = false,
  selected = false
}: CalendarDayProps) => {
  const day = date.getDate();
  
  // Fetch leave types for colors
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getAllLeaveTypes,
  });

  // Fetch employees to get names
  const { data: employees = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // If we have more than 3 leaves, we'll show +X more
  const maxDisplayed = 3;
  const hasMoreLeaves = leaveRequests.length > maxDisplayed;
  const displayedLeaves = hasMoreLeaves 
    ? leaveRequests.slice(0, maxDisplayed) 
    : leaveRequests;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "h-9 w-9 p-0 font-normal relative",
              disabled && "text-muted-foreground opacity-50",
              outside && "text-muted-foreground opacity-30",
              selected && "bg-primary text-primary-foreground rounded-md"
            )}
          >
            <span className="absolute top-1 right-1">{day}</span>
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-0.5 px-0.5">
              {displayedLeaves.map((request, index) => {
                // Get type from the request based on its structure
                let leaveType;
                let employeeId;
                
                if ('type' in request) {
                  leaveType = request.type;
                  employeeId = 'employeeId' in request ? request.employeeId : request.user?.id;
                }
                
                const color = getLeaveTypeColor(leaveType || '', leaveTypes);
                
                return (
                  <div
                    key={index}
                    className="h-1 w-full rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                );
              })}
              {hasMoreLeaves && (
                <div className="text-[10px] text-center text-muted-foreground">
                  +{leaveRequests.length - maxDisplayed}
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-48">
          <div className="text-sm font-medium mb-1">
            {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
          </div>
          {leaveRequests.length > 0 ? (
            <ul className="space-y-1">
              {leaveRequests.map((request, index) => {
                // Handle different formats
                const leaveType = 'type' in request ? request.type : '';
                const employeeId = 'employeeId' in request 
                  ? request.employeeId 
                  : 'user' in request ? request.user.id : '';
                
                const employee = employees.find(emp => emp.id === employeeId);
                const color = getLeaveTypeColor(leaveType, leaveTypes);
                
                return (
                  <li key={index} className="text-xs flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span>{employee?.name || 'Unknown'}: </span>
                    <span className="font-medium">{leaveType}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-xs text-muted-foreground">No leaves scheduled</div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;