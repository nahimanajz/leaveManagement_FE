import { LeaveResponse, UserBalance } from "@/types";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateLeavesBalances } from "@/services/user";
import { getAllLeaveTypes } from "@/services/leavetypes";

interface UpdateLeaveBalanceProps {
  request: LeaveResponse;
}

const LeaveBalanceDialog: FC<UpdateLeaveBalanceProps> = ({ request }) => {
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const queryClient = useQueryClient();

  // Fetch leave types to map name → ID
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getAllLeaveTypes,
  });

  const mutation = useMutation({
    mutationFn: (data: UserBalance) => updateLeavesBalances(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Leave balance updated", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Update failed.";
      toast.error(errorMsg, { position: "top-right" });
    },
  });

  const getLeaveTypeId = (key: string):number => {
    const match = leaveTypes.find(
      (lt) => lt.name.toLowerCase() === key.toLowerCase()
    );
    return match?.id as unknown as number;
  };

  const handleUpdateLeaveBalances = () => {
    const userId = request.user.id as unknown as number;

    Object.entries(balances).forEach(([leaveName, leaveBalance]) => {
      const leaveTypeId = getLeaveTypeId(leaveName);

      if (!leaveTypeId) {
        return;
      }

      const data:UserBalance = {
        userId,
        data: {
          leaveTypeId,
          leaveBalance,
        },
      };

      mutation.mutate(data );
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Balance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Leave Balance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm">
            Update balance for <strong>{request.user.name}</strong>
          </p>
          {Object.entries(request.user.leaveBalances || {}).map(
            ([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`balance-${key}`}>{key}</Label>
                <input
                  id={`balance-${key}`}
                  type="number"
                  step="0.01"
                  
                  onChange={(e) =>
                    setBalances((prev) => ({
                      ...prev,
                      [key]: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  placeholder={`How many days would you like to add on ${value}?`}
                />
              </div>
            )
          )}
          <div className="flex justify-end gap-2">
            <Button onClick={handleUpdateLeaveBalances}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveBalanceDialog;
