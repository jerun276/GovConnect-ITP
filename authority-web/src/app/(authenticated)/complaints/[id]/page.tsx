"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Send,
  StickyNote,
  RotateCcw,
  FileQuestion,
  MessageSquare,
} from "lucide-react";

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

function fmt(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function getStatusColor(status: string): string {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "under_review":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "assigned":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "awaiting_citizen_details":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "action_taken":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "resolved":
      return "bg-green-100 text-green-700 border-green-200";
    case "closed":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function timelineIcon(type: string) {
  switch (type) {
    case "status_change":
      return <RotateCcw className="w-4 h-4" />;
    case "assignment":
      return <User className="w-4 h-4" />;
    case "internal_note":
      return <StickyNote className="w-4 h-4" />;
    case "authority_response":
      return <Send className="w-4 h-4" />;
    case "authority_details_request":
      return <FileQuestion className="w-4 h-4" />;
    case "citizen_details":
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

function timelineTitle(item: ComplaintTimelineItemDto): string {
  switch (item.type) {
    case "status_change":
      return `Status changed to ${item.toStatus?.replace(/_/g, " ") ?? ""}`;
    case "assignment":
      return `Assigned to authority`;
    case "internal_note":
      return "Internal note added";
    case "authority_response":
      return "Authority responded";
    case "authority_details_request":
      return "Details requested from citizen";
    case "citizen_details":
      return "Citizen provided details";
    default:
      return item.type.replace(/_/g, " ");
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
    []
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
  }, [id]);

  const complaint = data?.complaint;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/queue"
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Complaint Details</h1>
          <p className="text-sm text-slate-500">{complaint?.complaintCode}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      ) : complaint ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Overview & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm text-slate-500">
                    Submitted {fmt(complaint.createdAt)}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <p className="mt-1 text-slate-600 whitespace-pre-wrap">
                    {complaint.descriptionText}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Category
                    </label>
                    <p className="mt-1 text-slate-600">{complaint.categoryCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Target Type
                    </label>
                    <p className="mt-1 text-slate-600">
                      {complaint.targetType.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Timeline</h2>
              </div>
              <div className="p-4">
                {data?.timeline.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">
                    No timeline items yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data?.timeline.map((t, idx) => (
                      <div key={`${t.type}-${t.createdAt}-${idx}`} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          {timelineIcon(t.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-900">
                              {timelineTitle(t)}
                            </span>
                            <span className="text-xs text-slate-400">
                              {fmt(t.createdAt)}
                            </span>
                          </div>
                          {t.message && (
                            <p className="mt-1 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                              {t.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Actions */}
          <div className="space-y-4">
            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {actionError}
              </div>
            )}

            {/* Assign */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-medium text-slate-900 mb-3">Assign Complaint</h3>
              <div className="space-y-3">
                <input
                  value={assignedToUserId}
                  onChange={(e) => setAssignedToUserId(e.target.value)}
                  placeholder="Authority User ID (UUID)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <input
                  value={assignReason}
                  onChange={(e) => setAssignReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <button
                  onClick={async () => {
                    setActionError(null);
                    setActionBusy("assign");
                    try {
                      await assignComplaint(
                        id,
                        assignedToUserId.trim(),
                        assignReason.trim() || undefined
                      );
                      setAssignedToUserId("");
                      setAssignReason("");
                      await reload();
                    } catch (e: any) {
                      setActionError(e?.error ?? "assign_failed");
                    } finally {
                      setActionBusy(null);
                    }
                  }}
                  disabled={actionBusy !== null || !assignedToUserId.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-lg transition text-sm"
                >
                  {actionBusy === "assign" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning...
                    </span>
                  ) : (
                    "Assign"
                  )}
                </button>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-medium text-slate-900 mb-3">Request Details</h3>
              <div className="space-y-3">
                <textarea
                  value={detailsMessage}
                  onChange={(e) => setDetailsMessage(e.target.value)}
                  placeholder="Message to citizen..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                />
                <button
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
                  disabled={actionBusy !== null || !detailsMessage.trim()}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-lg transition text-sm"
                >
                  {actionBusy === "request-details" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Requesting...
                    </span>
                  ) : (
                    "Request Details"
                  )}
                </button>
              </div>
            </div>

            {/* Respond */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-medium text-slate-900 mb-3">Add Response</h3>
              <div className="space-y-3">
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Response message..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                />
                <button
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
                  disabled={actionBusy !== null || !responseMessage.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-lg transition text-sm"
                >
                  {actionBusy === "respond" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Response"
                  )}
                </button>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-medium text-slate-900 mb-3">Update Status</h3>
              <div className="space-y-3">
                <select
                  value={toStatus}
                  onChange={(e) => setToStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  {statusOptions.map((s) => (
                    <option value={s} key={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <input
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Note (optional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <button
                  onClick={async () => {
                    setActionError(null);
                    setActionBusy("status");
                    try {
                      await updateComplaintStatus(
                        id,
                        toStatus,
                        statusNote.trim() || undefined
                      );
                      setStatusNote("");
                      await reload();
                    } catch (e: any) {
                      setActionError(e?.error ?? "update_status_failed");
                    } finally {
                      setActionBusy(null);
                    }
                  }}
                  disabled={actionBusy !== null}
                  className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-medium py-2 rounded-lg transition text-sm"
                >
                  {actionBusy === "status" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    "Update Status"
                  )}
                </button>
              </div>
            </div>

            {/* Internal Note */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-medium text-slate-900 mb-3">Internal Note</h3>
              <div className="space-y-3">
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add internal note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                />
                <button
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
                  disabled={actionBusy !== null || !internalNote.trim()}
                  className="w-full bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-medium py-2 rounded-lg transition text-sm"
                >
                  {actionBusy === "internal-note" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Add Note"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
