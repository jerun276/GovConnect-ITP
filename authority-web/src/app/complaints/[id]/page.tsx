"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addAuthorityResponse,
  addInternalNote,
  assignComplaint,
  fetchComplaintTimeline,
  requestCitizenDetails,
  updateComplaintStatus,
  type ComplaintTimelineItemDto,
  type ComplaintTimelineResponse,
} from "@/lib/api";
import { clearAccessToken, getAccessToken } from "@/lib/auth";

function fmt(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function timelineTitle(item: ComplaintTimelineItemDto): string {
  switch (item.type) {
    case "status_change":
      return `Status: ${item.fromStatus ?? ""} -> ${item.toStatus ?? ""}`;
    case "assignment":
      return `Assignment: ${item.assignedToUserId ?? ""}`;
    case "internal_note":
      return "Internal note";
    case "authority_response":
      return "Authority response";
    case "authority_details_request":
      return "Details requested";
    case "citizen_details":
      return "Citizen details";
    default:
      return item.type;
  }
}

export default function ComplaintDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;

  const statusOptions = useMemo(
    () => [
      "submitted",
      "under_review",
      "assigned",
      "awaiting_citizen_details",
      "action_taken",
      "resolved",
      "closed",
      "rejected",
    ],
    [],
  );

  const [data, setData] = useState<ComplaintTimelineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assignedToUserId, setAssignedToUserId] = useState("");
  const [assignReason, setAssignReason] = useState("");

  const [detailsMessage, setDetailsMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const [toStatus, setToStatus] = useState(statusOptions[1] ?? "under_review");
  const [statusNote, setStatusNote] = useState("");

  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function reload() {
    const res = await fetchComplaintTimeline(id);
    setData(res);
  }

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const res = await fetchComplaintTimeline(id);
        if (!isMounted) return;
        setData(res);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.error ?? "complaint_load_failed");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, router]);

  const complaint = data?.complaint;

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/queue">Back</Link>
          <h1 style={{ margin: 0, fontSize: 20 }}>Complaint Details</h1>
        </div>

        <button
          type="button"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          onClick={() => {
            clearAccessToken();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>

      {isLoading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "#b00020" }}>{error}</p> : null}

      {!isLoading && !error && complaint ? (
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, alignItems: "start" }}>
          <section style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: 12 }}>
            <h2 style={{ marginTop: 0, fontSize: 16 }}>Overview</h2>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 6, columnGap: 12 }}>
              <div style={{ color: "#555" }}>ID</div>
              <div style={{ fontFamily: "monospace" }}>{complaint.id}</div>

              <div style={{ color: "#555" }}>Code</div>
              <div>{complaint.complaintCode}</div>

              <div style={{ color: "#555" }}>Status</div>
              <div>{complaint.status}</div>

              <div style={{ color: "#555" }}>Category</div>
              <div>{complaint.categoryCode}</div>

              <div style={{ color: "#555" }}>Target Type</div>
              <div>{complaint.targetType}</div>

              <div style={{ color: "#555" }}>Submitted By</div>
              <div style={{ fontFamily: "monospace" }}>{complaint.submittedByUserId}</div>

              <div style={{ color: "#555" }}>Created At</div>
              <div>{fmt(complaint.createdAt)}</div>

              <div style={{ color: "#555" }}>Updated At</div>
              <div>{fmt(complaint.updatedAt)}</div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ color: "#555", marginBottom: 6 }}>Description</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{complaint.descriptionText}</div>
            </div>

            <h2 style={{ marginTop: 20, fontSize: 16 }}>Timeline</h2>
            {data.timeline.length === 0 ? <p>No timeline items.</p> : null}
            <div style={{ display: "grid", gap: 10 }}>
              {data.timeline.map((t, idx) => (
                <div key={`${t.type}-${t.createdAt}-${idx}`} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 600 }}>{timelineTitle(t)}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{fmt(t.createdAt)}</div>
                  </div>
                  {t.actorUserId ? (
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      actor: <span style={{ fontFamily: "monospace" }}>{t.actorUserId}</span>
                    </div>
                  ) : null}
                  {t.message ? <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{t.message}</div> : null}
                </div>
              ))}
            </div>
          </section>

          <aside style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: 12 }}>
            <h2 style={{ marginTop: 0, fontSize: 16 }}>Actions</h2>

            {actionError ? <p style={{ color: "#b00020" }}>{actionError}</p> : null}

            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Assign</div>
                <input
                  value={assignedToUserId}
                  onChange={(e) => setAssignedToUserId(e.target.value)}
                  placeholder="assignedToUserId (UUID)"
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />
                <input
                  value={assignReason}
                  onChange={(e) => setAssignReason(e.target.value)}
                  placeholder="reason (optional)"
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 8 }}
                />
                <button
                  type="button"
                  disabled={actionBusy !== null}
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                  onClick={async () => {
                    setActionError(null);
                    setActionBusy("assign");
                    try {
                      await assignComplaint(id, assignedToUserId.trim(), assignReason.trim() || undefined);
                      setAssignedToUserId("");
                      setAssignReason("");
                      await reload();
                    } catch (e: any) {
                      setActionError(e?.error ?? "assign_failed");
                    } finally {
                      setActionBusy(null);
                    }
                  }}
                >
                  {actionBusy === "assign" ? "Assigning..." : "Assign"}
                </button>
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Request citizen details</div>
                <textarea
                  value={detailsMessage}
                  onChange={(e) => setDetailsMessage(e.target.value)}
                  placeholder="message"
                  rows={3}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />
                <button
                  type="button"
                  disabled={actionBusy !== null}
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                  onClick={async () => {
                    setActionError(null);
                    setActionBusy("request-details");
                    try {
                      await requestCitizenDetails(id, detailsMessage);
                      setDetailsMessage("");
                      await reload();
                    } catch (e: any) {
                      setActionError(e?.error ?? "request_details_failed");
                    } finally {
                      setActionBusy(null);
                    }
                  }}
                >
                  {actionBusy === "request-details" ? "Submitting..." : "Request details"}
                </button>
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Respond</div>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="message"
                  rows={3}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />
                <button
                  type="button"
                  disabled={actionBusy !== null}
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                  onClick={async () => {
                    setActionError(null);
                    setActionBusy("respond");
                    try {
                      await addAuthorityResponse(id, responseMessage);
                      setResponseMessage("");
                      await reload();
                    } catch (e: any) {
                      setActionError(e?.error ?? "add_response_failed");
                    } finally {
                      setActionBusy(null);
                    }
                  }}
                >
                  {actionBusy === "respond" ? "Submitting..." : "Send response"}
                </button>
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Update status</div>
                <select
                  value={toStatus}
                  onChange={(e) => setToStatus(e.target.value)}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                >
                  {statusOptions.map((s) => (
                    <option value={s} key={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="note (optional)"
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 8 }}
                />
                <button
                  type="button"
                  disabled={actionBusy !== null}
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                  onClick={async () => {
                    setActionError(null);
                    setActionBusy("status");
                    try {
                      await updateComplaintStatus(id, toStatus, statusNote.trim() || undefined);
                      setStatusNote("");
                      await reload();
                    } catch (e: any) {
                      setActionError(e?.error ?? "update_status_failed");
                    } finally {
                      setActionBusy(null);
                    }
                  }}
                >
                  {actionBusy === "status" ? "Updating..." : "Update status"}
                </button>
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Internal note</div>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="note"
                  rows={3}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />
                <button
                  type="button"
                  disabled={actionBusy !== null}
                  style={{ marginTop: 8, width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                  onClick={async () => {
                    setActionError(null);
                    setActionBusy("internal-note");
                    try {
                      await addInternalNote(id, internalNote);
                      setInternalNote("");
                      await reload();
                    } catch (e: any) {
                      setActionError(e?.error ?? "add_internal_note_failed");
                    } finally {
                      setActionBusy(null);
                    }
                  }}
                >
                  {actionBusy === "internal-note" ? "Saving..." : "Add internal note"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
