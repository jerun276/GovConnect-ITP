import * as SecureStore from 'expo-secure-store';

// Use your computer's IP address for mobile device testing
// For iOS simulator, use 'http://localhost:PORT'
// For Android emulator, use 'http://10.0.2.2:PORT'
// For physical device, use your computer's local IP: 'http://192.168.X.X:PORT'

const AUTH_BASE_URL = 'http://172.16.20.175:8081';
const COMPLAINT_BASE_URL = 'http://172.16.20.175:8083';
const DEPARTMENT_BASE_URL = 'http://172.16.20.175:8082';

async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('access_token');
}

async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync('access_token', token);
}

async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync('access_token');
}

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

// Auth API
export async function login(
  identifier: string,
  password: string
): Promise<{ accessToken: string; expiresInSeconds: number }> {
  console.log('Logging in with URL:', `${AUTH_BASE_URL}/api/auth/login`);

  const res = await fetch(`${AUTH_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  const body = await parseJsonSafe(res);
  console.log('Login response status:', res.status);
  console.log('Login response body:', body);

  if (!res.ok) {
    throw body ?? { error: 'login_failed' };
  }

  await setToken(body.accessToken);
  return body;
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
}): Promise<void> {
  console.log('Registering with URL:', `${AUTH_BASE_URL}/api/auth/register`);
  console.log('Register data:', data);

  try {
    const res = await fetch(`${AUTH_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log('Register response status:', res.status);
    const body = await parseJsonSafe(res);
    console.log('Register response body:', body);
    
    if (!res.ok) {
      throw body ?? { error: 'registration_failed' };
    }
  } catch (err) {
    console.log('Register fetch error:', err);
    throw err;
  }
}

export async function fetchMe(): Promise<any> {
  const token = await getToken();
  if (!token) throw { error: 'no_token' };

  const res = await fetch(`${AUTH_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await parseJsonSafe(res);
  if (!res.ok) {
    throw body ?? { error: 'fetch_failed' };
  }

  return body;
}

export async function logout(): Promise<void> {
  await removeToken();
}

// Complaint API
export async function createComplaint(data: {
  categoryCode: string;
  descriptionText: string;
  targetType: string;
  selectedDepartmentId?: string;
  selectedStatutoryBoardId?: string;
  incidentProvinceId: string;
  incidentDistrictId: string;
  incidentDsDivisionId: string;
  incidentGnDivisionId?: string;
}): Promise<any> {
  const token = await getToken();
  if (!token) throw { error: 'no_token' };

  const res = await fetch(`${COMPLAINT_BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const body = await parseJsonSafe(res);
  if (!res.ok) {
    throw body ?? { error: 'create_failed' };
  }

  return body;
}

export async function fetchMyComplaints(): Promise<any[]> {
  const token = await getToken();
  if (!token) throw { error: 'no_token' };

  const res = await fetch(`${COMPLAINT_BASE_URL}/api/complaints/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await parseJsonSafe(res);
  if (!res.ok) {
    throw body ?? { error: 'fetch_failed' };
  }

  return body;
}

export async function fetchComplaintDetails(complaintId: string): Promise<any> {
  const token = await getToken();
  if (!token) throw { error: 'no_token' };

  const res = await fetch(`${COMPLAINT_BASE_URL}/api/complaints/${complaintId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await parseJsonSafe(res);
  if (!res.ok) {
    throw body ?? { error: 'fetch_failed' };
  }

  return body;
}

export async function fetchComplaintTimeline(complaintId: string): Promise<any> {
  const token = await getToken();
  if (!token) throw { error: 'no_token' };

  const res = await fetch(`${COMPLAINT_BASE_URL}/api/complaints/${complaintId}/timeline`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await parseJsonSafe(res);
  if (!res.ok) {
    throw body ?? { error: 'fetch_failed' };
  }

  return body;
}

// Geographic API
export async function fetchProvinces(): Promise<any[]> {
  const token = await getToken();
  const res = await fetch(`${AUTH_BASE_URL}/api/geo/provinces`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const body = await parseJsonSafe(res);
  if (!res.ok) throw body ?? { error: 'fetch_failed' };
  return body;
}

export async function fetchDistricts(provinceId: string): Promise<any[]> {
  const token = await getToken();
  const res = await fetch(`${AUTH_BASE_URL}/api/geo/provinces/${provinceId}/districts`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const body = await parseJsonSafe(res);
  if (!res.ok) throw body ?? { error: 'fetch_failed' };
  return body;
}

export async function fetchDsDivisions(districtId: string): Promise<any[]> {
  const token = await getToken();
  const res = await fetch(`${AUTH_BASE_URL}/api/geo/districts/${districtId}/ds-divisions`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const body = await parseJsonSafe(res);
  if (!res.ok) throw body ?? { error: 'fetch_failed' };
  return body;
}

export async function fetchGnDivisions(dsDivisionId: string): Promise<any[]> {
  const token = await getToken();
  const res = await fetch(`${AUTH_BASE_URL}/api/geo/ds-divisions/${dsDivisionId}/gn-divisions`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const body = await parseJsonSafe(res);
  if (!res.ok) throw body ?? { error: 'fetch_failed' };
  return body;
}

// Department API
export async function fetchDepartments(): Promise<any[]> {
  const token = await getToken();
  if (!token) throw { error: 'no_token' };

  const res = await fetch(`${DEPARTMENT_BASE_URL}/api/departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await parseJsonSafe(res);
  if (!res.ok) throw body ?? { error: 'fetch_failed' };
  return body;
}

export async function fetchStatutoryBoards(departmentId?: string): Promise<any[]> {
  const token = await getToken();
  if (!token) throw { error: 'no_token' };

  const url = departmentId
    ? `${DEPARTMENT_BASE_URL}/api/departments/${departmentId}/statutory-boards`
    : `${DEPARTMENT_BASE_URL}/api/statutory-boards`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await parseJsonSafe(res);
  if (!res.ok) throw body ?? { error: 'fetch_failed' };
  return body;
}

export { getToken, setToken, removeToken };
