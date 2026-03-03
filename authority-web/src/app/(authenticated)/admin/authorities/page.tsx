"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, Search, Shield, MapPin, Building } from "lucide-react";
import { fetchIdentityMe, type IdentityMeResponse } from "@/lib/api";

// Mock data for now - in real implementation, this would come from an API
const mockAuthorities: AuthorityUser[] = [
  {
    userId: "550e8400-e29b-41d4-a716-446655470001",
    fullName: "Siva Nadaraja",
    officialEmail: "officer.ds@jaffna.lk",
    officialRoleLevel: "DS",
    dsDivisionId: "550e8400-e29b-41d4-a716-446655450031",
    dsDivisionName: "Jaffna",
    status: "approved",
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655470002",
    fullName: "Kumar Swaminathan",
    officialEmail: "officer.gs@nallur.lk",
    officialRoleLevel: "GS",
    dsDivisionId: "550e8400-e29b-41d4-a716-446655450030",
    dsDivisionName: "Nallur",
    gnDivisionId: "550e8400-e29b-41d4-a716-446655460540",
    gnDivisionName: "Nallur North",
    status: "approved",
    createdAt: "2026-02-21T14:30:00Z",
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655470003",
    fullName: "Priya Rajendran",
    officialEmail: "officer.delft@ga.lk",
    officialRoleLevel: "DS",
    dsDivisionId: "550e8400-e29b-41d4-a716-446655450033",
    dsDivisionName: "Delft",
    status: "approved",
    createdAt: "2026-02-22T09:15:00Z",
  },
];

type AuthorityUser = {
  userId: string;
  fullName: string;
  officialEmail: string;
  officialRoleLevel: string;
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  dsDivisionId?: string;
  dsDivisionName?: string;
  gnDivisionId?: string;
  gnDivisionName?: string;
  departmentId?: string;
  departmentName?: string;
  status: string;
  createdAt: string;
};

export default function AuthoritiesPage() {
  const [user, setUser] = useState<IdentityMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIdentityMe()
      .then((identity) => {
        setUser(identity);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredAuthorities = mockAuthorities.filter(
    (auth) =>
      auth.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auth.officialEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auth.officialRoleLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Authority Officers</h1>
          <p className="text-slate-500 mt-1">
            Manage officers and their geographic jurisdictions
          </p>
        </div>
        <Link
          href="/admin/create-officer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Create Officer
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search officers by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Total Officers</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{mockAuthorities.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-500">DS Level</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {mockAuthorities.filter((a) => a.officialRoleLevel === "DS").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-500">GS Level</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {mockAuthorities.filter((a) => a.officialRoleLevel === "GS").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-slate-500">Dept Heads</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {mockAuthorities.filter((a) => a.officialRoleLevel === "DEPT_HEAD").length}
          </div>
        </div>
      </div>

      {/* Authorities List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Officer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAuthorities.map((authority) => (
                <tr key={authority.userId} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">
                          {authority.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {authority.fullName}
                        </div>
                        <div className="text-sm text-slate-500">{authority.officialEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                        authority.officialRoleLevel
                      )}`}
                    >
                      {authority.officialRoleLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {authority.dsDivisionName && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {authority.dsDivisionName}
                        </div>
                      )}
                      {authority.gnDivisionName && (
                        <div className="text-xs text-slate-500 ml-4">
                          GN: {authority.gnDivisionName}
                        </div>
                      )}
                      {authority.departmentName && (
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {authority.departmentName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {authority.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(authority.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAuthorities.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No officers found matching your search.
          </div>
        )}
      </div>

      {/* Geographic Reference */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Geographic Hierarchy Reference</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Jaffna District DS Divisions</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• Valikamam North, South, East, West, SW</li>
              <li>• Vadamaradchi North, East, SW</li>
              <li>• Thenmaradchi, Nallur, Jaffna</li>
              <li>• Island South, Delft, Karainagar</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Role Levels</h4>
            <ul className="space-y-1 text-slate-600">
              <li><span className="text-purple-600 font-medium">CENTRAL</span> - National level</li>
              <li><span className="text-blue-600 font-medium">PROVINCIAL</span> - Province level</li>
              <li><span className="text-cyan-600 font-medium">DSD</span> - District Secretariat</li>
              <li><span className="text-green-600 font-medium">DS</span> - Divisional Secretariat</li>
              <li><span className="text-amber-600 font-medium">GS</span> - Grama Niladhari</li>
              <li><span className="text-pink-600 font-medium">DEPT_HEAD</span> - Department Head</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
