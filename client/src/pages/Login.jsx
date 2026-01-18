export default function Login() {
  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
      <div className="bg-white/5 p-8 rounded-xl w-full max-w-md border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        <input placeholder="Email" className="input" />
        <input placeholder="Password" type="password" className="input mt-4" />
        <button className="btn-primary mt-6 w-full">Login</button>
      </div>
    </div>
  );
}
