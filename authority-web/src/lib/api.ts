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

function requireAccessToken(): string {
  const token = getAccessToken();
  if (!token) throw { error: "not_logged_in" };
  return token;
}

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
