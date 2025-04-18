import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Check, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

const ManageLeaves: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);

  // Sample data - replace with actual data from your backend
  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      leaveType: 'Annual Leave',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      status: 'pending',
      reason: 'Family vacation'
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      leaveType: 'Sick Leave',
      startDate: '2024-04-03',
      endDate: '2024-04-04',
      status: 'approved',
      reason: 'Medical appointment'
    }
  ];

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
    setIsApproving(true);
  };

  const handleReject = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsApproving(false);
  };

  const handleSubmit = () => {
    // Here you would typically:
    // 1. Update the request status in your backend
    // 2. Send email notification to the employee
    // 3. Send in-app notification
    console.log(`Request ${selectedRequest?.id} ${isApproving ? 'approved' : 'rejected'} with comment:`, comment);
    setSelectedRequest(null);
    setComment("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Leaves</h1>
        <p className="text-gray-500">Review and manage employee leave requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.employeeName}</TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleApprove(request)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
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
                                    Dates: {request.startDate} - {request.endDate}
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
                                  <Button onClick={handleSubmit}>
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleReject(request)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
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
                                    Dates: {request.startDate} - {request.endDate}
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
                                    onClick={handleSubmit}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
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

export default ManageLeaves; 