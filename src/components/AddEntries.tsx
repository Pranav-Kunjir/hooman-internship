import { useState, useEffect } from "react";

export default function AddEntries({
  userId,
  onEntryAdded,
}: {
  userId: string;
  onEntryAdded: () => void;
}) {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [activityType, setActivityType] = useState("walks");
  const [activityValue, setActivityValue] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      setPets([]);
      return;
    }
    fetch(`http://localhost:4000/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setPets(data.pets || []));
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !activityType || !activityValue || !dateTime) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }
    const petIndex = pets.findIndex((p) => p.name === selectedPet);
    if (petIndex === -1) {
      setMessage("❌ Pet not found.");
      return;
    }

    await fetch(`http://localhost:4000/api/user/${userId}/pets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: selectedPet,
        type: pets[petIndex].type,
        activityType,
        activityValue,
        dateTime,
      }),
    });

    setMessage("✅ Entry added!");
    setActivityValue("");
    setDateTime("");
    if (onEntryAdded) onEntryAdded();
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          🐾 Add Pet Activity
        </h2>

        {/* Pet Selector */}
        <label className="block text-gray-700 text-sm mb-1">Pet Name</label>
        <select
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
          className="w-full p-2 border rounded-lg mb-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Select Pet</option>
          {pets.map((pet) => (
            <option key={pet.name} value={pet.name}>
              {pet.name}
            </option>
          ))}
        </select>

        {/* Activity Type */}
        <label className="block text-gray-700 text-sm mb-1">Activity</label>
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          className="w-full p-2 border rounded-lg mb-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="walks">🚶 Walk</option>
          <option value="meals">🍖 Meal</option>
          <option value="meds">💊 Medication</option>
        </select>

        {/* Value */}
        <label className="block text-gray-700 text-sm mb-1">
          Activity Value
        </label>
        <input
          type="number"
          value={activityValue}
          onChange={(e) => setActivityValue(e.target.value)}
          placeholder="Enter value (e.g. 2)"
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Date & Time */}
        <label className="block text-gray-700 text-sm mb-1">Date & Time</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition"
        >
          ➕ Add Entry
        </button>

        {/* Message */}
        {message && (
          <div className="mt-3 text-center text-sm text-gray-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
