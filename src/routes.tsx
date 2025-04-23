import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import EmployeeLayout from "./components/EmployeeLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import LeaveTypes from "./pages/admin/LeaveTypes";
import ManageLeaves from "./pages/admin/ManageLeaves";
import LeaveCalendar from "./pages/admin/LeaveCalendar";
import LeaveReports from "./pages/admin/LeaveReports";
import ManageEmployees from "./pages/admin/ManageEmployees";
import ApplyLeave from "./pages/employee/ApplyLeave";
import LeaveHistory from "./pages/employee/LeaveHistory";
import TeamCalendar from "./pages/employee/TeamCalendar";
import Documents from "./pages/employee/Documents";
import NotFound from "./pages/NotFound";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSignIn from "./pages/AdminSignin";
import Notifications from "./pages/employee/Notifications";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/admin-signin",
    element: <AdminSignIn />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRoles={["ADMIN", "MANAGER"]}>
      <Layout />
    </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "leave-types",
        element: <LeaveTypes />,
      },
      {
        path: "manage-leaves",
        element: <ManageLeaves />,
      },
      {
        path: "calendar",
        element: <LeaveCalendar />,
      },
      {
        path: "reports",
        element: <LeaveReports />,
      },
      {
        path: "employees",
        element: <ManageEmployees />,
      },
    ],
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute requiredRoles={["STAFF"]}>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <EmployeeDashboard />,
      },
      {
        path: "apply",
        element: <ApplyLeave />,
      },
      {
        path: "history",
        element: <LeaveHistory />,
      },
      {
        path: "calendar",
        element: <TeamCalendar />,
      },
      {
        path: "notifications",
        element: <Notifications />
      },
      /** TODO: implement this feature only if there is more time */
      /*
      {
        path: "documents",
        element: <Documents />,
      }
      */
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);