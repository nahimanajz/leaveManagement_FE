"use client";

import { Employee, LeaveType } from "@/types/leaveTypes";
import { FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchTeams } from "@/services/departments";
import { saveUser } from "@/services/user";
import { toast } from "sonner";
import { redirectToDashboard, saveUserSession } from "@/utils";
import { getAllLeaveTypes } from "@/services/leavetypes";

interface UserFormProps {
  currentEmployee?: Employee | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  leaveTypes?: LeaveType[];
  handleLeaveBalanceChange?: (id: string, value: number) => void;
}

const UserForm: FC<UserFormProps> = ({
  currentEmployee,
  isDialogOpen,
  setIsDialogOpen,
  leaveTypes = [],
  handleLeaveBalanceChange
}) => {
  
  const [data, setData] = useState<Employee>(
    currentEmployee || {
      name: "",
      email: "",
      position: "",
      department: "",
      startDate: "",
      leaveBalances: {},
    } as Employee
  );



  const mutation = useMutation({
    mutationFn: (userData: Employee) => saveUser(userData),
    onSuccess: (response) => {
      saveUserSession(response);
      redirectToDashboard(response);
    },
    onError: (error) => {
      toast.error("Error saving user data: " + error.message);
    }
  }); 
  // Fetch departments using React Query
  const { data: departments, isLoading, error } = useQuery({queryKey:["departments"], queryFn: fetchTeams});

  // Update form data when currentEmployee changes
  useEffect(() => {
    if (currentEmployee) {
      setData(currentEmployee);
    }
  }, [currentEmployee]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(data); 
    
  };

  const handleChange = (key: keyof Employee, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleLeaveBalanceChangeInternal = (id: string, value: number) => {
    setData((prevData) => ({
      ...prevData,
      leaveBalances: {
        ...prevData.leaveBalances,
        [id]: value,
      },
    }));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {currentEmployee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
          <DialogDescription>
            Employee details and leave balances.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={data.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isLoading ? (
                    <p>Loading departments...</p>
                  ) : error ? (
                    <p>Error loading departments</p>
                  ) : (
                    <Select
                      value={data.department}
                      onValueChange={(value) => handleChange("department", value)}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept: { id: string; name: string }) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={data.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Leave Balances</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaveTypes.map((leaveType:LeaveType) => (
                  <div key={leaveType.id} className="space-y-2">
                    <Label
                      htmlFor={`leave-${leaveType.id}`}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: leaveType.color }}
                      />
                      {leaveType.name}
                    </Label>
                    <Input
                      id={`leave-${leaveType.id}`}
                      type="number"
                      min="0"
                      value={leaveType.defaultDays.toFixed(1) || 0.0}
                      onChange={(e) =>
                        handleLeaveBalanceChangeInternal(
                          leaveType.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
