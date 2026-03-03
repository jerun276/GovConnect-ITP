export const env = {
  authBaseUrl: process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:8081",
  complaintBaseUrl: process.env.NEXT_PUBLIC_COMPLAINT_BASE_URL ?? "http://localhost:8083",
  departmentBaseUrl: process.env.NEXT_PUBLIC_DEPARTMENT_BASE_URL ?? "http://localhost:8082",
} as const;
