"use client";

import { useActionState } from "react";
import { login } from "../action";
import type { LoginState } from "../action";

const initialState: LoginState = {
  errors: {},
};

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const errorMessage =
    state.errors.credentials?.[0] ?? state.errors.general?.[0];
  return (
    <div>
      <form
        className="gap-5 py-10 flex mt-30 flex-col items-center justify-center rounded-md"
        action={formAction}
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
        <button
          disabled={isPending}
          type="submit"
          className="bg-green-700 px-4 py-2 rounded-full"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>
        {errorMessage && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {" "}
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
