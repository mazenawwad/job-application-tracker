export default function Loading() {
  return (
    <div
      className="flex items-center justify-center space-x-2 min-h-screen bg-black "
      role="status"
      aria-label="Loading"
    >
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>

      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.5s]"></div>

      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-1s]"></div>

    </div>
  );
}
