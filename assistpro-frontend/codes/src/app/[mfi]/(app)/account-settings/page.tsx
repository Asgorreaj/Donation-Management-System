"use client";

import { useEffect, useState } from "react";
import { authApiFetch } from "@/helpers/httpClient";
import Swal from "sweetalert2";

const AccountSettingsPage = () => {
  const [profile, setProfile] = useState<{ username?: string; email?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    authApiFetch("me", { method: "GET" })
      .then((res) => setProfile(res))
      .catch(() => setError("Could not load your account details."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.new_password !== form.confirm_password) {
      setError("New password and confirmation don't match.");
      return;
    }
    if (form.new_password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      const body = new URLSearchParams({
        current_password: form.current_password,
        new_password: form.new_password,
      }).toString();

      const res = await authApiFetch("change-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (res?.status === 200) {
        await Swal.fire({ icon: "success", title: "Password updated", confirmButtonColor: "#C08829" });
        setForm({ current_password: "", new_password: "", confirm_password: "" });
      } else {
        setError(res?.messages?.error || "Could not update password.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-dim">Account</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Account settings</h1>
      <p className="mt-1 text-sm text-ink/60">Your sign-in details and password, kept in one place.</p>

      {/* PROFILE CARD */}
      <div className="mt-6 rounded-md border border-paper-line bg-paper-card p-5 shadow-[0_1px_2px_rgba(20,52,43,0.06)]">
        <h2 className="font-display text-lg font-semibold text-ink">Profile</h2>
        {loading ? (
          <p className="mt-3 text-sm text-ink/40">Loading…</p>
        ) : (
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">Username</dt>
              <dd className="mt-1 text-sm font-medium text-ink">{profile.username ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">Email</dt>
              <dd className="mt-1 text-sm font-medium text-ink">{profile.email ?? "—"}</dd>
            </div>
          </dl>
        )}
      </div>

      {/* PASSWORD CARD */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-md border border-paper-line bg-paper-card p-5 shadow-[0_1px_2px_rgba(20,52,43,0.06)]"
      >
        <h2 className="font-display text-lg font-semibold text-ink">Change password</h2>
        <p className="mt-1 text-sm text-ink/60">Use at least 6 characters. You&apos;ll stay signed in after this.</p>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">Current password</label>
            <input
              type="password"
              name="current_password"
              required
              value={form.current_password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-paper-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">New password</label>
            <input
              type="password"
              name="new_password"
              required
              value={form.new_password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-paper-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">Confirm new password</label>
            <input
              type="password"
              name="confirm_password"
              required
              value={form.confirm_password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-paper-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-alert">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink-light disabled:opacity-50"
        >
          {saving ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default AccountSettingsPage;