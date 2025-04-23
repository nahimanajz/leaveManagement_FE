import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "@/services/leavetypes";
import { LeaveType } from "@/types/leaveTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const LeaveTypes = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLeaveType, setCurrentLeaveType] = useState<LeaveType | null>(
    null
  );

  // Fetch all leave types
  const { data: leaveTypes = [], isLoading } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getAllLeaveTypes,
  });

  // Create leave type mutation
  const createMutation = useMutation({
    mutationFn: createLeaveType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] }); // Refresh leave types
      setIsOpen(false);
      toast.success("Leave type created successfully!");
    },
    onError: () => {
      toast.error("Failed to create leave type. Please try again.");
    },
  });

  // Update leave type mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeaveType }) =>
      updateLeaveType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      setIsOpen(false);
      toast.success("Leave type updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update leave type. Please try again.");
    },
  });

  // Delete leave type mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLeaveType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] }); // Refresh leave types
      toast.success("Leave type deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete leave type. Please try again.");
    },
  });

  const handleOpenDialog = (leaveType?: LeaveType) => {
    if (leaveType) {
      setCurrentLeaveType(leaveType);
    } else {
      setCurrentLeaveType({
        id: "",
        name: "",
        description: "",
        color: "#8B5CF6",
        defaultDays: 0,
        isActive: true,
        monthlyAccrual: 0,
        maxCarryForward: 0,
      });
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setCurrentLeaveType(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLeaveType) return;

    if (currentLeaveType.id) {
      // Update existing leave type
      updateMutation.mutate({
        id: currentLeaveType.id,
        data: currentLeaveType,
      });
    } else {
      // Create new leave type
      createMutation.mutate(currentLeaveType);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleChange = (key: keyof LeaveType, value: any) => {
    if (!currentLeaveType) return;

    setCurrentLeaveType({
      ...currentLeaveType,
      [key]: value,
    });
  };

  if (isLoading) {
    return <p>Loading leave types...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leave Types</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Leave Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Leave Types</CardTitle>
          <CardDescription>
            Configure the different types of leave available to employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Default Days</TableHead>
                <TableHead>Carry Forward</TableHead>
                <TableHead>Accrual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveTypes.map((leaveType: LeaveType) => (
                <TableRow key={leaveType.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: leaveType.color }}
                      />
                      <div>
                        <p className="font-medium">{leaveType.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {leaveType.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{leaveType.defaultDays} days</TableCell>
                  <TableCell>{leaveType.maxCarryForward}</TableCell>
                  <TableCell>{leaveType.monthlyAccrual}%</TableCell>
                  <TableCell>
                    <Switch
                      checked={leaveType.isActive}
                      onCheckedChange={() =>
                        updateMutation.mutate({
                          id: leaveType.id,
                          data: { ...leaveType, isActive: !leaveType.isActive },
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(leaveType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(leaveType.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentLeaveType &&
              leaveTypes.some((lt: LeaveType) => lt.id === currentLeaveType.id)
                ? "Edit Leave Type"
                : "Add Leave Type"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentLeaveType?.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={currentLeaveType?.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="flex col-span-3 items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: currentLeaveType?.color || "#8B5CF6",
                    }}
                  />
                  <Input
                    id="color"
                    type="color"
                    value={currentLeaveType?.color || "#8B5CF6"}
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="defaultDays" className="text-right">
                  Default Days
                </label>
                <input
                  id="defaultDays"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentLeaveType?.defaultDays || 0.0}
                  onChange={(e) =>
                    handleChange("defaultDays", parseFloat(e.target.value))
                  }
                  className="col-span-3 border rounded px-2 py-1"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="maxCarryForward" className="text-right">
                  Max Carry Forward
                </label>
                <input
                  id="maxCarryForward"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentLeaveType?.maxCarryForward || 0.0}
                  onChange={(e) =>
                    handleChange("maxCarryForward", parseFloat(e.target.value))
                  }
                  className="col-span-3 border rounded px-2 py-1"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="monthlyAccrual" className="text-right">
                  Monthly Accrual
                </label>
                <input
                  id="monthlyAccrual"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentLeaveType?.monthlyAccrual || 0.0}
                  onChange={(e) =>
                    handleChange("monthlyAccrual", parseFloat(e.target.value))
                  }
                  className="col-span-3 border rounded px-2 py-1"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveTypes;
