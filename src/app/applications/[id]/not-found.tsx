export default function NoApplicationFound() {
  return (
    <div>
      This application doesn't exist. Go back to list of applications{" "}
      <a className="underline text-blue-500" href="/applications">
        here
      </a>
    </div>
  );
}
