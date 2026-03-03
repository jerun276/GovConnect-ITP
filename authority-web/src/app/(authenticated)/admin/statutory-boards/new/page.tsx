"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Landmark } from "lucide-react";
import {
  fetchDepartments,
  createStatutoryBoard,
  type DepartmentDto,
} from "@/lib/api";

export default function NewStatutoryBoardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    departmentId: "",
    boardType: "COMMISSION",
    establishedDate: "",
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
    officeAddress: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch {
      // Non-critical error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createStatutoryBoard({
        code: formData.code,
        name: formData.name,
        description: formData.description || null,
        departmentId: formData.departmentId || null,
        boardType: formData.boardType,
        establishedDate: formData.establishedDate || null,
        websiteUrl: formData.websiteUrl || null,
        contactEmail: formData.contactEmail || null,
        contactPhone: formData.contactPhone || null,
        officeAddress: formData.officeAddress || null,
      });
      router.push("/admin/statutory-boards");
    } catch (err: any) {
      setError(err?.error ?? "Failed to create statutory board");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/statutory-boards")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Statutory Boards
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Add Statutory Board</h1>
        <p className="text-slate-500 mt-1">Create a new statutory board or authority</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6"
      >
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Board Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., UDA, RDA, PSC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Board Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Urban Development Authority"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Board Type *
            </label>
            <select
              required
              value={formData.boardType}
              onChange={(e) => setFormData({ ...formData, boardType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="COMMISSION">Commission</option>
              <option value="AUTHORITY">Authority</option>
              <option value="BOARD">Board</option>
              <option value="CORPORATION">Corporation</option>
              <option value="COUNCIL">Council</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Parent Department
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Independent / No Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the board's responsibilities..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Established Date
          </label>
          <input
            type="date"
            value={formData.establishedDate}
            onChange={(e) => setFormData({ ...formData, establishedDate: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="contact@board.gov.lk"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+94 21 XXX XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Office Address
            </label>
            <input
              type="text"
              value={formData.officeAddress}
              onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Building, Street, City"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push("/admin/statutory-boards")}
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
            Create Statutory Board
          </button>
        </div>
      </form>
    </div>
  );
}
