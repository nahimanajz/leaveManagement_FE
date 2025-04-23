import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Document {
  id: string;
  leaveType: string;
  fileName: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const Documents: React.FC = () => {
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);

  // Mock data - this would come from your API
  const uploadedDocuments: Document[] = [
    {
      id: "1",
      leaveType: "Sick Leave",
      fileName: "medical_certificate.pdf",
      uploadDate: new Date(2024, 2, 15),
      status: "approved"
    },
    {
      id: "2",
      leaveType: "Maternity Leave",
      fileName: "pregnancy_confirmation.pdf",
      uploadDate: new Date(2024, 3, 1),
      status: "pending"
    }
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLeaveType && document) {
      // Here you would call your API to upload the document
      console.log({
        leaveType: selectedLeaveType,
        document
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Documents</h1>
        <p className="text-gray-500">Upload and manage your leave-related documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Select Leave Type</Label>
              <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pto">Personal Time Off</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="compassionate">Compassionate Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Upload Document</Label>
              <Input
                type="file"
                id="document"
                onChange={(e) => setDocument(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-gray-500">
                Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
              </p>
            </div>

            <Button type="submit" className="w-full">
              Upload Document
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.leaveType}</TableCell>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>{doc.uploadDate.toLocaleDateString()}</TableCell>
                  <TableCell>{doc.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents; 