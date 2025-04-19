import { useAuth } from "../../context/AuthContext";
import authToken from "../../storage/authToken";
export function LoginForm() {
  const { user, setUser } = useAuth();
  const token = authToken.getToken();
  return (
    <form className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded-lg"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-500"
      >
        Login
      </button>
    </form>
  );
}
