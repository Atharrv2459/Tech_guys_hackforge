import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import userRoutes from "./router/userRouter.js"
import subscriptionRouter from "./router/subscriptionRouter.js"
import analyticsRoutes from "./router/analytics.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Test DB connection route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is : ${result.rows[0].current_database}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).send("Database connection failed");
  }
});

// ✅ Use user routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRouter);

app.use('/api/analytics', analyticsRoutes);
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
