import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/60 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">
          Resume<span className="text-blue-500">ATS</span>
        </Link>

        <div className="flex gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
