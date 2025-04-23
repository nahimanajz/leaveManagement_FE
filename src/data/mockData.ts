import {
  LeaveType,
  Employee,
  LeaveRequest,
  Department,
} from "@/types/leaveTypes";

export const leaveTypes: LeaveType[] = [
]

export const departments: Department[] = [
  {
    id: "dev",
    name: "Development",
    managerId: "2",
  },
  {
    id: "hr",
    name: "Human Resources",
    managerId: "5",
  },
  {
    id: "fin",
    name: "Finance",
    managerId: "8",
  },
  {
    id: "mkt",
    name: "Marketing",
    managerId: "7",
  },
];

export const employees: Employee[] | any[] = [
  {
    id: "1",
    name: "Kwame Nkrumah",
    email: "kwame@africahr.com",
    position: "Software Developer",
    department: "dev",
    startDate: "2021-03-15",
    leaveBalances: {
      pto: 15,
      sick: 15,
      compassionate: 5,
      maternity: 0,
    },
  },
  {
    //TODO: in users response, create a table to fetch leaves a user took, then return it in response like below
    id: "2",
    name: "Amara Diallo",
    email: "amara@africahr.com",
    position: "Development Manager",
    department: "dev",
    startDate: "2020-05-10",
    leaveBalances: {
      pto: 10,
      sick: 15,
      compassionate: 5,
      maternity: 90,
    },
  },
  {
    id: "3",
    name: "Tendai Moyo",
    email: "tendai@africahr.com",
    position: "Frontend Developer",
    department: "dev",
    startDate: "2022-01-20",
    leaveBalances: {
      pto: 18,
      sick: 15,
      compassionate: 5,
      maternity: 0,
    },
  },
  {
    id: "4",
    name: "Fatima Abebe",
    email: "fatima@africahr.com",
    position: "UX Designer",
    department: "dev",
    startDate: "2021-11-05",
    leaveBalances: {
      pto: 12,
      sick: 10,
      compassionate: 5,
      maternity: 90,
    },
  },
  {
    id: "5",
    name: "Nala Okoro",
    email: "nala@africahr.com",
    position: "HR Manager",
    department: "hr",
    startDate: "2020-02-15",
    leaveBalances: {
      pto: 8,
      sick: 15,
      compassionate: 3,
      maternity: 0,
    },
  },
  {
    id: "6",
    name: "Thabo Mandela",
    email: "thabo@africahr.com",
    position: "Accountant",
    department: "fin",
    startDate: "2021-07-01",
    leaveBalances: {
      pto: 20,
      sick: 15,
      compassionate: 5,
      maternity: 0,
    },
  },
  {
    id: "7",
    name: "Zainab Omar",
    email: "zainab@africahr.com",
    position: "Marketing Manager",
    department: "mkt",
    startDate: "2020-11-15",
    leaveBalances: {
      pto: 5,
      sick: 15,
      compassionate: 5,
      maternity: 0,
    },
  },
  {
    id: "8",
    name: "Kofi Mensah",
    email: "kofi@africahr.com",
    position: "Finance Director",
    department: "fin",
    startDate: "2019-06-10",
    leaveBalances: {
      pto: 17,
      sick: 15,
      compassionate: 5,
      maternity: 0,
    },
  },
];

// Generate some leave requests spanning the next few months
const generateLeaveRequests = (): LeaveRequest[] => {
  const requests: LeaveRequest[] = [];
  const today = new Date();
  const statuses: ("pending" | "approved" | "rejected")[] = [
    "pending",
    "approved",
    "approved",
    "approved",
    "rejected",
  ];

  // For each employee, generate 1-3 leave requests
  employees.forEach((employee) => {
    const requestCount = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < requestCount; i++) {
      // Random start date within next 90 days
      const randomDaysOffset = Math.floor(Math.random() * 90);
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + randomDaysOffset);

      // Random duration between 1-7 days
      const duration = 1 + Math.floor(Math.random() * 7);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration - 1);

      // Random leave type (weighted toward PTO)
      const leaveTypeIds = [
        "pto",
        "pto",
        "pto",
        "sick",
        "compassionate",
        "maternity",
      ];
      const leaveTypeId =
        leaveTypeIds[Math.floor(Math.random() * leaveTypeIds.length)];

      // If maternity leave but employee not eligible (based on our mock data), skip
      if (
        leaveTypeId === "maternity" &&
        employee.leaveBalances["maternity"] === 0
      ) {
        continue;
      }

      // Set request date to 1-14 days before start date
      const requestDate = new Date(startDate);
      requestDate.setDate(
        startDate.getDate() - (1 + Math.floor(Math.random() * 14))
      );

      // Random status
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      requests.push({
        id: `req-${employee.id}-${i}`,
        employeeId: employee.id,
        leaveTypeId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        status,
        requestDate: requestDate.toISOString().split("T")[0],
        approvedBy:
          status === "approved"
            ? departments.find((d) => d.id === employee.department)?.managerId
            : undefined,
        notes: status === "rejected" ? "Insufficient notice period" : undefined,
        totalDays: duration,
      });
    }
  });

  return requests;
};

export const leaveRequests: LeaveRequest[] = generateLeaveRequests();
