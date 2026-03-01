import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Github,
  Loader2,
} from "lucide-react";
import { signUp, signIn, signInWithGitHub } from "../services/supabase";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        const data = await signUp(email.trim(), password);
        if (data?.user?.identities?.length === 0) {
          setError(
            "An account with this email already exists. Try logging in.",
          );
        } else if (data?.session) {
          // Auto-confirmed — proceed
          onAuth(data.session);
        } else {
          setSuccess("Check your email for a confirmation link, then log in!");
          setMode("login");
        }
      } else {
        const data = await signIn(email.trim(), password);
        if (data?.session) {
          onAuth(data.session);
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
    setLoading(false);
  }

  async function handleGitHub() {
    setLoading(true);
    setError("");
    try {
      await signInWithGitHub();
      // Redirect happens automatically — Supabase handles the OAuth flow
    } catch (err) {
      setError(err.message || "GitHub sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-6">
      {/* Logo + Brand */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-purple mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-orange/20">
          <Flame size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Energetic
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          AI-Powered Fitness Accountability
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm"
      >
        {/* Tab switcher */}
        <div className="flex gap-1 bg-dark-700/50 rounded-xl p-1 mb-6">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                mode === m
                  ? "bg-brand-orange text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="email"
              className="input-field pl-10 text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type={showPass ? "text" : "password"}
              className="input-field pl-10 pr-10 text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error / Success messages */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg p-3"
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : mode === "login" ? (
              <>
                <LogIn size={18} /> Log In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-600" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-dark-900 px-3 text-gray-500">
              or continue with
            </span>
          </div>
        </div>

        {/* Social login */}
        <button
          onClick={handleGitHub}
          disabled={loading}
          className="w-full glass-card py-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:border-gray-500/50 transition-colors"
        >
          <Github size={18} /> GitHub
        </button>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Your data syncs across all devices securely
        </p>
      </motion.div>
    </div>
  );
}
