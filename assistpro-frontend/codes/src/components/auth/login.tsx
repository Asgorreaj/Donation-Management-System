// Add this at the very top of the file to mark it as a Client Component
"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { loginToAuthService } from "@/helpers/httpClient";
import { useMfi } from "@/context/MfiContext";
import { showErrorAlert, showSuccessAlert } from '@/utils/sweetAlert'; // Import SweetAlert functions

export const Login = () => {
  const { mfi } = useMfi();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        // router.replace(`/dashboard`);

        //showSuccessAlert("Logged in successfully!"); // Show success message
      } catch (error: any) {
        console.error("Login failed:", error.message);
        showErrorAlert("Invalid username or password. Please try again."); // Use SweetAlert for error handling
      } finally {
        setLoading(false);
      }
    },
    [mfi, router]
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 text-white items-center justify-center flex-col p-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to AssistPro</h1>
        <p className="text-lg">Manage your donations and students easily and securely.</p>
      </div>

      {/* Right Side (Login Form) */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                  color="primary"
                  className="w-full"
                  variant="solid"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            )}
          </Formik>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-500">
          © 2025 AssistPro. All rights reserved.
        </div>
      </div>
    </div>
  );
};
