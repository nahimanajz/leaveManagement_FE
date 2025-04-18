
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LeaveType } from "@/types/leaveTypes";
import { leaveTypes as initialLeaveTypes } from "@/data/mockData";

const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(initialLeaveTypes);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLeaveType, setCurrentLeaveType] = useState<LeaveType | null>(null);
  
  const handleOpenDialog = (leaveType?: LeaveType) => {
    if (leaveType) {
      setCurrentLeaveType(leaveType);
    } else {
      setCurrentLeaveType({
        id: `type-${Date.now()}`,
        name: "",
        description: "",
        color: "#8B5CF6",
        defaultDays: 0,
        isActive: true,
        carryForwardPercentage: 0,
        accrualRate: "yearly"
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
    
    if (leaveTypes.some(lt => lt.id === currentLeaveType.id)) {
      // Update existing
      setLeaveTypes(
        leaveTypes.map(lt => 
          lt.id === currentLeaveType.id ? currentLeaveType : lt
        )
      );
    } else {
      // Add new
      setLeaveTypes([...leaveTypes, currentLeaveType]);
    }
    
    handleCloseDialog();
  };
  
  const handleDelete = (id: string) => {
    setLeaveTypes(leaveTypes.filter(lt => lt.id !== id));
  };
  
  const handleChange = (key: keyof LeaveType, value: any) => {
    if (!currentLeaveType) return;
    
    setCurrentLeaveType({
      ...currentLeaveType,
      [key]: value
    });
  };
  
  const handleToggleActive = (id: string) => {
    setLeaveTypes(
      leaveTypes.map(lt => 
        lt.id === id ? { ...lt, isActive: !lt.isActive } : lt
      )
    );
  };

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
              {leaveTypes.map((leaveType) => (
                <TableRow key={leaveType.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: leaveType.color }}
                      />
                      <div>
                        <p className="font-medium">{leaveType.name}</p>
                        <p className="text-sm text-muted-foreground">{leaveType.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{leaveType.defaultDays} days</TableCell>
                  <TableCell>{leaveType.carryForwardPercentage}%</TableCell>
                  <TableCell>
                    {leaveType.accrualRate.charAt(0).toUpperCase() + leaveType.accrualRate.slice(1)}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={leaveType.isActive} 
                      onCheckedChange={() => handleToggleActive(leaveType.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(leaveType)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(leaveType.id)}>
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
              {currentLeaveType && leaveTypes.some(lt => lt.id === currentLeaveType.id) 
                ? "Edit Leave Type" 
                : "Add Leave Type"}
            </DialogTitle>
            <DialogDescription>
              Configure the details for this leave type.
            </DialogDescription>
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
                    style={{ backgroundColor: currentLeaveType?.color || "#8B5CF6" }}
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
                <Label htmlFor="defaultDays" className="text-right">
                  Default Days
                </Label>
                <Input
                  id="defaultDays"
                  type="number"
                  min="0"
                  value={currentLeaveType?.defaultDays || 0}
                  onChange={(e) => handleChange("defaultDays", parseInt(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="carryForward" className="text-right">
                  Carry Forward (%)
                </Label>
                <Input
                  id="carryForward"
                  type="number"
                  min="0"
                  max="100"
                  value={currentLeaveType?.carryForwardPercentage || 0}
                  onChange={(e) => handleChange("carryForwardPercentage", parseInt(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accrualRate" className="text-right">
                  Accrual Rate
                </Label>
                <Select 
                  value={currentLeaveType?.accrualRate || "yearly"}
                  onValueChange={(value) => handleChange("accrualRate", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select accrual rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="isActive" 
                    checked={currentLeaveType?.isActive || false}
                    onCheckedChange={(value) => handleChange("isActive", value)}
                  />
                  <Label htmlFor="isActive">
                    {currentLeaveType?.isActive ? "Enabled" : "Disabled"}
                  </Label>
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
    </div>
  );
};

export default LeaveTypes;
