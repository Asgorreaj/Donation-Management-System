// // Add this at the very top of the file to mark it as a Client Component
// "use client";

// import { createAuthCookie } from "@/actions/auth.action";
// import { LoginSchema } from "@/helpers/schemas";
// import { LoginFormType } from "@/helpers/types";
// import { Button, Input } from "@nextui-org/react";
// import { Formik } from "formik";
// import { useRouter } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";
// import { loginToAuthService, authApiFetch } from "@/helpers/httpClient";
// import { useMfi } from "@/context/MfiContext";
// import { showErrorAlert } from "@/utils/sweetAlert";

// export const Login = () => {
//   const { mfi } = useMfi();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState<{ students: number; branches: number; total_raised: number } | null>(null);

//   useEffect(() => {
//     authApiFetch("public-stats", { method: "GET" })
//       .then((res) => setStats(res))
//       .catch(() => setStats(null));
//   }, []);

//   const initialValues: LoginFormType = {
//     username: "",
//     password: "",
//   };

//   const handleLogin = useCallback(
//     async (values: LoginFormType) => {
//       try {
//         setLoading(true);
//         const { tokenInfo, user } = await loginToAuthService(
//           values.username,
//           values.password,
//           mfi
//         );
//         await createAuthCookie(tokenInfo, user);
//         router.replace(`/${mfi}`);
//       } catch (error: any) {
//         console.error("Login failed:", error.message);
//         showErrorAlert("Invalid username or password. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [mfi, router]
//   );

//   const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

//   return (
//     <div className="min-h-screen flex bg-white">
//       {/* Left Side — brand / impact panel */}
//       <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#12181f] text-white flex-col justify-between p-12">
//         {/* decorative teal blobs */}
//         <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

//         <div className="relative z-10 flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 font-bold text-white">A</div>
//           <span className="text-lg font-semibold tracking-tight">AssistPro</span>
//         </div>

//         <div className="relative z-10">
//           <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
//             Donation &amp; Sponsorship Platform
//           </p>
//           <h1 className="text-5xl font-extrabold leading-tight">
//             Every gift, <span className="text-teal-400">tracked with care.</span>
//           </h1>
//           <p className="mt-4 max-w-md text-white/60">
//             Manage students, donations, and branches from one clear, trustworthy dashboard.
//           </p>

//           {/* Real, live stats — not placeholder numbers */}
//           <div className="mt-10 flex gap-4">
//             <div className="rounded-xl bg-white/5 px-5 py-4 backdrop-blur-sm">
//               <p className="text-2xl font-bold text-teal-400">
//                 {stats ? fmt(stats.students) : "—"}
//               </p>
//               <p className="text-xs text-white/50">Students supported</p>
//             </div>
//             <div className="rounded-xl bg-white/5 px-5 py-4 backdrop-blur-sm">
//               <p className="text-2xl font-bold text-teal-400">
//                 {stats ? `৳${fmt(stats.total_raised)}` : "—"}
//               </p>
//               <p className="text-xs text-white/50">Total raised</p>
//             </div>
//             <div className="rounded-xl bg-white/5 px-5 py-4 backdrop-blur-sm">
//               <p className="text-2xl font-bold text-teal-400">
//                 {stats ? fmt(stats.branches) : "—"}
//               </p>
//               <p className="text-xs text-white/50">Branches</p>
//             </div>
//           </div>
//         </div>

//         <p className="relative z-10 text-xs text-white/30">© 2026 AssistPro. All rights reserved.</p>
//       </div>

//       {/* Right Side (Login Form) */}
//       <div className="flex flex-1 flex-col items-center justify-center bg-white p-8">
//         <div className="w-full max-w-md">
//           <h2 className="mb-1 text-3xl font-bold text-[#12181f]">Welcome back</h2>
//           <p className="mb-8 text-sm text-gray-500">Sign in to your AssistPro account.</p>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={LoginSchema}
//             onSubmit={handleLogin}
//           >
//             {({ values, errors, touched, handleChange, handleSubmit }) => (
//               <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
//                 <div className="flex flex-col">
//                   <label className="text-sm text-gray-700 mb-1">Username</label>
//                   <Input
//                     variant="bordered"
//                     placeholder="Enter your username"
//                     type="text"
//                     value={values.username}
//                     isInvalid={!!errors.username && !!touched.username}
//                     errorMessage={errors.username}
//                     onChange={handleChange("username")}
//                     classNames={{ inputWrapper: "border-gray-300 data-[hover=true]:border-teal-500" }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         handleSubmit();
//                       }
//                     }}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm text-gray-700 mb-1">Password</label>
//                   <Input
//                     variant="bordered"
//                     placeholder="Enter your password"
//                     type="password"
//                     value={values.password}
//                     isInvalid={!!errors.password && !!touched.password}
//                     errorMessage={errors.password}
//                     onChange={handleChange("password")}
//                     classNames={{ inputWrapper: "border-gray-300 data-[hover=true]:border-teal-500" }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         handleSubmit();
//                       }
//                     }}
//                   />
//                 </div>

//                 <Button
//                   onPress={() => handleSubmit()}
//                   isLoading={loading}
//                   type="submit"
//                   className="w-full bg-teal-600 text-white font-medium hover:bg-teal-700"
//                   variant="solid"
//                 >
//                   {loading ? "Signing in..." : "Sign In"}
//                 </Button>
//               </form>
//             )}
//           </Formik>
//         </div>

//         {/* Footer (mobile only, desktop shows it on left panel) */}
//         <div className="mt-8 text-sm text-gray-400 lg:hidden">
//           © 2026 AssistPro. All rights reserved.
//         </div>
//       </div>
//     </div>
//   );
// };

// Add this at the very top of the file to mark it as a Client Component
"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { loginToAuthService, authApiFetch } from "@/helpers/httpClient";
import { useMfi } from "@/context/MfiContext";
import { showErrorAlert } from "@/utils/sweetAlert";

export const Login = () => {
  const { mfi } = useMfi();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ students: number; branches: number; total_raised: number } | null>(null);

  const missionVideoRef = useRef<HTMLVideoElement>(null);
  const [missionPlaying, setMissionPlaying] = useState(true);

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

  const toggleMissionVideo = () => {
    const video = missionVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setMissionPlaying(true);
    } else {
      video.pause();
      setMissionPlaying(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden antialiased" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ========================================== */}
      {/* 1. NAVBAR SECTION (ALWAYS FIXED ON SCROLL) */}
      {/* ========================================== */}
      <div className="fixed top-0 left-0 w-full px-6 pt-6 z-50">
        <header className="max-w-7xl mx-auto bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-full py-2.5 pl-6 pr-3 flex items-center justify-between shadow-lg">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 text-sm font-black">A</div>
            <span className="text-xl font-bold tracking-tight text-white">AssistPro</span>
          </div>

          {/* Mid Nav Links (Transparent Pill Style) */}
          <nav className="hidden md:flex items-center bg-[#0F172A] rounded-full px-2 py-1 space-x-1">
            <a href="#login-form" className="bg-amber-500 text-white px-5 py-2 rounded-full text-sm font-medium transition">Home</a>
            <a href="#features" className="text-gray-300 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition">About</a>
            <a href="#demo-video" className="text-gray-300 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition">Campaigns</a>
            <a href="#tech-stack" className="text-gray-300 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition">Contact</a>
            <a href="#local-setup" className="text-gray-300 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition flex items-center space-x-1">
              <span>Pages</span> <i className="fa-solid fa-chevron-down text-xs"></i>
            </a>
          </nav>

          {/* Action Button */}
          <div>
            <a href="#login-form" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs tracking-wide transition shadow-md">
              Explore App
            </a>
          </div>
        </header>
      </div>

      {/* ========================================== */}
      {/* 2. HOME HERO SECTION                       */}
      {/* ========================================== */}
      <div id="login-form" className="relative min-h-screen w-full z-10 pt-24">
        {/* Background Video Player */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/promo-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80"></div>
        </div>

        {/* Hero Content Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 pt-16 pb-24">
          {/* Text Content Side */}
          <div className="lg:col-span-7 space-y-6 text-white mt-8 lg:mt-16">
            <span className="inline-flex items-center bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
              🚀 Live Platform Preview
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15] tracking-tight">
              Building Hope <span className="text-amber-500">Through</span> <br />Collective Action
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Empowering communities through compassionate giving. Log in to access the system dashboard, monitor real-time donation metrics, and manage volunteer modules.
            </p>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xs p-4 rounded-2xl shadow-sm flex items-center space-x-4 max-w-md">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 text-lg shrink-0">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">Multi-Tenant Engineering</h4>
                <p className="text-xs text-slate-300 mt-0.5">Re-architected from a multi-tenant NGO system into a self-hosted standalone app.</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 text-xs text-slate-400">
              <div className="flex text-amber-500 space-x-0.5">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <span>Want to test? Anyone can log in to check the system design.</span>
            </div>
          </div>

          {/* Login Box */}
          <div className="lg:col-span-5 relative bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-gray-400">Enter your credentials to access the donor dashboard.</p>
            </div>

            <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleLogin}>
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form className="space-y-4 relative z-20" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Account ID or Email</label>
                    <Input
                      variant="bordered"
                      placeholder="username or email"
                      type="text"
                      value={values.username}
                      isInvalid={!!errors.username && !!touched.username}
                      errorMessage={errors.username}
                      onChange={handleChange("username")}
                      startContent={<i className="fa-regular fa-user text-sm text-gray-500" />}
                      classNames={{
                        inputWrapper:
                          "bg-[#0F172A]/60 border border-white/10 rounded-xl data-[hover=true]:border-amber-500 group-data-[focus=true]:border-amber-500",
                        input:
                          "!text-white placeholder-gray-600 [-webkit-text-fill-color:#ffffff] autofill:[-webkit-text-fill-color:#ffffff] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#0F172A_inset] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</label>
                    </div>
                    <Input
                      variant="bordered"
                      placeholder="••••••••"
                      type="password"
                      value={values.password}
                      isInvalid={!!errors.password && !!touched.password}
                      errorMessage={errors.password}
                      onChange={handleChange("password")}
                      startContent={<i className="fa-solid fa-lock text-sm text-gray-500" />}
                      classNames={{
                        inputWrapper:
                          "bg-[#0F172A]/60 border border-white/10 rounded-xl data-[hover=true]:border-amber-500 group-data-[focus=true]:border-amber-500",
                        input:
                          "!text-white placeholder-gray-600 [-webkit-text-fill-color:#ffffff] autofill:[-webkit-text-fill-color:#ffffff] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#0F172A_inset] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                      }}
                    />
                  </div>

                  <Button
                    onPress={() => handleSubmit()}
                    isLoading={loading}
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/10"
                    variant="solid"
                  >
                    {loading ? "Signing in..." : "Log In & View System"}
                  </Button>
                </form>
              )}
            </Formik>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-center">
              <p className="text-[11px] text-amber-400"><i className="fa-solid fa-circle-info mr-1"></i> Sign in with your registered credentials to continue.</p>
            </div>

            <div className="bg-slate-900/60 border border-dashed border-amber-500/30 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                <i className="fa-solid fa-key"></i>
                <span>Demo Access</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-300">
                <span><span className="text-slate-500">ID:</span> <span className="font-mono text-white">owner</span></span>
                <span><span className="text-slate-500">Pass:</span> <span className="font-mono text-white">Asgor@123</span></span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Live Platform Snapshot</label>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/80 p-2 border border-slate-800 rounded-xl">
                    <p className="font-black text-amber-500 text-sm">{stats ? fmt(stats.students) : "—"}</p>
                    <p className="text-[9px] text-slate-400 uppercase">Students</p>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800 rounded-xl">
                    <p className="font-black text-amber-500 text-sm">{stats ? `৳${fmt(stats.total_raised)}` : "—"}</p>
                    <p className="text-[9px] text-slate-400 uppercase">Raised</p>
                  </div>
                  <div className="bg-slate-900/80 p-2 border border-slate-800 rounded-xl">
                    <p className="font-black text-amber-500 text-sm">{stats ? fmt(stats.branches) : "—"}</p>
                    <p className="text-[9px] text-slate-400 uppercase">Branches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. STATISTICS SECTION                      */}
      {/* ========================================== */}
      <section className="py-16 bg-slate-50 text-slate-900 border-y border-slate-200/60 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-slate-900">PHP 8.3</h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Backend API Engine</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-slate-900">Next.js 14</h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Frontend App Router</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-slate-900">Redis</h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Token Session Store</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-slate-900">Docker</h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Containerized Stack</p>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. VIDEO SHOWCASE SECTION                  */}
      {/* ========================================== */}
      <section id="demo-video" className="py-20 max-w-7xl mx-auto px-6 bg-white relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center space-x-2 text-amber-600">
              <i className="fa-solid fa-circle-play text-sm"></i>
              <span className="text-xs font-bold uppercase tracking-wider">System Demo Preview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">Operational Real-world Platform Workflow</h2>
          </div>
        </div>

        <div className="w-full mb-12 relative rounded-3xl overflow-hidden border border-slate-200 group shadow-2xl h-[480px]">
          <video ref={missionVideoRef} autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/workflow.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={toggleMissionVideo} className="w-16 h-16 bg-amber-50 text-slate-950 rounded-full flex items-center justify-center text-xl shadow-lg cursor-pointer transform hover:scale-110 transition">
              <i className={`fa-solid ${missionPlaying ? "fa-pause" : "fa-play"}`}></i>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. CORE SYSTEM FEATURES GRID               */}
      {/* ========================================== */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-200/60 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Features Matrix</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">What this project demonstrates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-4"><i className="fa-solid fa-shield-halved"></i></div>
              <h4 className="font-bold text-slate-900 mb-2">🔐 Authentication</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Register/login framework powered by token-based sessions and backed by high-speed Redis caching.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-4"><i className="fa-solid fa-sitemap"></i></div>
              <h4 className="font-bold text-slate-900 mb-2">🏢 Multi-Branch Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Organize student tracking datasets, branch managers, and incoming donations neatly by isolated branches.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-4"><i className="fa-solid fa-user-graduate"></i></div>
              <h4 className="font-bold text-slate-900 mb-2">🎓 Student Management</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Full CRUD controls, flexible search filtration, and rapid data injection via custom bulk CSV data import modules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* 6. FINANCIAL TRANSPARENCY SECTION (DONUT CHART) */}
      {/* ============================================== */}
      <section className="py-20 bg-white px-6 relative z-20">
        <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 p-8 md:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div
              className="w-48 h-48 rounded-full border-[16px] border-white flex items-center justify-center relative shadow-inner"
              style={{ borderTopColor: "#f59e0b", borderRightColor: "#3b82f6", borderBottomColor: "#10b981" }}
            >
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900">100%</span>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Auditable</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">System Analytics Engine</span>
            <h3 className="text-2xl font-extrabold text-slate-900">Live Dashboard Financial Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Interactive tracking aggregates real-time stats including total active students, global funds raised, and monthly incoming metrics via Recharts components.</p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between font-semibold border-b border-slate-200/60 pb-1">
                <span className="text-slate-700">Student Sponsorship Direct Allocation</span><span className="text-amber-600 font-bold">70%</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-200/60 pb-1">
                <span className="text-slate-700">Multi-Branch Operation & Logistics</span><span className="text-slate-500 font-bold">30%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 7. INFRASTRUCTURE ARCHITECTURE GRID SECTION */}
      {/* ========================================== */}
      <section id="tech-stack" className="py-20 bg-slate-50 border-t border-slate-200/60 px-6 relative z-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <h4 className="font-bold text-sm uppercase text-slate-400 tracking-wider text-center"><i className="fa-solid fa-cloud mr-1 text-amber-500"></i> Production Deployment Environment</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase">Frontend Hosting</p><p className="text-base font-black text-slate-900 mt-1">Vercel</p><p className="text-xs text-slate-500 mt-1">Next.js Web UI Client App</p></div>
            <div className="p-5 bg-white border border-slate-200 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase">Backend API Node</p><p className="text-base font-black text-slate-900 mt-1">Render</p><p className="text-xs text-slate-500 mt-1">Dockerized Engine Container</p></div>
            <div className="p-5 bg-white border border-slate-200 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase">Relational Database</p><p className="text-base font-black text-slate-900 mt-1">Aiven</p><p className="text-xs text-slate-500 mt-1">MySQL 8 Data Managed Cluster</p></div>
            <div className="p-5 bg-white border border-slate-200 rounded-xl"><p className="text-[10px] font-bold text-slate-400 uppercase">Session / Tokens Cache</p><p className="text-base font-black text-slate-900 mt-1">Upstash</p><p className="text-xs text-slate-500 mt-1">Serverless TLS Redis Layer</p></div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 8. DEVELOPER DOCKER SETUP (TERMINAL OVERLAY) */}
      {/* ========================================== */}
      <section id="local-setup" className="py-20 bg-white px-6 relative z-20">
        <div className="max-w-5xl mx-auto bg-slate-900 text-slate-200 p-8 rounded-3xl font-mono text-xs space-y-6 shadow-xl">
          <div className="flex items-center space-x-2 text-amber-500">
            <i className="fa-solid fa-terminal"></i>
            <span className="text-[11px] font-bold uppercase tracking-wider">Local Docker Compose Development Architecture</span>
          </div>
          <div>
            <p className="text-slate-500 mb-1"># Step 1: Initialize isolated Backend Engine (Nginx + PHP-FPM + MySQL + Redis)</p>
            <p className="text-emerald-400">cd assistpro-backend/codes</p>
            <p className="text-white">docker compose up -d --build</p>
            <p className="text-slate-500 mt-1">// API Layer spins live locally at: http://localhost:8081</p>
          </div>
          <hr className="border-slate-800" />
          <div>
            <p className="text-slate-500 mb-1"># Step 2: Boot up TypeScript Frontend Client Application</p>
            <p className="text-emerald-400">cd assistpro-frontend/codes</p>
            <p className="text-white">npm install && npm run dev</p>
            <p className="text-slate-500 mt-1">// Platform web interface available at: http://localhost:3000/disa/login</p>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 9. FOOTER SECTION (MAIN FULL WIDE FOOTER)  */}
      {/* ========================================== */}
      <footer className="bg-[#0F172A] text-white pt-16 pb-8 px-6 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black">A</div>
              <span className="text-xl font-extrabold tracking-tight">ASGOR HOSSAIN</span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">Software Engineer</p>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Full-stack Software Engineer experienced in building enterprise web applications, Smart ERP modules, and AI-driven systems.
            </p>
            <div className="flex space-x-4 text-gray-400 text-base pt-2">
              <a href="https://github.com/Asgorreaj" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition"><i className="fa-brands fa-github"></i></a>
              <a href="https://www.linkedin.com/in/asgordevai" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition"><i className="fa-brands fa-linkedin"></i></a>
              <a href="https://asgor.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition"><i className="fa-solid fa-globe"></i></a>
              <a href="https://www.researchgate.net/Md-Refat-Hossain" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition"><i className="fa-brands fa-researchgate"></i></a>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-500">Expertise</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><span className="text-white">Backend:</span> C#, .NET, ASP.NET Core</li>
              <li><span className="text-white">Frontend:</span> React.js, Next.js</li>
              <li><span className="text-white">Database:</span> MSSQL, MySQL, Redis</li>
              <li><span className="text-white">DevOps:</span> Docker, Git architecture</li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-500">Research Focus</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="hover:text-white transition">Low-Resource Bengali NLP</li>
              <li className="hover:text-white transition">Federated Learning</li>
              <li className="hover:text-white transition">Financial Sentiment Analysis</li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-500">Get In Touch</h5>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-center space-x-2">
                <i className="fa-solid fa-envelope text-amber-500 w-4"></i>
                <a href="mailto:asgor.dev.ai@gmail.com" className="hover:text-white transition">asgor.dev.ai@gmail.com</a>
              </p>
              <p className="flex items-center space-x-2">
                <i className="fa-solid fa-location-dot text-amber-500 w-4"></i>
                <span> Dhaka, Bangladesh</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500">
            © 2026 GiveWave (Assist Pro Platform). Engineered & Maintained by{" "}
            <a href="https://asgor.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Asgor Hossain</a>.
          </p>
          <div className="text-4xl md:text-5xl font-black text-white/[0.02] select-none tracking-widest font-sans uppercase">
            SOFTWARE ENGINEER
          </div>
        </div>
      </footer>
    </div>
  );
};