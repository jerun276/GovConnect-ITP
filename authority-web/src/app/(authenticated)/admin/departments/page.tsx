"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Building2,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  fetchDepartments,
  deleteDepartment,
  type DepartmentDto,
} from "@/lib/api";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    const filtered = departments.filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ministryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDepartments(filtered);
  }, [departments, searchQuery]);

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err: any) {
      setError(err?.error ?? "Failed to load departments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    setDeletingId(id);
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err?.error ?? "Failed to delete department");
    } finally {
      setDeletingId(null);
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
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-slate-500 mt-1">
            Manage government departments and ministries
          </p>
        </div>
        <Link
          href="/admin/departments/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search departments by name, code, or ministry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Total Departments</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {departments.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-slate-500">Active</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {departments.filter((d) => d.isActive).length}
          </div>
        </div>
      </div>

      {/* Departments List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Ministry
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {dept.name}
                        </div>
                        <div className="text-xs text-slate-500">{dept.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      {dept.ministryName ?? "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      {dept.contactEmail && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <Mail className="w-3 h-3" />
                          {dept.contactEmail}
                        </div>
                      )}
                      {dept.contactPhone && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <Phone className="w-3 h-3" />
                          {dept.contactPhone}
                        </div>
                      )}
                      {!dept.contactEmail && !dept.contactPhone && (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        dept.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/departments/${dept.id}/edit`}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {dept.websiteUrl && (
                        <a
                          href={dept.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Visit Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(dept.id)}
                        disabled={deletingId === dept.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === dept.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDepartments.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            {searchQuery
              ? "No departments match your search."
              : "No departments found. Create your first department."}
          </div>
        )}
      </div>
    </div>
  );
}
