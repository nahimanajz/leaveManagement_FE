import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { getAllLeaveTypes } from "@/services/leavetypes";

const LeaveLegend = () => {
  // Fetch leave types to display in legend
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: getAllLeaveTypes,
  });

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {leaveTypes.map((leaveType) => (
        <div key={leaveType.id} className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: leaveType.color }}
          ></div>
          <span className="text-sm">{leaveType.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LeaveLegend;