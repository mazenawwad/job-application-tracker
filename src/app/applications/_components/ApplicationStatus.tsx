"use client";

import { useActionState, useEffect, useState } from "react";
import { updateApplicationStatus } from "../action";
import type { StatusFormState } from "../action";

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
      {isSuccess && 
      <p className="bg-green-700 text-white px-5 rounded-2xl flex items-center"> Success!</p>
      }
      <div>
        <strong>Status: </strong>
        {status}</div>
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
        <input
          type="text"
          className="w-full bg-gray-300 text-2xl text-black placeholder:text-black px-5 py-1 rounded-md"
          name="status"
          placeholder="What is the new status?"
          defaultValue={status}
        />
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
      {state.errors.status && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {" "}
          {state.errors.status[0]}
        </p>
      )}
    </form>
  );
};

export default ApplicationStatus;
