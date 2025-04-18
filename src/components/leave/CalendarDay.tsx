
import { LeaveRequest } from "@/types/leaveTypes";
import { employees, leaveTypes } from "@/data/mockData";
import { formatDate } from "@/utils/leaveUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DayComponentProps } from "react-day-picker";

interface CalendarDayProps extends DayComponentProps {
  leaveRequests: LeaveRequest[];
}

const CalendarDay = ({ date, leaveRequests, ...props }: CalendarDayProps) => {
  if (!date || leaveRequests.length === 0) return null;

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
          <div className="relative w-full h-full" {...props}>
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
            <p className="font-semibold">{formatDate(date.toISOString())}</p>
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

export default CalendarDay;
