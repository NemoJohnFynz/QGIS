export function LoginForm() {
  return (
    <form className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded-lg"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}
