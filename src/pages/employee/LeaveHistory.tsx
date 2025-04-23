import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getUserSession } from '@/utils';
import { getLeavesByUserId } from '@/services/leave';
import { useQuery } from '@tanstack/react-query';
import { LeaveResponse } from '@/types';


const LeaveHistory: React.FC = () => {
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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

  const user  = getUserSession(); // Get the signed-in user's session
  const userId = user?.id;

  const { data: leaveApplications = [], isLoading } = useQuery({
    queryKey: ["leaves", userId],
    queryFn: () => getLeavesByUserId(userId),
    enabled: !!userId, // Only fetch if userId is available
  });

  if (isLoading) {
    return <p>Loading leave history...</p>;
  }
 
 console.log(leaveApplications)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leave History</h1>
        <p className="text-gray-500">View your past and current leave applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Document Name</TableHead>
                <TableHead>Document path</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Approver Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveApplications.map((application: LeaveResponse) => (
                <TableRow key={application.createdAt}>
                  <TableCell>{application.type}</TableCell>
                  <TableCell>{new Date(application.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(application.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                  <TableCell>{getStatusBadge(application.approvalStatus)}</TableCell>
                  </TableCell>
                  <TableCell>{application.leaveReason}</TableCell>
                  <TableCell>{application.isFullDay? "Full Day":"Half day"}</TableCell>
                  <TableCell>{application.documentName}</TableCell>
                  <TableCell>{application.documentUrl}</TableCell>                  
                  <TableCell>{application.user.name}</TableCell>
                  <TableCell>{application.approver?.name || "N/A"}</TableCell>
                  <TableCell>{application.approverComment || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Statistics</CardTitle>
          </CardHeader>
          <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Applications</span>
          <span className="font-medium">{leaveApplications.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Approved</span>
          <span className="font-medium">
            {leaveApplications.filter((application) => application.approvalStatus === "APPROVED").length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Pending</span>
          <span className="font-medium">
            {leaveApplications.filter((application) => application.approvalStatus === "PENDING").length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Rejected</span>
          <span className="font-medium">
            {leaveApplications.filter((application) => application.approvalStatus === "REJECTED").length}
          </span>
        </div>
      </div>
    </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaveHistory; 