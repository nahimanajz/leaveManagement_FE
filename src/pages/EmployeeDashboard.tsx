import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TeamCalendar from "@/components/TeamCalendar";
import { 
  Calendar, 
  Heart, 
  Baby, 
  Briefcase 
} from 'lucide-react';

interface LeaveBalance {
  pto: number;
  sick: number;
  compassionate: number;
  maternity: number;
}

interface LeaveApplication {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

const EmployeeDashboard: React.FC = () => {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>({
    pto: 20,
    sick: 10,
    compassionate: 5,
    maternity: 90
  });

  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleLeaveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle leave application submission
  };

  const leaveCards = [
    {
      title: "Personal Time Off",
      value: leaveBalance.pto,
      icon: Briefcase,
      color: "bg-blue-500",
      description: "Annual leave entitlement"
    },
    {
      title: "Sick Leave",
      value: leaveBalance.sick,
      icon: Heart,
      color: "bg-green-500",
      description: "Medical leave days"
    },
    {
      title: "Compassionate Leave",
      value: leaveBalance.compassionate,
      icon: Heart,
      color: "bg-purple-500",
      description: "Bereavement leave"
    },
    {
      title: "Maternity Leave",
      value: leaveBalance.maternity,
      icon: Baby,
      color: "bg-pink-500",
      description: "Maternity entitlement"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-500">Here's an overview of your leave balances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaveCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                <div className={`${card.color} p-2 rounded-lg`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{card.value}</span>
                <span className="ml-2 text-gray-500">days</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No upcoming leaves scheduled</p>
          </CardContent>
        </Card>

       
      </div>

    </div>
  );
};

export default EmployeeDashboard; 