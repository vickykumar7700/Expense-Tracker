const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ DB Connected To ExpenseDB"))
  .catch((err) => console.log("❌ DB Connection Error: ", err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expense", require("./routes/expenseRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
