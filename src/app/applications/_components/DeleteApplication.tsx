"use client";

import { useState, useTransition } from "react";
import { deleteApplication } from "../action";

type Props = {
  id: number;
};
const DeleteApplication = ({ id }: Props) => {
  const [isConfirming, setisConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      const result = await deleteApplication(id);

      if (!result.success) {
        const message = result.errors.id?.[0] ?? result.errors.general?.[0];

        if (message) {
          setErrorMessage(message);

          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        }
      }
    });
  }
  return !isConfirming ? (
    <button
      onClick={() => setisConfirming(true)}
      className="px-2 py-1 rounded-full bg-red-700 text-white"
    >
      Delete
    </button>
  ) : (
    <div className="flex gap-3">
      {errorMessage && (
        <p className="text-red-700 bg-white px-5 rounded-2xl">
          {" "}
          {errorMessage}
        </p>
      )}
      <button
        onClick={() => setisConfirming(false)}
        className="px-2 py-1 rounded-full bg-gray-700 text-white"
      >
        Cancel
      </button>
      <button
        disabled={isPending}
        onClick={handleDelete}
        className="px-2 py-1 rounded-full bg-red-700 text-white"
      >
        {isPending ? "Deleting..." : "Confirm Delete"}
      </button>
    </div>
  );
};

export default DeleteApplication;
