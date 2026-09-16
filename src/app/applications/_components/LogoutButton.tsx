import { logout } from "@/actions/auth"

const LogoutButton = () => {

  return (
    <form action={logout}>
      <button type="submit" className="px-2 py-1 rounded-full bg-blue-700 text-white">Logout</button>
    </form>
  )
}

export default LogoutButton