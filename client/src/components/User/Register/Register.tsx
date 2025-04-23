"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { faCheck, faTimes, faInfoCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const router = useRouter();

  const USER_REGEX = useMemo(() => /^[A-z][A-z0-9-_]{3,23}$/, []);
  const PWD_REGEX = useMemo(
    () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    []
  );
  const EMAIL_REGEX = useMemo(
    () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    []
  );
  const NAME_REGEX = useMemo(() => /^[A-Za-z]{2,}$/, []);

  // Form fields
  const [userName, setUserName] = useState<string>("");
  const [validUserName, setValidUserName] = useState<boolean>(false);
  const [userNameFocus, setUserNameFocus] = useState<boolean>(false);
  const [userNameError, setUserNameError] = useState<string>("");
  
  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validConfirmPassword, setValidConfirmPassword] = useState<boolean>(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  
  const [firstName, setFirstName] = useState<string>("");
  const [validFirstName, setValidFirstName] = useState<boolean>(false);
  const [firstNameFocus, setFirstNameFocus] = useState<boolean>(false);
  
  const [lastName, setLastName] = useState<string>("");
  const [validLastName, setValidLastName] = useState<boolean>(false);
  const [lastNameFocus, setLastNameFocus] = useState<boolean>(false);

  // UI state
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds

  // Validation effects
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidConfirmPassword(password === confirmPassword && password !== "");
  }, [PWD_REGEX, password, confirmPassword]);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [USER_REGEX, userName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [EMAIL_REGEX, email]);
  
  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [NAME_REGEX, firstName]);
  
  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [NAME_REGEX, lastName]);

  // Clear errors after 5 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [error]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showModal && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Handle expired OTP
      setCodeError("Verification code has expired. Please request a new one.");
    }
    return () => clearInterval(interval);
  }, [showModal, timeLeft]);

  // Check for username availability (debounced)
  useEffect(() => {
    const checkUserName = async () => {
      if (validUserName && userName && formSubmitted === false) {
        try {
          // Simulate API call to check username availability
          // In a real app, you would call your API here
          const response = await new Promise<{available: boolean}>((resolve) => {
            setTimeout(() => {
              // Random result for demonstration
              const available = Math.random() > 0.3;
              resolve({available});
            }, 500);
          });
          
          if (!response.available) {
            setUserNameError("Username is already taken");
            setValidUserName(false);
          } else {
            setUserNameError("");
          }
        } catch (err) {
          console.error("Error checking username:", err);
        }
      }
    };
    
    const timeoutId = setTimeout(() => {
      if (userName.length >= 4) {
        checkUserName();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [userName, validUserName, formSubmitted]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    setLoading(true);
    
    // Final form validation
    if (!validUserName || !validPassword || !validEmail || !validFirstName || !validLastName || !validConfirmPassword) {
      setError("Please fix the form errors before submitting.");
      setLoading(false);
      return;
    }
    
    // Prepare data for submission
    const data = {
      userName,
      fullName: `${firstName} ${lastName}`,
      password,
      email,
    };

    try {
      const response: any = await axiosInstance.post(`/user/register`, data);
      
      if (response.status === 200) {
        setToken(response?.data?.data);
        setShowModal(true);
        setTimeLeft(300); // Reset timer for OTP
      }
    } catch (err: any) {
      console.error("Error during registration:", err.response?.data || err.message);
      
      const regex = /Error: (.*?)(<|\\n|$)/;
      const match = err.response?.data?.toString()?.match(regex);

      if (match) {
        setError(match[1].trim());
      } else if (err.response?.status === 409) {
        // Check specific error types
        if (err.response.data.includes("email")) {
          setEmailError("Email is already registered");
          setError("Email is already registered. Please use a different email or log in.");
        } else if (err.response.data.includes("username")) {
          setUserNameError("Username is already taken");
          setError("Username is already taken. Please choose a different username.");
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP verification handler
  const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerifyLoading(true);
    setCodeError("");
    
    if (verificationCode.length !== 6) {
      setCodeError("Please enter a valid 6-digit code");
      setVerifyLoading(false);
      return;
    }
    
    try {
      const response = await axiosInstance.post(`/user/verify`, {
        activationToken: token,
        otp: verificationCode,
      });
      
      console.log("Verification successful:", response.data);
      // Close modal and redirect to login
      closeModal();
      router.push("/auth/login?verified=true");
    } catch (err: any) {
      setCodeError(
        err.response?.data?.message || 
        "Invalid verification code. Please try again."
      );
      console.error("Error during verification:", err.response?.data || err.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  // Request new OTP code
  const requestNewCode = async () => {
    try {
      setVerifyLoading(true);
      // In a real app, call your API to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTimeLeft(300);
      setCodeError("");
      setVerifyLoading(false);
    } catch (err) {
      setCodeError("Failed to send new code. Please try again.");
      setVerifyLoading(false);
    }
  };

  const closeModal = () => setShowModal(false);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="bg-black shadow-input mx-auto p-6 md:p-8 rounded-none md:rounded-2xl w-full max-w-md text-white">
      <h1 className="mb-6 font-bold text-2xl">Create your account</h1>
      
      {error && (
        <Alert className="bg-red-50 dark:bg-red-900/20 mb-4 border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="flex items-center gap-2">
              First name
              {firstName && (
                <FontAwesomeIcon
                  icon={validFirstName ? faCheck : faTimes}
                  className={validFirstName ? "text-green-500" : "text-red-500"}
                />
              )}
            </Label>
            <Input
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
              placeholder="John"
              type="text"
              required
              disabled={loading}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
            {firstNameFocus && !validFirstName && firstName && (
              <p className="mt-1 text-amber-400 text-xs">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                First name must contain at least 2 letters.
              </p>
            )}
          </LabelInputContainer>
          
          <LabelInputContainer>
            <Label htmlFor="lastname" className="flex items-center gap-2">
              Last name
              {lastName && (
                <FontAwesomeIcon
                  icon={validLastName ? faCheck : faTimes}
                  className={validLastName ? "text-green-500" : "text-red-500"}
                />
              )}
            </Label>
            <Input
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
              placeholder="Doe"
              type="text"
              required
              disabled={loading}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
            {lastNameFocus && !validLastName && lastName && (
              <p className="mt-1 text-amber-400 text-xs">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                Last name must contain at least 2 letters.
              </p>
            )}
          </LabelInputContainer>
        </div>

        <LabelInputContainer>
          <Label htmlFor="username" className="flex items-center gap-2">
            Username
            {userName && (
              <FontAwesomeIcon
                icon={validUserName && !userNameError ? faCheck : faTimes}
                className={(validUserName && !userNameError) ? "text-green-500" : "text-red-500"}
              />
            )}
          </Label>
          <Input
            id="username"
            placeholder="cooluser42"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onFocus={() => setUserNameFocus(true)}
            onBlur={() => setUserNameFocus(false)}
            type="text"
            required
            disabled={loading}
            className="bg-zinc-900 border-zinc-800 text-white"
          />
          {userNameError && (
            <p className="mt-1 text-red-400 text-xs">
              <FontAwesomeIcon icon={faTimes} className="mr-1" />
              {userNameError}
            </p>
          )}
          {userNameFocus && !validUserName && userName && !userNameError && (
            <p className="mt-1 text-amber-400 text-xs">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              Username must start with a letter and be 4-24 characters.
              Only letters, numbers, hyphens, and underscores allowed.
            </p>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="email" className="flex items-center gap-2">
            Email Address
            {email && (
              <FontAwesomeIcon
                icon={validEmail && !emailError ? faCheck : faTimes}
                className={(validEmail && !emailError) ? "text-green-500" : "text-red-500"}
              />
            )}
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            placeholder="your.email@example.com"
            type="email"
            required
            disabled={loading}
            className="bg-zinc-900 border-zinc-800 text-white"
          />
          {emailError && (
            <p className="mt-1 text-red-400 text-xs">
              <FontAwesomeIcon icon={faTimes} className="mr-1" />
              {emailError}
            </p>
          )}
          {emailFocus && !validEmail && email && !emailError && (
            <p className="mt-1 text-amber-400 text-xs">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              Please enter a valid email address.
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              className="bg-zinc-900 pr-10 border-zinc-800 text-white"
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

        <LabelInputContainer>
          <Label htmlFor="confirm-password" className="flex items-center gap-2">
            Confirm Password
            {confirmPassword && (
              <FontAwesomeIcon
                icon={validConfirmPassword ? faCheck : faTimes}
                className={validConfirmPassword ? "text-green-500" : "text-red-500"}
              />
            )}
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
              placeholder="••••••••"
              type={showConfirmPassword ? "text" : "password"}
              required
              disabled={loading}
              className="bg-zinc-900 pr-10 border-zinc-800 text-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="top-1/2 right-3 absolute text-zinc-400 hover:text-white -translate-y-1/2 transform"
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {confirmPasswordFocus && !validConfirmPassword && confirmPassword && (
            <p className="mt-1 text-amber-400 text-xs">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              Passwords must match.
            </p>
          )}
        </LabelInputContainer>

        <Button
          className="relative bg-gradient-to-br from-blue-600 hover:from-blue-700 to-indigo-800 hover:to-indigo-900 rounded-md w-full h-11 font-medium text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <svg className="mr-2 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Sign Up"
          )}
          <BottomGradient />
        </Button>
      </form>

      <div className="flex justify-between mt-6 text-sm">
        <span className="text-neutral-400">Already have an account?</span>
        <Link href="/auth/login" className="text-sky-500 hover:text-sky-400 hover:underline transition-colors">
          Log in
        </Link>
      </div>

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

      {/* Verification Modal */}
      {showModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
          <div className="bg-zinc-900 shadow-xl mx-4 p-6 border border-zinc-800 rounded-lg w-full max-w-sm">
            <h2 className="mb-4 font-bold text-xl">Verify Your Email</h2>
            <p className="mb-4 text-neutral-300">
              We've sent a verification code to <span className="font-medium text-white">{email}</span>. 
              Please enter the 6-digit code below to complete your registration.
            </p>
            
            <p className="mb-6 text-sky-400 text-sm">
              Time remaining: {formatTime(timeLeft)}
            </p>
            
            <form onSubmit={verifyCode} className="space-y-4">
              <LabelInputContainer>
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => {
                    // Only allow numbers and limit to 6 digits
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  placeholder="Enter 6-digit code"
                  type="text"
                  maxLength={6}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white text-lg text-center tracking-widest"
                  disabled={verifyLoading || timeLeft === 0}
                />
                {codeError && (
                  <p className="mt-1 text-red-400 text-sm">{codeError}</p>
                )}
              </LabelInputContainer>
              
              <div className="flex sm:flex-row flex-col gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-md h-11 text-white"
                  disabled={verifyLoading || verificationCode.length !== 6 || timeLeft === 0}
                >
                  {verifyLoading ? "Verifying..." : "Verify Account"}
                </Button>
                
                {timeLeft === 0 && (
                  <Button
                    type="button"
                    onClick={requestNewCode}
                    className="bg-zinc-700 hover:bg-zinc-600 rounded-md h-11 text-white"
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? "Sending..." : "Resend Code"}
                  </Button>
                )}
              </div>
            </form>
            
            <button 
              className="mt-4 text-neutral-400 hover:text-white text-sm" 
              onClick={closeModal}
            >
              Cancel and try again later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

const BottomGradient = () => {
  return (
    <>
      <span className="block -bottom-px absolute inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100 h-px" />
      <span className="block -bottom-px absolute inset-x-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover/btn:opacity-100 blur-sm h-px" />
    </>
  );
};