"use client";

import { useEffect, useState } from "react";
import { Check, X, Loader2, Clock } from "lucide-react";
import { fetchPendingApplications, approveApplication, rejectApplication, type AuthorityApplication } from "@/lib/api";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<AuthorityApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await fetchPendingApplications();
      setApplications(data);
    } catch (err: any) {
      setError(err?.error ?? "Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    try {
      await approveApplication(userId);
      setApplications(applications.filter((a) => a.userId !== userId));
    } catch (err: any) {
      alert(err?.error ?? "Failed to approve application");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this application?")) return;
    setProcessingId(userId);
    try {
      await rejectApplication(userId);
      setApplications(applications.filter((a) => a.userId !== userId));
    } catch (err: any) {
      alert(err?.error ?? "Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  const formatJurisdiction = (app: AuthorityApplication) => {
    if (app.gnDivisionId) return "GS Level (GN Division)";
    if (app.dsDivisionId) return "DS Level (DS Division)";
    if (app.districtId) return "DSD Level (District)";
    if (app.provinceId) return "Provincial Level";
    return "Central Level";
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pending Applications</h1>
        <p className="text-slate-500 mt-1">
          Review and approve authority officer applications
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No Pending Applications</h3>
          <p className="text-slate-500 mt-1">
            All authority applications have been processed.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200">
            {applications.map((app) => (
              <div key={app.userId} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900">{app.fullName}</h3>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        {app.officialRoleLevel}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{app.officialEmail}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-slate-600">
                        <span className="font-medium">Jurisdiction:</span> {formatJurisdiction(app)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-4 h-4" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(app.userId)}
                      disabled={processingId === app.userId}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Reject"
                    >
                      {processingId === app.userId ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleApprove(app.userId)}
                      disabled={processingId === app.userId}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                      title="Approve"
                    >
                      {processingId === app.userId ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
