"use client";

import { useEffect, useState } from "react";
import { Loader2, Shield, MapPin, Building, Mail, User, Crown } from "lucide-react";
import { fetchIdentityMe, type IdentityMeResponse } from "@/lib/api";

const dsDivisionMap: Record<string, string> = {
  "550e8400-e29b-41d4-a716-446655450021": "Valikamam North",
  "550e8400-e29b-41d4-a716-446655450022": "Valikamam South",
  "550e8400-e29b-41d4-a716-446655450023": "Valikamam East",
  "550e8400-e29b-41d4-a716-446655450024": "Valikamam West",
  "550e8400-e29b-41d4-a716-446655450025": "Valikamam South West",
  "550e8400-e29b-41d4-a716-446655450026": "Vadamaradchi North",
  "550e8400-e29b-41d4-a716-446655450027": "Vadamaradchi East",
  "550e8400-e29b-41d4-a716-446655450028": "Vadamaradchi South West",
  "550e8400-e29b-41d4-a716-446655450029": "Thenmaradchi",
  "550e8400-e29b-41d4-a716-446655450030": "Nallur",
  "550e8400-e29b-41d4-a716-446655450031": "Jaffna",
  "550e8400-e29b-41d4-a716-446655450032": "Island South (Velanai)",
  "550e8400-e29b-41d4-a716-446655450033": "Delft",
  "550e8400-e29b-41d4-a716-446655450034": "Karainagar",
};

const getDsDivisionName = (id: string | null | undefined): string => {
  if (!id) return "Unknown";
  return dsDivisionMap[id] ?? "Unknown Division";
};

export default function ProfilePage() {
  const [user, setUser] = useState<IdentityMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdentityMe()
      .then((identity) => {
        setUser(identity);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err?.error ?? "Failed to load profile");
        setIsLoading(false);
      });
  }, []);

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "CENTRAL":
        return "Central Level Officer";
      case "PROVINCIAL":
        return "Provincial Level Officer";
      case "DSD":
        return "District Secretariat";
      case "DS":
        return "Divisional Secretariat Officer";
      case "GS":
        return "Grama Niladhari Officer";
      case "DEPT_HEAD":
        return "Department Head";
      default:
        return "Authority Officer";
    }
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "CENTRAL":
        return "bg-purple-100 text-purple-700";
      case "PROVINCIAL":
        return "bg-blue-100 text-blue-700";
      case "DSD":
        return "bg-cyan-100 text-cyan-700";
      case "DS":
        return "bg-green-100 text-green-700";
      case "GS":
        return "bg-amber-100 text-amber-700";
      case "DEPT_HEAD":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getUserTypeIcon = (userType: string) => {
    if (userType === "developer_admin") {
      return <Crown className="w-5 h-5 text-amber-500" />;
    }
    return <Shield className="w-5 h-5 text-blue-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error ?? "Failed to load profile"}
      </div>
    );
  }

  const isAdmin = user.userType === "developer_admin";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">View your account details and jurisdiction</p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl font-bold text-white">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{user.username}</h2>
                {getUserTypeIcon(user.userType)}
              </div>
              <p className="text-blue-100">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    isAdmin ? "bg-amber-200 text-amber-800" : "bg-white/20 text-white"
                  }`}
                >
                  {isAdmin ? "System Administrator" : getRoleLabel(user.officialRoleLevel)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Account Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="text-xs text-slate-500 uppercase">User ID</label>
                <div className="text-sm font-mono text-slate-700 break-all">{user.userId}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="text-xs text-slate-500 uppercase">User Type</label>
                <div className="text-sm text-slate-700 capitalize">{user.userType.replace(/_/g, " ")}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="text-xs text-slate-500 uppercase">Email</label>
                <div className="text-sm text-slate-700 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="text-xs text-slate-500 uppercase">Username</label>
                <div className="text-sm text-slate-700">{user.username}</div>
              </div>
            </div>
          </div>

          {/* Jurisdiction */}
          {!isAdmin && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Jurisdiction
              </h3>
              <div className="space-y-3">
                {user.officialRoleLevel && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Role Level</div>
                        <div className="text-xs text-slate-500">Your authority level</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeColor(user.officialRoleLevel)}`}>
                      {user.officialRoleLevel}
                    </span>
                  </div>
                )}

                {user.provinceId && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Province</div>
                        <div className="text-xs text-slate-500 font-mono">{user.provinceId}</div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">Northern Province</span>
                  </div>
                )}

                {user.districtId && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">District</div>
                        <div className="text-xs text-slate-500 font-mono">{user.districtId}</div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">Jaffna</span>
                  </div>
                )}

                {user.dsDivisionId && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">DS Division</div>
                        <div className="text-xs text-slate-500 font-mono">{user.dsDivisionId}</div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">{getDsDivisionName(user.dsDivisionId)}</span>
                  </div>
                )}

                {user.gnDivisionId && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">GN Division</div>
                        <div className="text-xs text-slate-500 font-mono">{user.gnDivisionId}</div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">Your GN Division</span>
                  </div>
                )}

                {user.departmentId && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Department</div>
                        <div className="text-xs text-slate-500 font-mono">{user.departmentId}</div>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">Your Department</span>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-sm font-medium text-amber-800 mb-1">Complaint Visibility</h4>
                <p className="text-sm text-amber-700">
                  You can view and manage complaints within your assigned jurisdiction. 
                  Complaints are automatically filtered based on your role level and geographic assignments.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
