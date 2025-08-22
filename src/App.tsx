import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import AddpetPage from "./pages/AddpetPage";
import UserDashboard from "./pages/UserDashboard";
import { Home, PlusCircle, User } from "lucide-react"; // icons

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        {/* Main Content */}
        <main className="flex-1 flex justify-center p-4 pb-20">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/add-pet" element={<AddpetPage />} />
            <Route path="/user" element={<UserDashboard />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </Router>
  );
}

// Bottom Navigation Component
function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: "/home", label: "Home", icon: <Home size={22} /> },
    { to: "/add-pet", label: "Add Pet", icon: <PlusCircle size={22} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center py-2">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center text-xs ${
            location.pathname === item.to ? "text-blue-600" : "text-gray-500"
          }`}
        >
          {item.icon}
          <span className="mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default App;
