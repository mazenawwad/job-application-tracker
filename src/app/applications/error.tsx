"use client";
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
export default function Error({error, reset}: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-fit flex flex-col justify-center items-center rounded-2xl mb-30 gap-20 text-black bg-white p-30">
        <span>{error.message}</span>
        <button
          onClick={reset}
          className="px-2 py-1 rounded-full bg-blue-700 text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
