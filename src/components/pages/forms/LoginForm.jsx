import React from "react";
import { useContext } from "react";
import { ErrorMessage, Formik } from "formik";
import { LoginSchema } from "../../../schema/Index";
import { AuthContext } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const initialValues = {
  employeeEmail: "",
  employeePassword: "",
};

function LoginForm() {
  
  const { handleLogin, setIsAuth, setUser, user } = useContext(AuthContext);
  console.log(initialValues);

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await axios.post("/auth/google", {
        code,
      });
      if (tokens.data.success) {
        setIsAuth(true);
        setUser(tokens.data.data);
      }
    },
    flow: "auth-code",
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={async (values, actions) => {
        await handleLogin(values);

        actions.resetForm();
      }}
    >
      {({ handleChange, handleSubmit, values, handleBlur, isSubmitting }) => (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="employeeEmail"
              className="block text-sm font-semibold text-amber-800 tracking-wide"
            >
              Email
            </label>
            <div className="relative">
              <input
                value={values.employeeEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                name="employeeEmail"
                type="email"
                id="employeeEmail"
                className="block w-full pl-10 rounded-xl border-2 border-amber-200 bg-amber-50 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
              <ErrorMessage name={"employeeEmail"}>
                {(msg) => (
                  <div className="mt-1">
                    <p className="text-red-500 text-base font-semibold">
                      {msg}
                    </p>
                  </div>
                )}
              </ErrorMessage>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="employeePassword"
              className="block text-sm font-semibold text-amber-800 tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <input
                value={values.employeePassword}
                onChange={handleChange}
                onBlur={handleBlur}
                name="employeePassword"
                type="password"
                id="employeePassword"
                className="block w-full pl-10 rounded-xl border-2 border-amber-200 bg-amber-50 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
              <ErrorMessage name={"employeePassword"}>
                {(msg) => (
                  <div className="mt-1">
                    <p className="text-red-500 text-base font-semibold">
                      {msg}
                    </p>
                  </div>
                )}
              </ErrorMessage>
            </div>
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500  via-amber-600 to-amber-300 text-white rounded-xl py-3 px-4 font-semibold hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            {isSubmitting ? "inProcces..." : "Sign In"}
          </button>
          <button
            onClick={() => login()}
            type="button"
            className="w-full py-2 px-4 border border-gray-600 rounded-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>
        </form>
      )}
    </Formik>
  );
}

export default LoginForm;
