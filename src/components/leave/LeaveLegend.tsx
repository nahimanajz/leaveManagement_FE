
import { leaveTypes } from "@/data/mockData";

const LeaveLegend = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Legend</h3>
      <div className="flex flex-wrap gap-4">
        {leaveTypes.map(type => (
          <div key={type.id} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: type.color }}
            />
            <span className="text-sm">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveLegend;
