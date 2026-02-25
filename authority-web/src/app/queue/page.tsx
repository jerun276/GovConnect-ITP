"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Filter,
} from "lucide-react";

import { fetchQueue, type ComplaintDto } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

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

export default function QueuePage() {
  const [items, setItems] = useState<ComplaintDto[]>([]);
  const [filteredItems, setFilteredItems] = useState<ComplaintDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetchQueue();
        if (!isMounted) return;
        setItems(res);
        setFilteredItems(res);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.error ?? "queue_fetch_failed");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = items;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.complaintCode.toLowerCase().includes(q) ||
          c.descriptionText.toLowerCase().includes(q) ||
          c.categoryCode.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    setFilteredItems(filtered);
  }, [searchQuery, statusFilter, items]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "assigned", label: "Assigned" },
    { value: "awaiting_citizen_details", label: "Awaiting Details" },
    { value: "action_taken", label: "Action Taken" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Complaint Queue</h1>
        <p className="text-slate-500 mt-1">
          Manage and respond to citizen complaints
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-500">
        Showing {filteredItems.length} of {items.length} complaints
      </div>

      {/* Complaints list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>No complaints found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200">
            {filteredItems.map((c) => (
              <Link
                key={c.id}
                href={`/complaints/${c.id}`}
                className="p-4 flex items-start gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">
                      {c.complaintCode}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm text-slate-500">{c.categoryCode}</span>
                  </div>
                  <p className="text-slate-600 mt-1 line-clamp-2">
                    {c.descriptionText}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    <span>Target: {c.targetType.replace(/_/g, " ")}</span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                    c.status
                  )}`}
                >
                  {getStatusIcon(c.status)}
                  {c.status.replace(/_/g, " ")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
