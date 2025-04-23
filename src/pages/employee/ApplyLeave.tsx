import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllLeaveTypes } from "@/services/leavetypes";
import { applyLeave } from "@/services/leave";
import { toast } from "sonner";
import { ApplyLeaveRequest } from "@/types/leaveTypes";
import { getUserSession } from "@/utils";

const ApplyLeave: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState<string>("");
  const [leaveDuration, setLeaveDuration] = useState<boolean>(true);
  const [reason, setReason] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);

  const { data: leaveTypes, isLoading } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getAllLeaveTypes,
  });

  // Mutation for applying leave
  const applyLeaveMutation = useMutation({
    mutationFn: applyLeave,
    onSuccess: () => {
      toast.success("Leave application submitted successfully!",{position: "top-center"});
      // Reset form fields
      setLeaveType("");
      setStartDate(undefined);
      setEndDate(undefined);
      setLeaveDuration(true);
      setReason("");
      setDocument(null);
    },
    onError: () => {
      toast.error("Failed to submit leave application. Please try again.",{position: "top-center"});
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const user = getUserSession();

    const requestData: ApplyLeaveRequest = {
      userId: user?.id ,
      type: leaveType,
      leaveReason: reason,
      isFullDay: leaveDuration,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0], 
      document,
    };
    console.log(requestData)
   applyLeaveMutation.mutate(requestData);
  };
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Leave Duration</Label>
              <RadioGroup
                value={leaveDuration.toString()} // Convert boolean to string for the RadioGroup
                onValueChange={(value) => {
                  console.log({value})
                  setLeaveDuration(value === "true")
                }
                  
                  } // Convert string back to boolean
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="full-day" />
                  <Label htmlFor="full-day">Full Day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="half-day" />
                  <Label htmlFor="half-day">Half Day</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for your leave"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Supporting Document</Label>
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
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplyLeave;
