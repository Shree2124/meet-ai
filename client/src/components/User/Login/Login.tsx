// @ts-ignore
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

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
  const [validUserName, setValidUserName] = useState<Boolean>(false);
  const [userNameFocus, setUserNameFocus] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [error, setError] = useState("");

  const [sendEmail, setSendEmail] = useState<boolean>(false);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [PWD_REGEX, password]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [EMAIL_REGEX, email]);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [USER_REGEX, userName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (validUserName && validPassword) {
    const res: any = await dispatch(loginUser({ userName, password }));
    console.log(res);
    if (res?.status === 200) {
      router.push("/user/dashboard");
    } else {
      const regex = /Error: (.*?)(<|\\n|$)/;
      const match = res?.response?.data?.toString()?.match(regex);

      if (match) {
        const message = match[1].trim();
        console.log(message);
        setError(message);
        console.log(error);
      }
      setTimeout(()=>{
        setError("")
      },3000)
    }
    // }
  };

  return (
    <main className="bg-black dark:bg-black shadow-input mx-auto p-4 md:p-8 rounded-none md:rounded-2xl w-full max-w-md">
      {sendEmail && (
        <div
          onClick={() => setSendEmail((prev) => !prev)}
          className="pb-2 cursor-pointer"
        >
          {"<-"}
        </div>
      )}
      <form className="my-8" onSubmit={handleSubmit}>
        {!sendEmail ? (
          <>
            {error && <p className="w-full text-red-600 text-center">{error}</p>}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="username">
                Username {"    "}
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validUserName ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validUserName || !userName ? "hide" : "invalid"}
                />
              </Label>
              <Input
                id="username"
                placeholder="Username"
                required
                autoComplete="off"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                onFocus={() => setUserNameFocus(true)}
                onBlur={() => setUserNameFocus(false)}
              />
              <p
                id="usernamenote"
                className={
                  userNameFocus && !validUserName ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Username must be greater than 4 characters.
                <br />
              </p>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">
                Password
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPassword ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPassword || !password ? "hide" : "invalid"}
                />
              </Label>
              <Input
                id="password"
                required
                autoComplete="off"
                aria-invalid={validPassword ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
              />
              <p
                id="pwdnote"
                className={
                  passwordFocus && !validPassword ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
            </LabelInputContainer>

            <div className="mb-1 pl-1">
              <p
                onClick={() => setSendEmail((prev) => !prev)}
                className="text-[0.9rem] hover:text-blue-300 hover:underline transition-transform cursor-pointer"
              >
                <Link href="#">Forgot your password</Link>
              </p>
            </div>
          </>
        ) : (
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Email {"    "}</Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
          </LabelInputContainer>
        )}

        <button
          className="group/btn block relative dark:bg-zinc-800 bg-gradient-to-br from-black dark:from-zinc-900 to-neutral-600 dark:to-zinc-900 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] rounded-md w-full h-10 font-medium text-white"
          type="submit"
        >
          {sendEmail && <span>Send Email</span>}
          {!sendEmail && <span>Sign in &rarr;</span>}
          <BottomGradient />
        </button>
        <div className="flex justify-between mt-6 text-sm">
          <span>Don't have an account?</span>
          <a href="/auth/register" className="text-sky-500">
            Sign up
          </a>
        </div>
      </form>
      {!sendEmail && (
        <>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 w-full h-[1px]" />
          <section className="flex flex-col space-y-4">
            <Link href="http://localhost:5000/api/v1/user/oauth/github">
              <button className="group/btn relative flex justify-start items-center space-x-2 bg-gray-50 dark:bg-zinc-900 shadow-input dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] px-4 rounded-md w-full h-10 font-medium text-black">
                <IconBrandGithub className="w-4 h-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  GitHub
                </span>
                <BottomGradient />
              </button>
            </Link>
            <Link href="http://localhost:5000/api/v1/user/oauth/google">
              <button className="group/btn relative flex justify-start items-center space-x-2 bg-gray-50 dark:bg-zinc-900 shadow-input dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] px-4 rounded-md w-full h-10 font-medium text-black">
                <IconBrandGoogle className="w-4 h-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Google
                </span>
                <BottomGradient />
              </button>
            </Link>
          </section>
        </>
      )}
    </main>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="block -bottom-px absolute inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100 w-full h-px transition duration-500" />
      <span className="block -bottom-px absolute inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover/btn:opacity-100 blur-sm mx-auto w-1/2 h-px transition duration-500" />
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
