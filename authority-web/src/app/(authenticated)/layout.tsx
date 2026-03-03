"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  Users,
  UserPlus,
  ClipboardList,
  LogOut,
  Shield,
  Menu,
  X,
  UserCircle,
  Building2,
  Landmark,
} from "lucide-react";

import { getAccessToken, clearAccessToken } from "@/lib/auth";
import { fetchIdentityMe, type IdentityMeResponse } from "@/lib/api";

const baseNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Complaint Queue", href: "/queue", icon: Inbox },
  { name: "My Profile", href: "/profile", icon: UserCircle },
];

const adminNavigation = [
  { name: "Authorities", href: "/admin/authorities", icon: Users },
  { name: "Pending Applications", href: "/admin/applications", icon: ClipboardList },
  { name: "Create Officer", href: "/admin/create-officer", icon: UserPlus },
  { name: "Departments", href: "/admin/departments", icon: Building2 },
  { name: "Statutory Boards", href: "/admin/statutory-boards", icon: Landmark },
];

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<IdentityMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchIdentityMe()
      .then((identity) => {
        setUser(identity);
        setIsLoading(false);
      })
      .catch(() => {
        clearAccessToken();
        router.replace("/login");
      });
  }, [router]);

  const handleLogout = () => {
    clearAccessToken();
    router.push("/login");
  };

  const isAdmin = user?.userType === "developer_admin";
  const navigation = isAdmin ? [...baseNavigation, ...adminNavigation] : baseNavigation;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-slate-900">GovConnect</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
          <div className="flex items-center gap-2 p-4 border-b border-slate-200">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900">GovConnect</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-semibold text-slate-900">GovConnect</span>
        </div>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
