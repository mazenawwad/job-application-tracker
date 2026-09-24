"use client";

import { useActionState, useEffect, useState } from "react";
import { updateApplicationStatus } from "../action";
import type { StatusFormState } from "../action";
import { applicationStatuses } from "@/lib/application-status";

type Props = {
  id: number;
  status: string;
};
const initialState: StatusFormState = {
  errors: {},
  success: false,
};
const ApplicationStatus = ({ status, id }: Props) => {
  const [state, formAction, isPending] = useActionState(
    updateApplicationStatus,
    initialState,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const errorMessage = state.errors.status?.[0] ?? state.errors.general?.[0];

  useEffect(() => {
    if (!state.success) return;
    setIsEditing(false);
    setIsSuccess(true);
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [state]);

  return !isEditing ? (
    <div className="flex justify-between w-full">
      {isSuccess && (
        <p className="bg-green-700 text-white px-5 rounded-2xl flex items-center">
          {" "}
          Success!
        </p>
      )}
      <div>
        <strong>Status: </strong>
        {status}
      </div>
      <button
        className="px-2 py-1 rounded-full bg-blue-700 text-white"
        onClick={() => setIsEditing(!isEditing)}
      >
        {" "}
        Edit Status
      </button>
    </div>
  ) : (
    <form action={formAction}>
      <div className="flex flex-col items-center gap-3">
        <input type="hidden" name="id" value={id} />
        <select name="status" defaultValue={status}>
          {applicationStatuses.map((applicationStatus) => (
            <option
              className="text-black active:text-red-900"
              key={applicationStatus}
              value={applicationStatus}
            >
              {applicationStatus}
            </option>
          ))}
        </select>
        <div className="flex justify-between w-full">
          <button
            className="px-2 py-1 rounded-full bg-gray-700 text-white"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            {" "}
            Cancel
          </button>
          <button
            className="px-2 py-1 rounded-full bg-blue-700 text-white"
            type="submit"
            disabled={isPending}
          >
            {" "}
            {isPending ? "Updating" : "Update Status"}
          </button>
        </div>
      </div>
      {errorMessage && (
        <p className="rounded-2xl bg-white px-5 text-red-700">{errorMessage}</p>
      )}
    </form>
  );
};

export default ApplicationStatus;
