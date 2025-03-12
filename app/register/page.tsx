"use client"

import { useState } from "react"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Eye, EyeOff, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Validation schema
const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  agreeTerms: Yup.boolean().oneOf([true], "You must agree to the terms and conditions"),
})

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    // Simulate API call
    setRegisterError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, always succeed
      console.log("Register values:", values)

      // Show success message
      setRegistrationSuccess(true)

      // In a real app, you might redirect or show a verification message
    } catch (error) {
      setRegisterError("Registration failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"]

    return {
      strength,
      label: labels[strength],
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <div className="absolute inset-0 bg-purple-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-500">H</span>
                </div>
              </div>
              <span className="text-3xl font-bold text-purple-500">Hatsu</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold">Create an account</h1>
            <p className="mt-2 text-zinc-400">Join the anime community today</p>
          </div>

          {/* Registration Success */}
          {registrationSuccess ? (
            <div className="bg-zinc-900/60 rounded-lg border border-zinc-800 p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
              <p className="text-zinc-400 mb-6">
                Your account has been created successfully. You can now sign in with your credentials.
              </p>
              <Link href="/login">
                <Button className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer transition-colors">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            /* Registration Form */
            <div className="mt-8">
              <div className="bg-zinc-900/60 rounded-lg border border-zinc-800 p-6 shadow-lg">
                {registerError && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-md text-red-400 text-sm">
                    {registerError}
                  </div>
                )}

                <Formik
                  initialValues={{
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    agreeTerms: false,
                  }}
                  validationSchema={RegisterSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched, values }) => (
                    <Form className="space-y-6">
                      <div className="space-y-4">
                        {/* Username Field */}
                        <div className="space-y-2">
                          <label htmlFor="username" className="text-sm font-medium">
                            Username
                          </label>
                          <Field
                            as={Input}
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            className={`bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500 ${
                              errors.username && touched.username ? "border-red-500" : ""
                            }`}
                          />
                          <ErrorMessage name="username" component="div" className="text-red-400 text-xs mt-1" />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className={`bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500 ${
                              errors.email && touched.email ? "border-red-500" : ""
                            }`}
                          />
                          <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                          <label htmlFor="password" className="text-sm font-medium">
                            Password
                          </label>
                          <div className="relative">
                            <Field
                              as={Input}
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className={`bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500 ${
                                errors.password && touched.password ? "border-red-500" : ""
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1" />

                          {/* Password Strength Indicator */}
                          {values.password && (
                            <div className="mt-2">
                              <div className="flex justify-between items-center mb-1">
                                <div className="text-xs text-zinc-400">Password strength:</div>
                                <div
                                  className={`text-xs ${
                                    getPasswordStrength(values.password).strength < 3
                                      ? "text-red-400"
                                      : getPasswordStrength(values.password).strength < 4
                                        ? "text-yellow-400"
                                        : "text-green-400"
                                  }`}
                                >
                                  {getPasswordStrength(values.password).label}
                                </div>
                              </div>
                              <div className="h-1 w-full bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    getPasswordStrength(values.password).strength < 3
                                      ? "bg-red-500"
                                      : getPasswordStrength(values.password).strength < 4
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                  style={{ width: `${getPasswordStrength(values.password).strength * 20}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Field
                              as={Input}
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className={`bg-zinc-800 border-zinc-700 focus-visible:ring-purple-500 ${
                                errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-xs mt-1" />
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        <div className="space-y-2">
                          <Field id="agreeTerms" name="agreeTerms" type="checkbox" className="hidden">
                            {({ field, form }: any) => (
                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id="agreeTerms"
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    form.setFieldValue("agreeTerms", checked)
                                  }}
                                  className="mt-1 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                />
                                <label
                                  htmlFor="agreeTerms"
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  I agree to the{" "}
                                  <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                                    Terms of Service
                                  </Link>{" "}
                                  and{" "}
                                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                                    Privacy Policy
                                  </Link>
                                </label>
                              </div>
                            )}
                          </Field>
                          <ErrorMessage name="agreeTerms" component="div" className="text-red-400 text-xs mt-1" />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 hover:cursor-pointer transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>

                {/* Divider */}
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-zinc-400">Or</span>
                  </div>
                </div>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-zinc-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Hatsu. All rights reserved. Developed by Wilson Ponseca.</p>
        </div>
      </footer>
    </div>
  )
}

