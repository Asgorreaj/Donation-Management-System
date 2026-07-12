// Add this at the very top of the file to mark it as a Client Component
"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { loginToAuthService, authApiFetch } from "@/helpers/httpClient";
import { useMfi } from "@/context/MfiContext";
import { showErrorAlert } from "@/utils/sweetAlert";

export const Login = () => {
  const { mfi } = useMfi();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ students: number; branches: number; total_raised: number } | null>(null);

  useEffect(() => {
    authApiFetch("public-stats", { method: "GET" })
      .then((res) => setStats(res))
      .catch(() => setStats(null));
  }, []);

  const initialValues: LoginFormType = {
    username: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      try {
        setLoading(true);
        const { tokenInfo, user } = await loginToAuthService(
          values.username,
          values.password,
          mfi
        );
        await createAuthCookie(tokenInfo, user);
        router.replace(`/${mfi}`);
      } catch (error: any) {
        console.error("Login failed:", error.message);
        showErrorAlert("Invalid username or password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [mfi, router]
  );

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side — brand / impact panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#12181f] text-white flex-col justify-between p-12">
        {/* decorative teal blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 font-bold text-white">A</div>
          <span className="text-lg font-semibold tracking-tight">AssistPro</span>
        </div>

        <div className="relative z-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
            Donation &amp; Sponsorship Platform
          </p>
          <h1 className="text-5xl font-extrabold leading-tight">
            Every gift, <span className="text-teal-400">tracked with care.</span>
          </h1>
          <p className="mt-4 max-w-md text-white/60">
            Manage students, donations, and branches from one clear, trustworthy dashboard.
          </p>

          {/* Real, live stats — not placeholder numbers */}
          <div className="mt-10 flex gap-4">
            <div className="rounded-xl bg-white/5 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-teal-400">
                {stats ? fmt(stats.students) : "—"}
              </p>
              <p className="text-xs text-white/50">Students supported</p>
            </div>
            <div className="rounded-xl bg-white/5 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-teal-400">
                {stats ? `৳${fmt(stats.total_raised)}` : "—"}
              </p>
              <p className="text-xs text-white/50">Total raised</p>
            </div>
            <div className="rounded-xl bg-white/5 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-teal-400">
                {stats ? fmt(stats.branches) : "—"}
              </p>
              <p className="text-xs text-white/50">Branches</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/30">© 2026 AssistPro. All rights reserved.</p>
      </div>

      {/* Right Side (Login Form) */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="mb-1 text-3xl font-bold text-[#12181f]">Welcome back</h2>
          <p className="mb-8 text-sm text-gray-500">Sign in to your AssistPro account.</p>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 mb-1">Username</label>
                  <Input
                    variant="bordered"
                    placeholder="Enter your username"
                    type="text"
                    value={values.username}
                    isInvalid={!!errors.username && !!touched.username}
                    errorMessage={errors.username}
                    onChange={handleChange("username")}
                    classNames={{ inputWrapper: "border-gray-300 data-[hover=true]:border-teal-500" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 mb-1">Password</label>
                  <Input
                    variant="bordered"
                    placeholder="Enter your password"
                    type="password"
                    value={values.password}
                    isInvalid={!!errors.password && !!touched.password}
                    errorMessage={errors.password}
                    onChange={handleChange("password")}
                    classNames={{ inputWrapper: "border-gray-300 data-[hover=true]:border-teal-500" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                </div>

                <Button
                  onPress={() => handleSubmit()}
                  isLoading={loading}
                  type="submit"
                  className="w-full bg-teal-600 text-white font-medium hover:bg-teal-700"
                  variant="solid"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            )}
          </Formik>
        </div>

        {/* Footer (mobile only, desktop shows it on left panel) */}
        <div className="mt-8 text-sm text-gray-400 lg:hidden">
          © 2026 AssistPro. All rights reserved.
        </div>
      </div>
    </div>
  );
};