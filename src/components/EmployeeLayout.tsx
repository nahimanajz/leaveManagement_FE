import { Outlet } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeHeader from './EmployeeHeader';

const EmployeeLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <EmployeeSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <EmployeeHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout; 