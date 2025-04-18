import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Check, X, Mail, Bell } from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeEmail: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  duration: "full-day" | "half-day";
  status: "pending" | "approved" | "rejected";
  reason: string;
  documentUrl?: string;
}

const LeaveRequests: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState<string>("");
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "John Doe",
      employeeEmail: "john@example.com",
      leaveType: "Personal Time Off",
      startDate: new Date(2024, 3, 1),
      endDate: new Date(2024, 3, 3),
      duration: "full-day",
      status: "pending",
      reason: "Annual vacation",
      documentUrl: "/documents/leave1.pdf"
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      employeeEmail: "jane@example.com",
      leaveType: "Sick Leave",
      startDate: new Date(2024, 3, 5),
      endDate: new Date(2024, 3, 5),
      duration: "half-day",
      status: "pending",
      reason: "Medical appointment"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const handleApprove = (request: LeaveRequest) => {
    setSelectedRequest(request);
    // Here you would typically:
    // 1. Update the request status in your backend
    // 2. Send email notification to the employee
    // 3. Send in-app notification
    console.log("Approving request:", request.id);
    console.log("Comment:", comment);
  };

  const handleReject = (request: LeaveRequest) => {
    setSelectedRequest(request);
    // Here you would typically:
    // 1. Update the request status in your backend
    // 2. Send email notification to the employee
    // 3. Send in-app notification
    console.log("Rejecting request:", request.id);
    console.log("Comment:", comment);
  };

  const sendNotification = (request: LeaveRequest, action: "approve" | "reject") => {
    // Here you would implement the notification logic
    console.log(`Sending ${action} notification to ${request.employeeEmail}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leave Requests</h1>
        <p className="text-gray-500">Review and manage employee leave requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.employeeName}</p>
                      <p className="text-sm text-gray-500">{request.employeeEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>{request.duration}</TableCell>
                  <TableCell>
                    {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Leave Request</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="font-medium">Employee: {request.employeeName}</p>
                                <p className="text-sm text-gray-500">Leave Type: {request.leaveType}</p>
                                <p className="text-sm text-gray-500">
                                  Dates: {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comment">Comment (Optional)</Label>
                                <Textarea
                                  id="comment"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="Add a comment for the employee"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setComment("");
                                    setSelectedRequest(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleApprove(request);
                                    sendNotification(request, "approve");
                                  }}
                                >
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Leave Request</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="font-medium">Employee: {request.employeeName}</p>
                                <p className="text-sm text-gray-500">Leave Type: {request.leaveType}</p>
                                <p className="text-sm text-gray-500">
                                  Dates: {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comment">Comment (Required)</Label>
                                <Textarea
                                  id="comment"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="Add a reason for rejection"
                                  required
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setComment("");
                                    setSelectedRequest(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    handleReject(request);
                                    sendNotification(request, "reject");
                                  }}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Send Notification
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequests; 