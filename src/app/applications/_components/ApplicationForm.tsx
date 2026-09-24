"use client";

import { useActionState } from "react";
import { createApplication } from "../action";
import type { ApplicationFormState } from "../action";
import { applicationStatuses } from "@/lib/application-status";

const ApplicationForm = () => {
  const initialState: ApplicationFormState = {
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    createApplication,
    initialState,
  );

  return (
    <section className="w-full flex justify-center">
      <form
        action={formAction}
        className="flex w-full max-w-2xl flex-col items-center gap-5"
      >
        {state.errors.general && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.general[0]}
          </p>
        )}
        <input
          className="w-full bg-gray-300 text-2xl text-black placeholder:text-black px-5 py-1 rounded-md"
          name="company"
          placeholder="What is the company name?"
          />
          {state.errors.company && (
            <p className="text-red-700 bg-white px-5 rounded-2xl">
              {state.errors.company[0]}
            </p>
          )}
        <input
          className="w-full bg-gray-300 text-2xl text-black placeholder:text-black px-5 py-1 rounded-md"
          name="position"
          placeholder="What is the position?"
        />
        {state.errors.position && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.position[0]}
          </p>
        )}
          <select name="status" defaultValue={applicationStatuses[0]}>
            {applicationStatuses.map((applicationStatus) => (
              <option className="text-black active:text-red-900" key={applicationStatus} value={applicationStatus}>
                {applicationStatus}
              </option>
            ))}
          </select>
        {state.errors.status && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.status[0]}
          </p>
        )}
        <input
          className="w-full bg-gray-300 text-2xl text-black placeholder:text-black px-5 py-1 rounded-md"
          name="jobUrl"
          placeholder="Enter the job URL, if available."
        />
        {state.errors.jobUrl && (
          <p className="text-red-700 bg-white px-5 rounded-2xl">
            {state.errors.jobUrl[0]}
          </p>
        )}
        <textarea
          className="w-full bg-gray-300 text-2xl text-black placeholder:text-black px-5 py-1 rounded-md"
          name="notes"
          placeholder="Do you have any notes?"
        />
        <button
          disabled={isPending}
          className=" bg-blue-950/40 hover:bg-blue-950 transition-colors duration-150 text-white text-2xl px-5 py-3 text-center rounded-full"
          type="submit"
        >
          {isPending ? "Creating..." : "Create Application"}
        </button>
      </form>
    </section>
  );
};

export default ApplicationForm;
