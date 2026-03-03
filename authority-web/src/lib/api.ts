import { env } from "@/lib/env";
import { getAccessToken } from "@/lib/auth";

export type ApiError = {
  error: string;
  details?: unknown;
};

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function authLogin(identifier: string, password: string): Promise<{ accessToken: string; expiresInSeconds: number }> {
  const res = await fetch(`${env.authBaseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "login_failed" };
  }

  return body;
}

export async function fetchComplaint(id: string): Promise<ComplaintDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "complaint_fetch_failed" };
  }

  return body;
}

export async function fetchComplaintTimeline(id: string): Promise<ComplaintTimelineResponse> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/${id}/timeline`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "timeline_fetch_failed" };
  }

  return body;
}

export async function assignComplaint(id: string, assignedToUserId: string, reason?: string): Promise<ComplaintDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/${id}/assign`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assignedToUserId, reason: reason || null }),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "assign_failed" };
  }

  return body;
}

export async function requestCitizenDetails(id: string, message: string): Promise<ComplaintDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/${id}/request-details`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "request_details_failed" };
  }

  return body;
}

export async function addAuthorityResponse(id: string, message: string): Promise<void> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/${id}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "add_response_failed" };
  }
}

export async function updateComplaintStatus(id: string, toStatus: string, note?: string): Promise<ComplaintDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/${id}/status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ toStatus, note: note || null }),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "update_status_failed" };
  }

  return body;
}

export async function addInternalNote(id: string, note: string): Promise<void> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/${id}/internal-notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note }),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "add_internal_note_failed" };
  }
}

export type ComplaintDto = {
  id: string;
  complaintCode: string;
  submittedByUserId: string;
  categoryCode: string;
  descriptionText: string;
  targetType: string;
  selectedDepartmentId: string | null;
  incidentProvinceId: string;
  incidentDistrictId: string;
  incidentDsDivisionId: string;
  incidentGnDivisionId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ComplaintTimelineItemDto = {
  type: string;
  createdAt: string;
  actorUserId: string | null;
  message: string | null;
  fromStatus: string | null;
  toStatus: string | null;
  assignedToUserId: string | null;
};

export type ComplaintTimelineResponse = {
  complaint: ComplaintDto;
  timeline: ComplaintTimelineItemDto[];
};

export async function fetchIdentityMe(): Promise<IdentityMeResponse> {
  const token = requireAccessToken();

  const res = await fetch(`${env.authBaseUrl}/api/identity/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "identity_fetch_failed" };
  }

  return body;
}

export async function createAuthorityOfficer(data: CreateAuthorityRequest): Promise<CreateAuthorityResponse> {
  const token = requireAccessToken();

  const res = await fetch(`${env.authBaseUrl}/api/admin/authorities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "create_authority_failed" };
  }

  return body;
}

export async function fetchPendingApplications(): Promise<AuthorityApplication[]> {
  const token = requireAccessToken();

  const res = await fetch(`${env.authBaseUrl}/api/identity/authority/applications/pending`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "fetch_applications_failed" };
  }

  return body;
}

export async function approveApplication(userId: string): Promise<void> {
  const token = requireAccessToken();

  const res = await fetch(`${env.authBaseUrl}/api/identity/authority/applications/${userId}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const body = (await parseJsonSafe(res)) as any;
    throw body ?? { error: "approve_failed" };
  }
}

export async function rejectApplication(userId: string): Promise<void> {
  const token = requireAccessToken();

  const res = await fetch(`${env.authBaseUrl}/api/identity/authority/applications/${userId}/reject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const body = (await parseJsonSafe(res)) as any;
    throw body ?? { error: "reject_failed" };
  }
}

export async function createPasswordResetToken(userId: string): Promise<CreateAuthorityResponse> {
  const token = requireAccessToken();

  const res = await fetch(`${env.authBaseUrl}/api/admin/authorities/${userId}/password-setup-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "create_token_failed" };
  }

  return body;
}

export type IdentityMeResponse = {
  userId: string;
  userType: string;
  email: string;
  username: string;
  officialRoleLevel: string | null;
  provinceId: string | null;
  districtId: string | null;
  dsDivisionId: string | null;
  gnDivisionId: string | null;
  departmentId: string | null;
};

export type CreateAuthorityRequest = {
  fullName: string;
  officialEmail: string;
  officialRoleLevel: string;
  provinceId?: string | null;
  districtId?: string | null;
  dsDivisionId?: string | null;
  gnDivisionId?: string | null;
  departmentId?: string | null;
};

export type CreateAuthorityResponse = {
  userId: string;
  passwordSetupToken: string;
  expiresAt: string;
};

export type AuthorityApplication = {
  userId: string;
  fullName: string;
  officialEmail: string;
  officialRoleLevel: string;
  provinceId: string | null;
  districtId: string | null;
  dsDivisionId: string | null;
  gnDivisionId: string | null;
  status: string;
  createdAt: string;
};

function requireAccessToken(): string {
  const token = getAccessToken();
  if (!token) throw { error: "not_logged_in" };
  return token;
}

// ============================================
// Department & Statutory Board APIs
// ============================================

export async function fetchDepartments(): Promise<DepartmentDto[]> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/departments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "fetch_departments_failed" };
  }

  return body;
}

export async function fetchDepartment(id: string): Promise<DepartmentDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/departments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "fetch_department_failed" };
  }

  return body;
}

export async function createDepartment(data: CreateDepartmentRequest): Promise<DepartmentDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/departments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "create_department_failed" };
  }

  return body;
}

export async function updateDepartment(id: string, data: CreateDepartmentRequest): Promise<DepartmentDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/departments/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "update_department_failed" };
  }

  return body;
}

export async function deleteDepartment(id: string): Promise<void> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/departments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const body = (await parseJsonSafe(res)) as any;
    throw body ?? { error: "delete_department_failed" };
  }
}

export async function fetchStatutoryBoards(): Promise<StatutoryBoardDto[]> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/statutory-boards`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "fetch_boards_failed" };
  }

  return body;
}

export async function fetchStatutoryBoard(id: string): Promise<StatutoryBoardDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/statutory-boards/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "fetch_board_failed" };
  }

  return body;
}

export async function fetchStatutoryBoardsByDepartment(departmentId: string): Promise<StatutoryBoardDto[]> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/departments/${departmentId}/statutory-boards`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "fetch_boards_failed" };
  }

  return body;
}

export async function createStatutoryBoard(data: CreateStatutoryBoardRequest): Promise<StatutoryBoardDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/statutory-boards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "create_board_failed" };
  }

  return body;
}

export async function updateStatutoryBoard(id: string, data: CreateStatutoryBoardRequest): Promise<StatutoryBoardDto> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/statutory-boards/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "update_board_failed" };
  }

  return body;
}

export async function deleteStatutoryBoard(id: string): Promise<void> {
  const token = requireAccessToken();

  const res = await fetch(`${env.departmentBaseUrl}/api/statutory-boards/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const body = (await parseJsonSafe(res)) as any;
    throw body ?? { error: "delete_board_failed" };
  }
}

export type DepartmentDto = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  ministryName: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  officeAddress: string | null;
  isActive: boolean;
  createdAt: string;
};

export type CreateDepartmentRequest = {
  code: string;
  name: string;
  description?: string | null;
  ministryName?: string | null;
  websiteUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  officeAddress?: string | null;
};

export type StatutoryBoardDto = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  departmentId: string | null;
  departmentName: string | null;
  boardType: string;
  establishedDate: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  officeAddress: string | null;
  isActive: boolean;
  createdAt: string;
};

export type CreateStatutoryBoardRequest = {
  code: string;
  name: string;
  description?: string | null;
  departmentId?: string | null;
  boardType: string;
  establishedDate?: string | null;
  websiteUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  officeAddress?: string | null;
};

export async function fetchQueue(): Promise<ComplaintDto[]> {
  const token = requireAccessToken();

  const res = await fetch(`${env.complaintBaseUrl}/api/complaints/queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const body = (await parseJsonSafe(res)) as any;
  if (!res.ok) {
    throw body ?? { error: "queue_fetch_failed" };
  }

  return body;
}
