import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamCalendarComponent from "@/components/TeamCalendar";
import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/utils";
import { getAllUsers } from "@/services/user";
import { getCalendarEvents } from "@/utils/calendarConfig";
import { msalInstance } from "@/utils/authConfig";


const TeamCalendar: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const user = getUserSession(); // Get the signed-in user's session
  const userDepartment = user.department; // Get the department from the session

  // Fetch all users and filter by department
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const fetchEvents = async () => {
    try {
      const accounts = msalInstance.getActiveAccount();
      console.log("Accounts:", accounts); // Debugging: Check if accounts are available
  
      const events = await getCalendarEvents();
      console.log({ events });
      setCalendarEvents(events);
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
    }
  };

  useEffect(() => {
    fetchEvents()
  }, []);

  const teamMembers = users.filter((u) => u.department === userDepartment);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Calendar</h1>
        <p className="text-gray-500">
          View team members on leave and public holidays
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamCalendarComponent users={users}  />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members on Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p>Loading team members...</p>
              ) : teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.position}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {member.leaveBalances
                        ? `${Object.values(member.leaveBalances).reduce(
                            (a:number, b:number) => a + b,
                            0
                          )} days`
                        : "No leave data"}
                    </span>
                  </div>
                ))
              ) : (
                <p>No team members found in your department.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Public Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be populated with actual data */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Independence Day</p>
                  <p className="text-sm text-gray-500">National holiday</p>
                </div>
                <span className="text-sm text-gray-500">Jul 1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamCalendar;