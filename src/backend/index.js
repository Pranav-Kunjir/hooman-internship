import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory JSON store
let users = [
  {
    id: 1,
    email: "jane@example.com",
    password: "123456", // (for demo; never store plaintext in real apps!)
    pets: [
      { name: "Rex", type: "Dog", walks: 30, meals: 2, meds: 1 }
    ]
  }
];

// =============== AUTH ROUTES ===================

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  res.json({ success: true, userId: user.id });
  console.log(users);

});

// Register
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }
  const newUser = { id: users.length + 1, email, password, pets: [] };
  users.push(newUser);
  res.status(201).json({ success: true, userId: newUser.id });
  console.log(users);
});

// =============== USER DATA ROUTES ===============

// Get current user info
app.get("/api/user/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ email: user.email, pets: user.pets });
});

// Add a pet for current user
app.post("/api/user/:id/pets", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, type, activityType, activityValue, dateTime } = req.body;
  const activityVal = parseInt(activityValue);
  const activityDate = dateTime.split("T")[0]; // YYYY-MM-DD

  // Find pet
  const pet = user.pets.find(p => p.name === name && p.type === type);
  if (!pet) return res.status(404).json({ message: "Pet not found" });

  // Reset values if new day
  if (!pet.lastUpdated || pet.lastUpdated !== activityDate) {
    pet.walks = 0;
    pet.meals = 0;
    pet.meds = 0;
    pet.lastUpdated = activityDate;
  }

  // Add activity value
  pet[activityType] = (pet[activityType] || 0) + activityVal;

  res.json(pet);
});

// Add a new pet for current user
app.post("/api/user/:id/pet", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, type } = req.body;
  if (user.pets.find(p => p.name === name && p.type === type)) {
    return res.status(400).json({ message: "Pet already exists" });
  }
  user.pets.push({ name, type, walks: 0, meals: 0, meds: 0 });
  res.json(user.pets);
});

// Delete a pet for current user
app.delete("/api/user/:id/pet", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, type } = req.query;
  if (!name || !type) {
    return res.status(400).json({ message: "Missing name or type" });
  }

  const beforeCount = user.pets.length;
  user.pets = user.pets.filter(p => !(p.name === name && p.type === type));

  if (user.pets.length === beforeCount) {
    return res.status(404).json({ message: "Pet not found" });
  }

  return res.json({ message: "Pet deleted", pets: user.pets });
});


app.listen(4000, () => console.log("Server running on http://localhost:4000"));
