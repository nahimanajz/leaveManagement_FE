
export type LeaveType = {
  id: string;
  name: string;
  description: string;
  color: string;
  defaultDays: number;
  isActive: boolean;
  carryForwardPercentage: number;
  accrualRate: 'monthly' | 'yearly' | 'quarterly';
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  startDate: string;
  leaveBalances: {
    [leaveTypeId: string]: number;
  };
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedBy?: string;
  notes?: string;
  totalDays: number;
};

export type Department = {
  id: string;
  name: string;
  managerId: string;
};

export type ReportType = 
  | 'employee-summary' 
  | 'department-summary' 
  | 'leave-type-summary'
  | 'leave-balance-summary';
