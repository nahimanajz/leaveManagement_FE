import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamCalendarComponent from "@/components/TeamCalendar";

const TeamCalendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Calendar</h1>
        <p className="text-gray-500">View team members on leave and public holidays</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamCalendarComponent />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members on Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be populated with actual data */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">PTO - 5 days</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Apr 1 - Apr 5</span>
              </div>
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