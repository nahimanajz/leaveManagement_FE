
import { LeaveResponse } from "@/types";
import { LeaveRequest, Employee, LeaveType } from "@/types/leaveTypes";

/**
 * Calculate the number of working days between two dates (excluding weekends)
 */
export function calculateWorkingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let workingDays = 0;
  
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workingDays;
}

/**
 * Check if two date ranges overlap
 */
export function dateRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  
  return s1 <= e2 && s2 <= e1;
}

/**
 * Find overlapping leave requests for an employee
 */
export function findOverlappingRequests(
  employeeId: string,
  startDate: string,
  endDate: string,
  requestId: string | null,
  allRequests: LeaveRequest[]
): LeaveRequest[] {
  return allRequests.filter(request => 
    request.employeeId === employeeId && 
    (requestId === null || request.id !== requestId) && 
    (request.status === 'approved' || request.status === 'pending') &&
    dateRangesOverlap(startDate, endDate, request.startDate, request.endDate)
  );
}

/**
 * Format date to display string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}
export const getLeaveDuration = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Get leave requests for a specific department
 */
export function getLeaveRequestsByDepartment(
  departmentId: string,
  employees: Employee[],
  requests: LeaveRequest[]
): LeaveRequest[] {
  const departmentEmployeeIds = employees
    .filter(emp => emp.department === departmentId)
    .map(emp => emp.id);
    
  return requests.filter(req => departmentEmployeeIds.includes(req.employeeId));
}

/**
 * Calculate the usage percentage of a leave type for an employee
 */
export function calculateLeaveUsage(
  employee: Employee,
  leaveTypeId: string,
  leaveTypes: LeaveType[],
  requests: LeaveRequest[]
): number {
  const leaveType = leaveTypes.find(lt => lt.id === leaveTypeId);
  if (!leaveType) return 0;
  
  const totalAllocation = leaveType.defaultDays;
  const remainingBalance = employee.leaveBalances[leaveTypeId] || 0;
  const used = totalAllocation - remainingBalance;
  
  return Math.min(100, Math.round((used / totalAllocation) * 100));
}

/**
 * Get employee name by ID
 */
export function getEmployeeName(employeeId: string, employees: Employee[]): string {
  const employee = employees.find(emp => emp.id === employeeId);
  return employee ? employee.name : 'Unknown Employee';
}

/**
 * Get leave type details by ID
 */
export function getLeaveType(leaveTypeId: string, leaveTypes: LeaveType[]): LeaveType | undefined {
  return leaveTypes.find(lt => lt.id === leaveTypeId);
}

/**
 * Generate CSV data for leave report
 */
export function generateLeaveReportCSV(
  requests: LeaveResponse[],
  employees: Employee[],
  leaveTypes: LeaveType[],
  departments: { id: string; name: string }[]
): Array<any> {
  return requests.map((request) => {
    const employee = employees.find((emp) => emp.id === request.user.id);
    const department = departments.find(
      (dept) => dept.name.toLowerCase() === employee?.department.toLowerCase()
    );
    const leaveType = leaveTypes.find(
      (type) => type.name.toLowerCase() === request.type.toLowerCase()
    );

    return {
      Employee: employee?.name || "Unknown",
      Department: department?.name || "Unknown",
      "Leave Type": leaveType?.name || "Unknown",
      From: formatDate(request.startDate),
      To: formatDate(request.endDate),
      "Remaining Days": request.user.leaveBalances?.[request.type] || 0,
      Status:
        request.approvalStatus.charAt(0).toUpperCase() +
        request.approvalStatus.slice(1),
    };
  });
}