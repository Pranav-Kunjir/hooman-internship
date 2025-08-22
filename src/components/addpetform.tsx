import { useState } from "react";
import { X } from "lucide-react";

export default function AddPetForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (name: string, type: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) {
      setMessage("Please fill all fields.");
      return;
    }
    await onSubmit(name, type);
    setName("");
    setType("");
    setMessage("Pet added!");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold mb-4">Add New Pet</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pet Name"
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Pet Type"
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Add Pet
          </button>
        </form>
        {message && (
          <p className="text-sm text-center text-gray-600 mt-3">{message}</p>
        )}
      </div>
    </div>
  );
}
