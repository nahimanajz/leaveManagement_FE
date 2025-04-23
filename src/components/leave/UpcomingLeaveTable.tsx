
import { LeaveRequest } from "@/types/leaveTypes";
import { employees, departments, leaveTypes } from "@/data/mockData";
import { formatDate } from "@/utils/leaveUtils";

interface UpcomingLeaveTableProps {
  filteredRequests: LeaveRequest[];
}

const UpcomingLeaveTable = ({ filteredRequests }: UpcomingLeaveTableProps) => {
  return (
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
  );
};

export default UpcomingLeaveTable;
