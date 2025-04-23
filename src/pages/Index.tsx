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
      const avatarUrl = `data:image/png;base64,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`; // URL for user's profile photo

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
