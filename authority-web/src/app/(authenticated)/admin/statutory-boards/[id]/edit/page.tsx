"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  fetchStatutoryBoard,
  fetchDepartments,
  updateStatutoryBoard,
  type StatutoryBoardDto,
  type DepartmentDto,
} from "@/lib/api";

export default function EditStatutoryBoardPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<StatutoryBoardDto | null>(null);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  useEffect(() => {
    loadData();
  }, [boardId]);

  const loadData = async () => {
    try {
      const [boardData, deptsData] = await Promise.all([
        fetchStatutoryBoard(boardId),
        fetchDepartments(),
      ]);
      setBoard(boardData);
      setDepartments(deptsData);
    } catch (err: any) {
      setError(err?.error ?? "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!board) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateStatutoryBoard(boardId, {
        code: board.code,
        name: board.name,
        description: board.description,
        departmentId: board.departmentId,
        boardType: board.boardType,
        establishedDate: board.establishedDate,
        websiteUrl: board.websiteUrl,
        contactEmail: board.contactEmail,
        contactPhone: board.contactPhone,
        officeAddress: board.officeAddress,
      });
      router.push("/admin/statutory-boards");
    } catch (err: any) {
      setError(err?.error ?? "Failed to update board");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Board not found
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-slate-900">Edit Statutory Board</h1>
        <p className="text-slate-500 mt-1">Update board information</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Board Code *
            </label>
            <input
              type="text"
              required
              value={board.code}
              onChange={(e) => setBoard({ ...board, code: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Board Name *
            </label>
            <input
              type="text"
              required
              value={board.name}
              onChange={(e) => setBoard({ ...board, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={board.boardType}
              onChange={(e) => setBoard({ ...board, boardType: e.target.value })}
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
              value={board.departmentId || ""}
              onChange={(e) => setBoard({ ...board, departmentId: e.target.value || null })}
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
            value={board.description || ""}
            onChange={(e) => setBoard({ ...board, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Established Date
          </label>
          <input
            type="date"
            value={board.establishedDate ? board.establishedDate.split("T")[0] : ""}
            onChange={(e) => setBoard({ ...board, establishedDate: e.target.value || null })}
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
              value={board.websiteUrl || ""}
              onChange={(e) => setBoard({ ...board, websiteUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={board.contactEmail || ""}
              onChange={(e) => setBoard({ ...board, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={board.contactPhone || ""}
              onChange={(e) => setBoard({ ...board, contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Office Address
            </label>
            <input
              type="text"
              value={board.officeAddress || ""}
              onChange={(e) => setBoard({ ...board, officeAddress: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
