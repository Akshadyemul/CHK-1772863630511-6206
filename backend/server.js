const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const medicineRoutes = require("./routes/medicineRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Medication App Backend Running");
});



const PORT = 5000;
app.use("/api/medicine", medicineRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/history", historyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});