import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/leaveTypes";

interface PublicHoliday {
  date: Date;
  name: string;
}

interface TeamMemberLeave {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: string;
}

interface IProps {
  users: Employee[];
}

const TeamCalendar: React.FC<IProps> = ({ users }) => {
  const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([]);
  const [teamLeaves, setTeamLeaves] = useState<TeamMemberLeave[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const fetchPublicHolidays = async () => {
    try {
      const holidays: PublicHoliday[] = [
        { date: new Date(2024, 0, 1), name: "New Year's Day" },
        { date: new Date(2024, 3, 7), name: "Genocide Memorial Day" },
        { date: new Date(2024, 6, 1), name: "Independence Day" },
        { date: new Date(2024, 11, 25), name: "Christmas Day" },
      ];
      setPublicHolidays(holidays);
    } catch (error) {
      console.error("Error fetching public holidays:", error);
    }
  };

  const fetchTeamLeaves = async () => {
    try {
      const leaves: TeamMemberLeave[] = users
        .filter((employee) => employee.leaveBalances) // Ensure leaveBalances exist
        .flatMap((employee) => {
          return Object.entries(employee.leaveBalances!).map(([leaveType, days]) => ({
            id: employee.id || "",
            name: employee.name,
            startDate: new Date(employee.startDate), // Assuming startDate is the leave start date
            endDate: new Date(new Date(employee.startDate).getTime() + days * 24 * 60 * 60 * 1000), // Add leave days
            type: leaveType,
          }));
        });

      setTeamLeaves(leaves);
    } catch (error) {
      console.error("Error fetching team leaves:", error);
    }
  };

  const getTeamMembersOnLeave = (date: Date) => {
    return teamLeaves.filter(
      (leave) => date >= leave.startDate && date <= leave.endDate
    );
  };

  const isPublicHoliday = (date: Date) => {
    return publicHolidays.some(
      (holiday) => holiday.date.toDateString() === date.toDateString()
    );
  };

  useEffect(() => {
    fetchPublicHolidays();
    fetchTeamLeaves();
  }, []);

  const dateContent = (date: Date) => {
    const teamMembers = getTeamMembersOnLeave(date);
    const isHoliday = isPublicHoliday(date);

    return (
      <div className="relative">
        {isHoliday && (
          <Badge variant="secondary" className="absolute -top-1 -right-1">
            Holiday
          </Badge>
        )}
        {teamMembers.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-primary/10 text-xs p-1">
            {teamMembers.length} on leave
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => (
              <div className="relative">
                <span>{date.getDate()}</span>
                {dateContent(date)}
              </div>
            ),
          }}
        />

        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              Details for {selectedDate.toLocaleDateString()}
            </h3>
            {isPublicHoliday(selectedDate) && (
              <p className="text-sm text-muted-foreground">
                Public Holiday:{" "}
                {
                  publicHolidays.find(
                    (h) =>
                      h.date.toDateString() === selectedDate.toDateString()
                  )?.name
                }
              </p>
            )}
            {getTeamMembersOnLeave(selectedDate).length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Team Members on Leave:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {getTeamMembersOnLeave(selectedDate).map((member) => (
                    <li key={member.id}>
                      {member.name} ({member.type})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamCalendar;