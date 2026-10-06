import { redirect } from "next/navigation";
import SignUpForm from "./_components/SignUpForm";
import { auth } from "../../../auth";

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/applications");
  }
  return (
    <section>
      <SignUpForm />
    </section>
  );
}
