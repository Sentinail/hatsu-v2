"use client"

import { useState } from "react"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  rememberMe: Yup.boolean(),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    // Simulate API call
    setLoginError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, always succeed
      console.log("Login values:", values)

      // Redirect to home page after successful login
      // In a real app, you would use router.push('/home')
    } catch (error) {
      setLoginError("Invalid email or password. Please try again.")
    } finally {
      setSubmitting(false)
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
            <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-zinc-400">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <div className="mt-8">
            <div className="bg-zinc-900/60 rounded-lg border border-zinc-800 p-6 shadow-lg">
              {loginError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-md text-red-400 text-sm">
                  {loginError}
                </div>
              )}

              <Formik
                initialValues={{ email: "", password: "", rememberMe: false }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-6">
                    <div className="space-y-4">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <div className="relative">
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
                        </div>
                        <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium">
                            Password
                          </label>
                          <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Field
                            as={Input}
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
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
                      </div>

                      {/* Remember Me Checkbox */}
                      <div className="flex items-center space-x-2">
                        <Field id="rememberMe" name="rememberMe" type="checkbox" className="hidden">
                          {({ field, form }: any) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="rememberMe"
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  form.setFieldValue("rememberMe", checked)
                                }}
                                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                              />
                              <label
                                htmlFor="rememberMe"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                Remember me
                              </label>
                            </div>
                          )}
                        </Field>
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
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
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

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Hatsu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

