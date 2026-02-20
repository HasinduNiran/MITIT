// frontend/src/pages/RegisterPage.jsx
// Registration page layout.

import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
      <div className="hidden md:block">
        <div className="animate-fadeInUp rounded-2xl bg-slate-900 p-8 text-white shadow-sm">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-2 text-slate-200">A professional sign-up flow with strong UX and security defaults.</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-200">
            <li>• Real-time validation</li>
            <li>• Password strength indicator</li>
            <li>• Smooth transitions and toasts</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-full animate-fadeInUp rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Sign up</h2>
            <p className="mt-1 text-sm text-slate-600">Create your account in under a minute.</p>
          </div>
          <div className="mt-6">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
