import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CSVLink } from "react-csv";
import { FileDown, } from "lucide-react";
import { Employee } from "@/types/leaveTypes";
import { formatDate, generateLeaveReportCSV } from "@/utils/leaveUtils";
import { getAllUsers } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { getAllLeaves } from "@/services/leave";
import { getAllLeaveTypes } from "@/services/leavetypes";
import { fetchTeams } from "@/services/departments";
import { LeaveResponse } from "@/types";
import { Input } from "@/components/ui/input";

const LeaveReports = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("all");
  const [employeeNameFilter, setEmployeeNameFilter] = useState<string>("");
  const [filteredRequests, setFilteredRequests] = useState<LeaveResponse[]>([]);

  const { data: employees = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves"],
    queryFn: getAllLeaves,
  });
 

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchTeams,
  });
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getAllLeaveTypes,
  });

  useEffect(()=>{
    setFilteredRequests(leaves)
  }, [])
  // Handle filtering logic
  const handleFilter = () => {
    const filtered = leaves.filter((leave) => {
      const employee:Employee= employees.find((emp) => emp.id === leave.user.id);

      // matches department

      const matchesDepartment =
      departmentFilter === "all" ||
      (employee &&
        departments.some(
          (dept) =>
            dept.id === departmentFilter && dept.name.toLowerCase() === employee.department.toLowerCase()
        ));

      // Apply leave type filter
      const matchesLeaveType =
        leaveTypeFilter === "all" || leave.type === leaveTypeFilter;

      // Apply employee name filter
      const matchesEmployeeName =
        employeeNameFilter === "" ||
        (employee &&
          employee.name
            .toLowerCase()
            .includes(employeeNameFilter.toLowerCase()));

      return matchesDepartment && matchesLeaveType && matchesEmployeeName;
    });

    setFilteredRequests(filtered);
  };

  //
  useEffect(() => {
    handleFilter();
  }, [departmentFilter, leaveTypeFilter, employeeNameFilter, leaves, employees]);
  
   // Generate CSV data for export
   const csvData = generateLeaveReportCSV(
    filteredRequests,
    employees,
    leaveTypes,
    departments
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leave Reports</h2>

        <div className="flex gap-2">
          <CSVLink
            data={csvData}
            filename={`leave-report-${
              new Date().toISOString().split("T")[0]
            }.csv`}
            className="inline-flex"
          >
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CSVLink>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Filter leave records by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={departmentFilter}
                onValueChange={(value) => setDepartmentFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Leave Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Leave Type</label>
              <Select
                value={leaveTypeFilter}
                onValueChange={(value) => setLeaveTypeFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leave Types</SelectItem>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Name Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee Name</label>
              <Input
                placeholder="Search by employee name"
                value={employeeNameFilter}
                onChange={(e) => setEmployeeNameFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave Records</CardTitle>
          <CardDescription>
            Detailed leave records based on the selected filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Employee</th>
                  <th className="text-left py-3 px-2">Department</th>
                  <th className="text-left py-3 px-2">Leave Type</th>
                  <th className="text-left py-3 px-2">From</th>
                  <th className="text-left py-3 px-2">To</th>
                  <th className="text-left py-3 px-2">Remaining Days</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => {
                    const employee = employees.find(
                      (emp) => emp.id=== request.user.id
                    );
                    const department = departments.find(
                      (dept) => dept.name.toLowerCase() === employee?.department.toLowerCase()
                    );
                    const leaveType = leaveTypes.find(
                      (type) => type.name.toLowerCase() === request.type.toLowerCase()
                    );

                    return (
                      <tr key={request.id} className="border-b">
                        <td className="py-3 px-2">
                          {employee?.name || "Unknown"}
                        </td>
                        <td className="py-3 px-2">
                          {department?.name || "Unknown"}
                        </td>
                        <td className="py-3 px-2">
                          {leaveType?.name || "Unknown"}
                        </td>
                        <td className="py-3 px-2">
                          {formatDate(request.startDate)}
                        </td>
                        <td className="py-3 px-2">
                          {formatDate(request.endDate)}
                        </td>
                        <td className="py-3 px-2">
                          {request.user.leaveBalances?.[request.type] || 0}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              request.approvalStatus.toLocaleLowerCase() ===
                              "approved"
                                ? "bg-green-100 text-green-800"
                                : request.approvalStatus.toLocaleLowerCase() ===
                                  "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.approvalStatus.charAt(0).toUpperCase() +
                              request.approvalStatus.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="py-4 px-2 text-center text-muted-foreground"
                      colSpan={7}
                    >
                      No leave records match the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveReports;
