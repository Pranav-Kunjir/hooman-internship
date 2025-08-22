import { useEffect, useState } from "react";

export default function Stats({
  userId,
  reload,
}: {
  userId: string;
  reload: boolean;
}) {
  const [user, setUser] = useState<{ email: string; pets: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:4000/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId, reload]); // reload triggers re-fetch

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!user || !userId)
    return <div className="text-center text-gray-400">No user data found.</div>;

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Welcome {user.email}
      </h2>
      <ul className="space-y-4">
        {user.pets.map((pet, idx) => (
          <li
            key={idx}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {pet.name}
                </h3>
                <p className="text-sm text-gray-500">{pet.type}</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                🐾 Walks: {pet.walks}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                🍖 Meals: {pet.meals}
              </span>
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                💊 Meds: {pet.meds}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
