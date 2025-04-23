"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheck, faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const USER_REGEX = useMemo(() => /^[A-z][A-z0-9-_]{3,23}$/, []);
  const PWD_REGEX = useMemo(
    () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    []
  );
  const EMAIL_REGEX = useMemo(
    () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    []
  );

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>("");
  const [validUserName, setValidUserName] = useState<boolean>(false);
  const [userNameFocus, setUserNameFocus] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  
  // Added showPassword state for toggling password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [PWD_REGEX, password]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [EMAIL_REGEX, email]);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [USER_REGEX, userName]);

  // Clear error after 5 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!showPasswordReset) {
        // Login flow
        const res: any = await dispatch(loginUser({ userName, password }));
        
        if (res?.status === 200) {
          setSuccessMessage("Login successful! Redirecting...");
          setTimeout(() => {
            router.push("/user/dashboard");
          }, 1000);
        } else {
          const regex = /Error: (.*?)(<|\\n|$)/;
          const match = res?.response?.data?.toString()?.match(regex);

          if (match) {
            setError(match[1].trim());
          } else {
            setError("Login failed. Please check your credentials and try again.");
          }
        }
      } else {
        // Password reset flow
        if (!validEmail) {
          setError("Please enter a valid email address");
          setLoading(false);
          return;
        }
        
        // Mock API call for password reset
        // In a real application, you would call an API endpoint
        setTimeout(() => {
          setResetEmailSent(true);
          setSuccessMessage("Password reset email sent. Please check your inbox.");
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
    setResetEmailSent(false);
    setEmail("");
    setSuccessMessage("");
  };

  return (
    <main className="bg-black dark:bg-black shadow-input mx-auto p-6 md:p-8 rounded-none md:rounded-2xl w-full max-w-md">
      {showPasswordReset && (
        <button
          onClick={handleBackToLogin}
          className="flex items-center gap-1 mb-4 text-neutral-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to login</span>
        </button>
      )}

      {successMessage && (
        <Alert className="bg-green-50 dark:bg-green-900/20 mb-4 border-green-200 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 dark:bg-red-900/20 mb-4 border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <h1 className="mb-6 font-bold text-white text-2xl">
        {showPasswordReset ? "Reset Password" : "Sign In"}
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!showPasswordReset ? (
          <>
            <LabelInputContainer>
              <Label htmlFor="username" className="flex items-center gap-2">
                Username
                {userName && (
                  <FontAwesomeIcon
                    icon={validUserName ? faCheck : faTimes}
                    className={validUserName ? "text-green-500" : "text-red-500"}
                  />
                )}
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                required
                autoComplete="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                onFocus={() => setUserNameFocus(true)}
                onBlur={() => setUserNameFocus(false)}
                className="bg-zinc-900 border-zinc-800 text-white"
                disabled={loading}
              />
              {userNameFocus && !validUserName && userName && (
                <p className="mt-1 text-amber-400 text-xs">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                  Username must start with a letter and be 4-24 characters long.
                </p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password" className="flex items-center gap-2">
                Password
                {password && (
                  <FontAwesomeIcon
                    icon={validPassword ? faCheck : faTimes}
                    className={validPassword ? "text-green-500" : "text-red-500"}
                  />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  className="bg-zinc-900 pr-10 border-zinc-800 text-white"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="top-1/2 right-3 absolute text-zinc-400 hover:text-white -translate-y-1/2 transform"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {passwordFocus && !validPassword && password && (
                <p className="mt-1 text-amber-400 text-xs">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                  8-24 characters with uppercase, lowercase, number, and special character (!@#$%).
                </p>
              )}
            </LabelInputContainer>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className="text-sky-500 hover:text-sky-400 text-sm hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          // Password reset form
          <LabelInputContainer>
            <Label htmlFor="reset-email" className="flex items-center gap-2">
              Email
              {email && (
                <FontAwesomeIcon
                  icon={validEmail ? faCheck : faTimes}
                  className={validEmail ? "text-green-500" : "text-red-500"}
                />
              )}
            </Label>
            <Input
              id="reset-email"
              placeholder="your.email@example.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              className="bg-zinc-900 border-zinc-800 text-white"
              disabled={loading || resetEmailSent}
            />
            {emailFocus && !validEmail && email && (
              <p className="mt-1 text-amber-400 text-xs">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                Please enter a valid email address.
              </p>
            )}
          </LabelInputContainer>
        )}

        <Button
          className="relative bg-gradient-to-br from-blue-600 hover:from-blue-700 to-indigo-800 hover:to-indigo-900 rounded-md w-full h-11 font-medium text-white"
          type="submit"
          disabled={loading || (showPasswordReset && resetEmailSent)}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <svg className="mr-2 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : showPasswordReset ? (
            resetEmailSent ? "Email Sent" : "Send Reset Link"
          ) : (
            "Sign In"
          )}
          <BottomGradient />
        </Button>

        {!showPasswordReset && (
          <div className="flex justify-between mt-6 text-sm">
            <span className="text-neutral-400">Don't have an account?</span>
            <Link href="/auth/register" className="text-sky-500 hover:text-sky-400 hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        )}
      </form>

      {!showPasswordReset && (
        <>
          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 w-full h-px" />
          
          <div className="flex flex-col space-y-3">
            <p className="mb-2 text-neutral-400 text-sm text-center">Or continue with</p>
            
            <Link href="http://localhost:5000/api/v1/user/oauth/github">
              <button
                type="button"
                className="group/btn relative flex justify-center items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md w-full h-11 font-medium text-white transition-colors"
              >
                <IconBrandGithub className="w-5 h-5" />
                <span>GitHub</span>
                <BottomGradient />
              </button>
            </Link>
            
            <Link href="http://localhost:5000/api/v1/user/oauth/google">
              <button
                type="button"
                className="group/btn relative flex justify-center items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md w-full h-11 font-medium text-white transition-colors"
              >
                <IconBrandGoogle className="w-5 h-5" />
                <span>Google</span>
                <BottomGradient />
              </button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="block -bottom-px absolute inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100 h-px" />
      <span className="block -bottom-px absolute inset-x-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover/btn:opacity-100 blur-sm h-px" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};