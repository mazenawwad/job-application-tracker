"use client";

import { useActionState } from "react";
import { signUp, SignUpState } from "../action";
import Link from "next/link";

const initialState: SignUpState = {
  errors: {},
};
export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  return (
    <div className="flex justify-center flex-col items-center">
      <form
        action={formAction}
        className="gap-5 py-10 flex mt-30 flex-col items-center justify-center rounded-md"
      >
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="johndoe@mail.com"
          className="bg-white px-30 py-3 placeholder:italic text-black/90"
        />
        {state.errors.email?.[0] && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.email[0]}
          </p>
        )}
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          className="bg-white px-30 py-3 placeholder:italic text-black/90"
          placeholder="Enter your password"
        />
        {state.errors.password?.[0] && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.password[0]}
          </p>
        )}
        <label htmlFor="confirmPassword" className="sr-only">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          className="bg-white px-30 py-3 placeholder:italic text-black/90"
          placeholder="Confirm your password"
        />
        {state.errors.confirmPassword?.[0] && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.confirmPassword[0]}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-700 px-4 py-2 rounded-full"
          disabled={isPending}
        >
          {isPending ? "Signing Up..." : "Sign Up"}
        </button>
        {state.errors.general?.[0] && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.general[0]}
          </p>
        )}
      </form>
      <p>
        Already have an account?{" "}
        <Link className="underline text-blue-500" href={"/login"}>
          Log in
        </Link>{" "}
      </p>
    </div>
  );
}
