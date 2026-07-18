// Central typed API client for the HungerMap PK backend.
// All pages import from here so there is a single source of truth for the base
// URL and request/response shapes.

import type {
  Case,
  CaseCreate,
  CaseUpdate,
  ContactCreate,
  ContactMessage,
  Organisation,
  OrganisationCreate,
  Referral,
  StatsOverview,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new ApiError(
      `Could not reach the server at ${API_URL}. Is the backend running?`,
      0
    );
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) {
        detail =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      /* non-JSON error body — keep default message */
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---- Cases ----------------------------------------------------------------

export const casesApi = {
  list: (params?: { city?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.city) qs.set("city", params.city);
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    return request<Case[]>(`/cases/${q ? `?${q}` : ""}`);
  },
  get: (id: number) => request<Case>(`/cases/${id}`),
  create: (data: CaseCreate) =>
    request<Case>(`/cases/`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: CaseUpdate) =>
    request<Case>(`/cases/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: number) =>
    request<void>(`/cases/${id}`, { method: "DELETE" }),
  triage: (id: number) =>
    request<Referral>(`/cases/${id}/triage`, { method: "POST" }),
  referrals: (id: number) => request<Referral[]>(`/cases/${id}/referrals`),
};

// ---- Organisations --------------------------------------------------------

export const orgsApi = {
  list: (params?: { city?: string; active_only?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.city) qs.set("city", params.city);
    if (params?.active_only === false) qs.set("active_only", "false");
    const q = qs.toString();
    return request<Organisation[]>(`/organisations/${q ? `?${q}` : ""}`);
  },
  create: (data: OrganisationCreate) =>
    request<Organisation>(`/organisations/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<OrganisationCreate>) =>
    request<Organisation>(`/organisations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: number) =>
    request<void>(`/organisations/${id}`, { method: "DELETE" }),
};

// ---- Contact --------------------------------------------------------------

export const contactApi = {
  create: (data: ContactCreate) =>
    request<ContactMessage>(`/contact/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  list: () => request<ContactMessage[]>(`/contact/`),
  markRead: (id: number) =>
    request<ContactMessage>(`/contact/${id}/read`, { method: "PATCH" }),
};

// ---- Stats ----------------------------------------------------------------

export const statsApi = {
  overview: () => request<StatsOverview>(`/stats/overview`),
};
