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
    leaveBalances: number | string; //TODO: remove it because leaves remainder has to be obtained from leave_management entity
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
