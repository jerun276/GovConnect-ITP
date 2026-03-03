"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Copy, Check, Loader2 } from "lucide-react";
import { createAuthorityOfficer, type CreateAuthorityResponse } from "@/lib/api";

const roleLevels = [
  { value: "CENTRAL", label: "Central Level", requires: null },
  { value: "PROVINCIAL", label: "Provincial Level", requires: "provinceId" },
  { value: "DSD", label: "District Secretariat", requires: "districtId" },
  { value: "DS", label: "Divisional Secretariat", requires: "dsDivisionId" },
  { value: "GS", label: "Grama Niladhari", requires: "gnDivisionId" },
  { value: "DEPT_HEAD", label: "Department Head", requires: "departmentId" },
];

// Jaffna District geographic IDs
const jaffnaProvinceId = "550e8400-e29b-41d4-a716-446655440004";
const jaffnaDistrictId = "550e8400-e29b-41d4-a716-446655444001";

const dsDivisions = [
  { id: "550e8400-e29b-41d4-a716-446655450021", name: "Valikamam North" },
  { id: "550e8400-e29b-41d4-a716-446655450022", name: "Valikamam South" },
  { id: "550e8400-e29b-41d4-a716-446655450023", name: "Valikamam East" },
  { id: "550e8400-e29b-41d4-a716-446655450024", name: "Valikamam West" },
  { id: "550e8400-e29b-41d4-a716-446655450025", name: "Valikamam South West" },
  { id: "550e8400-e29b-41d4-a716-446655450026", name: "Vadamaradchi North" },
  { id: "550e8400-e29b-41d4-a716-446655450027", name: "Vadamaradchi East" },
  { id: "550e8400-e29b-41d4-a716-446655450028", name: "Vadamaradchi South West" },
  { id: "550e8400-e29b-41d4-a716-446655450029", name: "Thenmaradchi" },
  { id: "550e8400-e29b-41d4-a716-446655450030", name: "Nallur" },
  { id: "550e8400-e29b-41d4-a716-446655450031", name: "Jaffna" },
  { id: "550e8400-e29b-41d4-a716-446655450032", name: "Island South (Velanai)" },
  { id: "550e8400-e29b-41d4-a716-446655450033", name: "Delft" },
  { id: "550e8400-e29b-41d4-a716-446655450034", name: "Karainagar" },
];

// Sample GN divisions for Nallur DS
const gnDivisionsNallur = [
  { id: "550e8400-e29b-41d4-a716-446655460540", name: "Nallur North" },
  { id: "550e8400-e29b-41d4-a716-446655460541", name: "Nallur South" },
  { id: "550e8400-e29b-41d4-a716-446655460542", name: "Nallur Centre" },
  { id: "550e8400-e29b-41d4-a716-446655460543", name: "Nallur East" },
  { id: "550e8400-e29b-41d4-a716-446655460544", name: "Nallur West" },
];

export default function CreateOfficerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOfficer, setCreatedOfficer] = useState<CreateAuthorityResponse | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    officialEmail: "",
    officialRoleLevel: "DS",
    provinceId: jaffnaProvinceId,
    districtId: jaffnaDistrictId,
    dsDivisionId: "",
    gnDivisionId: "",
    departmentId: "",
  });

  const selectedRole = roleLevels.find((r) => r.value === formData.officialRoleLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data: Parameters<typeof createAuthorityOfficer>[0] = {
        fullName: formData.fullName,
        officialEmail: formData.officialEmail,
        officialRoleLevel: formData.officialRoleLevel,
      };

      if (selectedRole?.requires === "provinceId") data.provinceId = formData.provinceId;
      if (selectedRole?.requires === "districtId") data.districtId = formData.districtId;
      if (selectedRole?.requires === "dsDivisionId") data.dsDivisionId = formData.dsDivisionId;
      if (selectedRole?.requires === "gnDivisionId") {
        data.gnDivisionId = formData.gnDivisionId;
        data.dsDivisionId = formData.dsDivisionId;
      }
      if (selectedRole?.requires === "departmentId") data.departmentId = formData.departmentId;

      const response = await createAuthorityOfficer(data);
      setCreatedOfficer(response);
    } catch (err: any) {
      setError(err?.error ?? "Failed to create officer");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    if (createdOfficer?.passwordSetupToken) {
      navigator.clipboard.writeText(createdOfficer.passwordSetupToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setCreatedOfficer(null);
    setFormData({
      fullName: "",
      officialEmail: "",
      officialRoleLevel: "DS",
      provinceId: jaffnaProvinceId,
      districtId: jaffnaDistrictId,
      dsDivisionId: "",
      gnDivisionId: "",
      departmentId: "",
    });
  };

  if (createdOfficer) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 text-center mb-2">
            Officer Created Successfully
          </h2>
          <p className="text-slate-500 text-center mb-6">
            Share the password setup token with the officer to complete registration.
          </p>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">User ID</label>
              <div className="mt-1 text-sm text-slate-600 font-mono break-all">
                {createdOfficer.userId}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password Setup Token</label>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-sm font-mono break-all">
                  {createdOfficer.passwordSetupToken}
                </code>
                <button
                  onClick={copyToken}
                  className="p-2 hover:bg-slate-200 rounded-lg transition"
                  title="Copy token"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Expires At</label>
              <div className="mt-1 text-sm text-slate-600">
                {new Date(createdOfficer.expiresAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Create Another Officer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Authority Officer</h1>
        <p className="text-slate-500 mt-1">
          Create a new officer account with geographic jurisdiction
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Siva Nadaraja"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Official Email
            </label>
            <input
              type="email"
              required
              value={formData.officialEmail}
              onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., officer@jaffna.lk"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role Level
            </label>
            <select
              value={formData.officialRoleLevel}
              onChange={(e) => setFormData({ ...formData, officialRoleLevel: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roleLevels.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {selectedRole?.requires === "provinceId" && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Province
              </label>
              <select
                value={formData.provinceId}
                onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={jaffnaProvinceId}>Northern Province</option>
              </select>
            </div>
          )}

          {selectedRole?.requires === "districtId" && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                District
              </label>
              <select
                value={formData.districtId}
                onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={jaffnaDistrictId}>Jaffna District</option>
              </select>
            </div>
          )}

          {selectedRole?.requires === "dsDivisionId" && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                DS Division
              </label>
              <select
                required
                value={formData.dsDivisionId}
                onChange={(e) => setFormData({ ...formData, dsDivisionId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select DS Division</option>
                {dsDivisions.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedRole?.requires === "gnDivisionId" && (
            <div className="p-4 bg-blue-50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  DS Division
                </label>
                <select
                  required
                  value={formData.dsDivisionId}
                  onChange={(e) => setFormData({ ...formData, dsDivisionId: e.target.value, gnDivisionId: "" })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select DS Division</option>
                  {dsDivisions.slice(8, 12).map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.name}
                    </option>
                  ))}
                </select>
              </div>
              {formData.dsDivisionId === "550e8400-e29b-41d4-a716-446655450030" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    GN Division
                  </label>
                  <select
                    required
                    value={formData.gnDivisionId}
                    onChange={(e) => setFormData({ ...formData, gnDivisionId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select GN Division</option>
                    {gnDivisionsNallur.map((gn) => (
                      <option key={gn.id} value={gn.id}>
                        {gn.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced Options
          </button>

          {showAdvanced && (
            <div className="p-4 bg-slate-50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department ID (optional)
                </label>
                <input
                  type="text"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="UUID for department (if DEPT_HEAD role)"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push("/admin/authorities")}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Officer
          </button>
        </div>
      </form>
    </div>
  );
}
