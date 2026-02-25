"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inbox, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { fetchQueue, type ComplaintDto } from "@/lib/api";

function getStatusColor(status: string): string {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-700";
    case "under_review":
      return "bg-amber-100 text-amber-700";
    case "assigned":
      return "bg-purple-100 text-purple-700";
    case "awaiting_citizen_details":
      return "bg-orange-100 text-orange-700";
    case "action_taken":
      return "bg-cyan-100 text-cyan-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    case "closed":
      return "bg-slate-100 text-slate-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "submitted":
      return <Inbox className="w-4 h-4" />;
    case "under_review":
      return <Clock className="w-4 h-4" />;
    case "resolved":
      return <CheckCircle2 className="w-4 h-4" />;
    case "rejected":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<ComplaintDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchQueue();
        if (!isMounted) return;
        setComplaints(data);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.error ?? "Failed to load complaints");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = {
    total: complaints.length,
    submitted: complaints.filter((c) => c.status === "submitted").length,
    underReview: complaints.filter((c) => c.status === "under_review").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome to GovConnect Authority Portal
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500">Total Complaints</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500">Submitted</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.submitted}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500">Under Review</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{stats.underReview}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500">Resolved</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Complaints</h2>
          <Link
            href="/queue"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : recentComplaints.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No complaints found in your queue.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {recentComplaints.map((c) => (
              <Link
                key={c.id}
                href={`/complaints/${c.id}`}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {c.complaintCode}
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                    {c.descriptionText}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(c.createdAt).toLocaleDateString()} · {c.categoryCode}
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    c.status
                  )}`}
                >
                  {getStatusIcon(c.status)}
                  {c.status.replace(/_/g, " ")}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
