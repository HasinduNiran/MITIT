// frontend/src/components/Dashboard.jsx
// Protected profile card showing user info.

import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, refreshProfile } = useAuth();

  async function onRefresh() {
    try {
      await refreshProfile();
      toast.success("Profile refreshed");
    } catch {
      toast.error("Failed to refresh profile");
    }
  }

  return (
    <div className="animate-fadeInUp">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900">Your profile</h2>
          <p className="text-sm text-slate-600">Authenticated via JWT (1 hour expiry)</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{user?.name}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{user?.email}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Created</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Updated</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
