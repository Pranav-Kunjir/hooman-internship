import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AddPetForm from "../components/addpetform";

export default function AddpetPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:4000/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setPets(data.pets || []));
  }, [userId]);

  const handleAddPet = async (name: string, type: string) => {
    const res = await fetch(`http://localhost:4000/api/user/${userId}/pet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    if (res.ok) {
      const updatedPets = await res.json();
      setPets(updatedPets);
    } else {
      const err = await res.json();
      console.error(err.message);
    }
  };

  const handleDeletePet = async (petName: string, petType: string) => {
    const res = await fetch(
      `http://localhost:4000/api/user/${userId}/pet?name=${petName}&type=${petType}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      const updatedPets = await res.json();
      setPets(updatedPets);
      window.location.reload(); // Reload the page after deletion
    } else {
      const err = await res.json();
      console.error(err.message);
    }
  };

  return (
    <div className="relative min-h-screen p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-4 text-center">Your Pets</h2>

      {/* Pets as cards */}
      <div className="grid gap-4 w-[35vh] mx-auto">
        {pets.map((pet, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-2xl p-4 flex justify-between items-center w-full"
          >
            <div>
              <h3 className="text-lg font-semibold">{pet.name}</h3>
              <p className="text-gray-500">{pet.type}</p>
            </div>
            <button
              onClick={() => handleDeletePet(pet.name, pet.type)}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
      >
        <Plus size={24} />
      </button>

      {/* Modal Form */}
      {showForm && (
        <AddPetForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddPet}
        />
      )}
    </div>
  );
}
