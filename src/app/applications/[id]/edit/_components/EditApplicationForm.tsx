"use client";
import { useActionState, useEffect, useState } from "react";
import { updateApplication, type EditApplicationFormState } from "../action";
import { applicationStatuses } from "@/lib/application-status";

type Props = {
  id: number;
  company: string;
  position: string;
  status: string;
  jobUrl: string | null;
  notes: string | null;
};
export default function EditApplicationForm(prop: Props) {
  const initialState: EditApplicationFormState = {
    errors: {},
    success: false,
  };
  const [state, formAction, isPending] = useActionState(
    updateApplication,
    initialState,
  );
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!state.success) return;
    setIsSuccess(true);
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [state]);

  return (
    <form
      className="flex flex-col items-center justify-start gap-3 max-w-2xl"
      action={formAction}
    >
      {isSuccess && (
        <p className="bg-green-700 text-white px-5 rounded-2xl flex items-center">
          Success!
        </p>
      )}
      <input type="hidden" name="id" value={prop.id} />
      <label htmlFor="company" className="sr-only">
        Company
      </label>
      <input id="company" name="company" defaultValue={prop.company} />
      {state.errors.company && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {state.errors.company[0]}
        </p>
      )}
      <label htmlFor="position" className="sr-only">
        Position
      </label>
      <input id="position" name="position" defaultValue={prop.position} />
      {state.errors.position && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {state.errors.position[0]}
        </p>
      )}
      <label htmlFor="status" className="sr-only">
        Status
      </label>
      <select id="status" name="status" defaultValue={prop.status}>
        {applicationStatuses.map((applicationStatus) => (
          <option key={applicationStatus} value={applicationStatus}>
            {applicationStatus}
          </option>
        ))}
      </select>{" "}
      {state.errors.status && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {state.errors.status[0]}
        </p>
      )}
      <label htmlFor="jobUrl" className="sr-only">
        JobUrl
      </label>
      <input id="jobUrl" name="jobUrl" defaultValue={prop.jobUrl ?? ""} />
      {state.errors.jobUrl && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {state.errors.jobUrl[0]}
        </p>
      )}
      <label htmlFor="notes" className="sr-only">
        Notes
      </label>
      <input id="notes" name="notes" defaultValue={prop.notes ?? ""} />
      {state.errors.notes && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {state.errors.notes[0]}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="px-2 py-1 rounded-full bg-orange-700 text-white"
      >
        {isPending ? "Editing..." : "Edit Application"}
      </button>
      {state.errors.general && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {state.errors.general[0]}
        </p>
      )}
    </form>
  );
}
