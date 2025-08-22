import { useEffect, useState } from "react";
import AddEntries from "../components/AddEntries";
import Stats from "../components/Stats";
import { Plus } from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<{ email: string; pets: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [reloadStats, setReloadStats] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    if (!storedUserId) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:4000/api/user/${storedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user || !userId) return <div>No user data found.</div>;

  const handleEntryAdded = () => {
    setReloadStats((prev) => !prev);
    setShowForm(false);
  };

  return (
    <div className="relative min-h-screen">
      <Stats userId={userId} reload={reloadStats} />

      {/* Floating Action Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition"
      >
        <Plus size={24} />
      </button>

      {/* Floating AddEntries Component */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Your component floats here */}
            <AddEntries userId={userId} onEntryAdded={handleEntryAdded} />
          </div>
        </div>
      )}
    </div>
  );
}
