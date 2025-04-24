"use client";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, Calendar, BarChart3, Users } from "lucide-react";
import { MicrosoftIcon } from "@/components/MicrosoftIcon";
import { useMsal } from "@azure/msal-react";
import { Employee } from "@/types/leaveTypes";
import { useState } from "react";
import UserForm from "@/components/users/UserForm";
import { toast } from "sonner";
import { formatEmail, redirectToDashboard, saveUserSession } from "@/utils";
import { getUserByEmailOrMicrosoftId } from "@/services/auth";

const Index = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { instance } = useMsal();

  const handleMicrosoftLogin = async () => {
    try {
      // Perform login
      const loginResponse = await instance.loginPopup({
        scopes: ["User.Read", "Calendars.Read", "Calendars.ReadWrite"],
        prompt: "consent",
      });

      // Fetch user profile from Microsoft Graph API
      const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${loginResponse.accessToken}`,
        },
      });

      const userProfile = await graphResponse.json();

      const { displayName, mail, userPrincipalName, photo, id } = userProfile;
      const email = mail || userPrincipalName; // Use mail or fallback to userPrincipalName
      const avatarUrl = photo || `/microsoft.jpg`; // URL for user's profile photo

      // check if user already exist
      const user = await getUserByEmailOrMicrosoftId(formatEmail(email), id);

      if (user) {
        saveUserSession(user);
        redirectToDashboard(user);
      } else {
        const userData = {
          ...(employee || {}),
          name: displayName,
          avatarUrl: avatarUrl,
          microsoftId: id,
          email: formatEmail(email),
        };

        setIsDialogOpen(true);
        setEmployee(userData as Employee);
      }
    } catch (error) {
      toast.error("Error while signing in", { position: "top-center" });
    }
  };
  // handle signin
  const handleAdminSignIn =() =>{
    window.location.href = "/admin-signin";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Africa HR Leave Management System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Streamline how staff apply for and manage their leave in accordance
            with the Rwandan Labor Law (2023)
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleMicrosoftLogin}
            >
              <MicrosoftIcon className="mr-2 h-4 w-4" />
              Sign in with Microsoft
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleAdminSignIn}
            >
              {" "}
              Admin sign in
            </Button>
            <UserForm
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              currentEmployee={employee}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all hover:shadow-lg">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Manage Leave Types</h3>
            <p className="text-gray-600 mb-4">
              Configure leave types, accrual rates, and carry-forward policies.
            </p>
            <Link
              to="/admin/leave-types"
              className="text-primary hover:underline mt-auto"
            >
              Manage Types →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all hover:shadow-lg">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Calendar</h3>
            <p className="text-gray-600 mb-4">
              View team and department leave calendars to plan resources
              effectively.
            </p>
            <Link
              to="/admin/calendar"
              className="text-orange-500 hover:underline mt-auto"
            >
              View Calendar →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all hover:shadow-lg">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-gray-600 mb-4">
              Generate reports by employee, leave type, department, and export
              data.
            </p>
            <Link
              to="/admin/reports"
              className="text-blue-500 hover:underline mt-auto"
            >
              View Reports →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all hover:shadow-lg">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Employee Management</h3>
            <p className="text-gray-600 mb-4">
              Manage employee records and adjust leave balances when necessary.
            </p>
            <Link
              to="/admin/employees"
              className="text-green-500 hover:underline mt-auto"
            >
              Manage Employees →
            </Link>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">
            About Our Leave Management System
          </h2>
          <p className="mb-4">
            Our system is designed to streamline the leave management process
            for Africa HR, ensuring compliance with Rwandan Labor Law (2023)
            while providing a user-friendly interface for both employees and
            administrators.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Supported Leave Types
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Personal Time Off (PTO) - 20 days/year</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span>Sick Leave</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span>Compassionate Leave</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
              <span>Maternity Leave</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
