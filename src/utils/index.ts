// Extract and format the email
export const formatEmail = (rawEmail: string): string => {
    const emailParts = rawEmail.split("#EXT#")[0]; // Split at #EXT# and take the first part
    return emailParts.replace("_", "@"); // Replace underscore with @
  };
  
// Save the response in sessionStorage
export const saveUserSession = (response) => {
  sessionStorage.setItem("user", JSON.stringify(response));
};

export const redirectToDashboard = (response) => {
  const email = response.email.toLowerCase();
  const role = response.role;

  if (email.endsWith("@ist.com") && (role === "ADMIN" || role === "MANAGER")) {
    // Redirect to admin dashboard
    window.location.href = "/admin";
  } else {
    // Redirect to employee dashboard
    window.location.href = "/employee";
  }
};

export const getUserSession = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const signOut = () => {
  sessionStorage.clear();
  window.location.href = "/";
};

export const employeeCards = (icons, user) => {
  const leaveBalances = user.leaveBalances || {};
  const randomIcon = icons[Math.floor(Math.random() * icons.length)]; 

  const defaultConfig = {
    icon: randomIcon,
    color: "bg-green-500",
    description: "Leave entitlement",
  };

  return Object.entries(leaveBalances)
    .slice(0, 4)
    .map(([leaveType, balance]) => {
      const config = {
        icon: randomIcon,
        color: "bg-blue-500",
        description: `${leaveType} entitlement`,
        ...defaultConfig,
      };

      return {
        title: leaveType,
        value: balance,
        icon: config.icon,
        color: config.color,
        description: config.description,
      };
    });
}
