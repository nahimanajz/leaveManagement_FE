
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
  requests: LeaveRequest[],
  employees: Employee[],
  leaveTypes: LeaveType[]
): Array<any> {
  return requests.map(request => {
    const employee = employees.find(emp => emp.id === request.employeeId);
    const leaveType = leaveTypes.find(lt => lt.id === request.leaveTypeId);
    
    return {
      "Employee Name": employee?.name || "Unknown",
      "Department": employee?.department || "Unknown",
      "Leave Type": leaveType?.name || "Unknown",
      "Start Date": formatDate(request.startDate),
      "End Date": formatDate(request.endDate),
      "Total Days": request.totalDays,
      "Status": request.status.charAt(0).toUpperCase() + request.status.slice(1),
      "Request Date": formatDate(request.requestDate)
    };
  });
}
