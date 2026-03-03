"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Filter, MapPin, Building, Search, RefreshCw } from "lucide-react";
import { fetchQueue, fetchIdentityMe, type ComplaintDto, type IdentityMeResponse } from "@/lib/api";

export default function QueuePage() {
  const [complaints, setComplaints] = useState<ComplaintDto[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<ComplaintDto[]>([]);
  const [user, setUser] = useState<IdentityMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, searchQuery, statusFilter, jurisdictionFilter, user]);

  const loadData = async () => {
    try {
      const [queueData, identityData] = await Promise.all([
        fetchQueue(),
        fetchIdentityMe(),
      ]);
      setComplaints(queueData);
      setUser(identityData);
    } catch (err: any) {
      setError(err?.error ?? "Failed to load queue");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...complaints];

    // Apply jurisdiction filter based on user's DS/GN division
    if (jurisdictionFilter && user) {
      // If user has GN division, only show complaints in that GN
      if (user.gnDivisionId) {
        filtered = filtered.filter(
          (c) => c.incidentGnDivisionId === user.gnDivisionId
        );
      }
      // If user has DS division (but not GN), show complaints in that DS
      else if (user.dsDivisionId) {
        filtered = filtered.filter(
          (c) => c.incidentDsDivisionId === user.dsDivisionId
        );
      }
      // If user has district, show complaints in that district
      else if (user.districtId) {
        filtered = filtered.filter(
          (c) => c.incidentDistrictId === user.districtId
        );
      }
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.complaintCode.toLowerCase().includes(query) ||
          c.descriptionText.toLowerCase().includes(query) ||
          c.categoryCode.toLowerCase().includes(query)
      );
    }

    setFilteredComplaints(filtered);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-slate-100 text-slate-700";
      case "under_review":
        return "bg-amber-100 text-amber-700";
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "action_taken":
        return "bg-purple-100 text-purple-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getJurisdictionLabel = (c: ComplaintDto) => {
    if (c.incidentGnDivisionId) return "GN Level";
    if (c.incidentDsDivisionId) return "DS Level";
    if (c.incidentDistrictId) return "District Level";
    return "Province Level";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaint Queue</h1>
          <p className="text-slate-500 mt-1">
            Manage and process citizen complaints
            {user?.gnDivisionId && " in your GN Division"}
            {user?.dsDivisionId && !user?.gnDivisionId && " in your DS Division"}
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="action_taken">Action Taken</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Jurisdiction Filter */}
        {(user?.dsDivisionId || user?.gnDivisionId) && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-600" />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={jurisdictionFilter}
                onChange={(e) => setJurisdictionFilter(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-slate-700">
                Show only complaints in my jurisdiction
                {user?.gnDivisionId && " (GN Division)"}
                {user?.dsDivisionId && !user?.gnDivisionId && " (DS Division)"}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-slate-900">{complaints.length}</div>
          <div className="text-sm text-slate-500">Total Complaints</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-slate-900">{filteredComplaints.length}</div>
          <div className="text-sm text-slate-500">Filtered Results</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-amber-600">
            {complaints.filter((c) => c.status === "under_review").length}
          </div>
          <div className="text-sm text-slate-500">Under Review</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {complaints.filter((c) => c.status === "resolved").length}
          </div>
          <div className="text-sm text-slate-500">Resolved</div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Jurisdiction
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-4">
                    <Link
                      href={`/complaints/${complaint.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {complaint.complaintCode}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                      {complaint.categoryCode}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {complaint.descriptionText}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="w-3 h-3" />
                      {getJurisdictionLabel(complaint)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredComplaints.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            {complaints.length === 0
              ? "No complaints in the queue."
              : "No complaints match your filters."}
          </div>
        )}
      </div>
    </div>
  );
}
