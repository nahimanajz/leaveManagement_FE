import { Department } from './../types/leaveTypes';
import { format } from "date-fns";
import { LeaveResponse } from "@/types";
import { Employee, LeaveType } from "@/types/leaveTypes";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
};

export const getDaysBetweenDates = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  return diffDays;
};

export const generateLeaveReportCSV = (
  leaves: LeaveResponse[],
  employees: Employee[],
  leaveTypes: LeaveType[],
  departments: Department[]
) => {
  const headers = [
    "Employee",
    "Department",
    "Leave Type",
    "From",
    "To",
    "Days",
    "Status",
    "Remaining Balance"
  ];

  const rows = leaves.map((leave) => {
    const employee = employees.find((emp) => emp.id === leave.user.id);
    const department = departments.find(
      (dept) => dept.name.toLowerCase() === employee?.department.toLowerCase()
    );
    const leaveType = leaveTypes.find(
      (type) => type.name.toLowerCase() === leave.type.toLowerCase() || type.id === leave.type
    );
    
    const days = getDaysBetweenDates(leave.startDate, leave.endDate);
    
    return [
      employee?.name || "Unknown",
      department?.name || "Unknown",
      leaveType?.name || "Unknown",
      formatDate(leave.startDate),
      formatDate(leave.endDate),
      days.toString(),
      leave.approvalStatus,
      (leave.user.leaveBalances?.[leave.type] || 0).toString()
    ];
  });

  return [headers, ...rows];
};

// Function to get color for leave type
export const getLeaveTypeColor = (leaveType: string, leaveTypes: LeaveType[]) => {
  const type = leaveTypes.find(
    (type) => type.name.toLowerCase() === leaveType.toLowerCase() || type.id === leaveType
  );
  
  return type?.color || "#9E9E9E"; // Default gray if no color found
};

// Helper function to check if a date falls within a date range
export const isDateInRange = (date: Date, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time parts to compare only dates
  date.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  return date >= start && date <= end;
};