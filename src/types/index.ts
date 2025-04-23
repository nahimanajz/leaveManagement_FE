export interface LeaveResponse {
  id: string;
  type: string;
  leaveReason: string;
  isFullDay: boolean;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  documentName?: string;
  documentUrl?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: {
    id: string;
    name: string;
    email: string;
    microsoftId: string;
    position: string;
    department: string;
    leaveBalances: {
      [key: string]: number;
    };
  };
  approver?: {
    id: string;
    name: string;
    email: string;
    microsoftId: string;
  };
  approverComment?: string;
}

export interface UpdateLeaveRequest {
  id: number;
  approverId: number;
  approverComment?: string;
  status: string;
}

export interface AdmindminOrManagerSignup {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

enum UserRole {
  ADMIN,
  MANAGER,
}

export type LeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reason?: string;
};

export type ReportType = {
  name: string;
  value: number;
};

export interface UserBalance {
  userId: number;
  data: { leaveTypeId: number; leaveBalance: number };
}
