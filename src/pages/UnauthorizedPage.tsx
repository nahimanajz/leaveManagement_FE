import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="text-gray-600 mt-4">You do not have permission to view this page.</p>
      <Link to="/" className="mt-6 text-blue-500 underline">
        Go to Login
      </Link>
    </div>
  );
};

export default UnauthorizedPage;