import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import LeaveTypes from "./pages/admin/LeaveTypes";
import LeaveCalendar from "./pages/admin/LeaveCalendar";
import LeaveReports from "./pages/admin/LeaveReports";
import ManageEmployees from "./pages/admin/ManageEmployees";
import ManageLeaves from "./pages/admin/ManageLeaves";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import LeaveHistory from "./pages/employee/LeaveHistory";
import TeamCalendar from "./pages/employee/TeamCalendar";
import Documents from "./pages/employee/Documents";
import Layout from "./components/Layout";
import EmployeeLayout from "./components/EmployeeLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="leave-types" element={<LeaveTypes />} />
            <Route path="manage-leaves" element={<ManageLeaves />} />
            <Route path="calendar" element={<LeaveCalendar />} />
            <Route path="reports" element={<LeaveReports />} />
            <Route path="employees" element={<ManageEmployees />} />
          </Route>
          
          {/* Employee routes */}
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="apply" element={<ApplyLeave />} />
            <Route path="history" element={<LeaveHistory />} />
            <Route path="calendar" element={<TeamCalendar />} />
            <Route path="documents" element={<Documents />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
