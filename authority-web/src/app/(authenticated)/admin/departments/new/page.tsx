"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Building2, ArrowLeft } from "lucide-react";
import { createDepartment } from "@/lib/api";

export default function NewDepartmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    ministryName: "",
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
    officeAddress: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createDepartment({
        code: formData.code,
        name: formData.name,
        description: formData.description || null,
        ministryName: formData.ministryName || null,
        websiteUrl: formData.websiteUrl || null,
        contactEmail: formData.contactEmail || null,
        contactPhone: formData.contactPhone || null,
        officeAddress: formData.officeAddress || null,
      });
      router.push("/admin/departments");
    } catch (err: any) {
      setError(err?.error ?? "Failed to create department");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/departments")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Departments
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Add Department</h1>
        <p className="text-slate-500 mt-1">Create a new government department</p>
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
              Department Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., EDU, HEALTH, PWD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Ministry of Education"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ministry Name
          </label>
          <input
            type="text"
            value={formData.ministryName}
            onChange={(e) => setFormData({ ...formData, ministryName: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Ministry of Education, Northern Province"
          />
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
            placeholder="Brief description of the department's responsibilities..."
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
              placeholder="contact@department.gov.lk"
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
            onClick={() => router.push("/admin/departments")}
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
            Create Department
          </button>
        </div>
      </form>
    </div>
  );
}
