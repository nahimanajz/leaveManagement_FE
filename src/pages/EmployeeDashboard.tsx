import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TeamCalendar from "@/components/TeamCalendar";
import { Calendar, Heart, Baby, Briefcase } from "lucide-react";
import { employeeCards, getUserSession } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { getLeavesByUserId } from "@/services/leave";

const EmployeeDashboard: React.FC = () => {
  const user = getUserSession();
  
  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ["leaves", user.id],
    queryFn: () => getLeavesByUserId(user.id),
    enabled: !!user.id, 
  });
  const icons = [Briefcase, Heart, Baby, Calendar];
  const leaveCards = leaves[0]?.user ?employeeCards(icons, leaves[0]?.user): []
   
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back! {user.name}</h1>
        <p className="text-gray-500">
          Here's an overview of your leave balances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaveCards .map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-2 rounded-lg`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{String(card.value)}</span>
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
