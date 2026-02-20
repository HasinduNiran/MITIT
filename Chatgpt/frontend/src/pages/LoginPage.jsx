// frontend/src/pages/LoginPage.jsx
// Login page layout (centered card).

import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
      <div className="hidden md:block">
        <div className="animate-fadeInUp rounded-2xl bg-indigo-600 p-8 text-white shadow-sm">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-indigo-100">
            Clean, secure authentication UI inspired by modern identity providers.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-indigo-100">
            <li>• JWT sessions (1 hour)</li>
            <li>• Rate-limited auth endpoints</li>
            <li>• Input validation + secure password hashing</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-full animate-fadeInUp rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-600">Use your email and password to continue.</p>
          </div>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
