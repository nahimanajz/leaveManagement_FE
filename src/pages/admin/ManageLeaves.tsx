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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserSession } from '@/utils';
import { getAllLeaves, updateLeave } from '@/services/leave';
import { toast } from 'sonner';
import { LeaveResponse, UpdateLeaveRequest } from '@/types';

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
  const [selectedRequest, setSelectedRequest] = useState<LeaveResponse | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);


  const queryClient = useQueryClient();
  const user  = getUserSession(); 
  const approverId = user?.id;
  console.log(approverId)

  const { data: leaveRequests = [], isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: getAllLeaves,
  });

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

  const updateLeaveMutation = useMutation({
    mutationFn: (data:UpdateLeaveRequest) =>
      updateLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["leaves"]}); // Invalidate queries to refresh data
    },
    onError: (error:any) => {
      const errMessage = error.response.data.message || "Failed to update leave status. Please try again."
      toast.error(errMessage, {position: 'top-center'});
    },
  });
 

  const handleApprove = (leave: LeaveResponse) => {
    setSelectedRequest(leave);
  };

  const handleReject = (leave: LeaveResponse) => {
    setSelectedRequest(leave);
    setIsApproving(false);
  };

  if (isLoading) {
    return <p>Loading leave applications...</p>;
  }

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
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>

                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request:LeaveResponse) => (
                <TableRow key={request.id}>
                  <TableCell>{request.user.name}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.leaveReason}</TableCell>
                  <TableCell>{request.user.position}</TableCell>
                  <TableCell>{request.user.department}</TableCell>
                  <TableCell>{getStatusBadge(request.approvalStatus.toLocaleLowerCase())}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {request.approvalStatus.toLocaleLowerCase() === 'pending' && (
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
                                  <p className="font-medium">Employee: {request.user.name}</p>
                                  <p className="text-sm text-gray-500">Leave Type: {request.type}</p>
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
                                  <Button onClick={()=> {
                                    
                                    const payload:UpdateLeaveRequest = {                                
                                      id: request.id as unknown as number,
                                      approverId,
                                      status: "APPROVED",
                                      approverComment: comment
                                    };
                                    
                                    updateLeaveMutation.mutate(payload);
                                      
                                  }}>
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
                                  <p className="font-medium">Employee: {request.user.name}</p>
                                  <p className="text-sm text-gray-500">Leave Type: {request.type}</p>
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
                                    onClick={() => {
                                      const payload: UpdateLeaveRequest = {
                                        id: request.id as unknown as number,
                                        approverId,
                                        status: "REJECTED",
                                        approverComment: comment,
                                      };
                          
                                      updateLeaveMutation.mutate(payload);
                                      setComment(""); // Clear the comment field
                                      setSelectedRequest(null); // Reset the selected request
                                    }}
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