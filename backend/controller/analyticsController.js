import pool from "../db.js";
export const getTotalSubscriptions = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      "SELECT COUNT(*) FROM subscriptions WHERE user_id = $1",
      [userId]
    );

    res.json({ totalSubscriptions: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: "Error fetching total subscriptions" });
  }
};

export const getActiveVsCanceled = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) AS canceled
      FROM subscriptions
      WHERE user_id = $1`,
      [userId]
    );

    res.json({
      active: result.rows[0].active,
      canceled: result.rows[0].canceled,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching active vs canceled data" });
  }
};

export const getMonthlySpending = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT 
        DATE_TRUNC('month', start_date) AS month,
        SUM(price) AS total_spent
      FROM subscriptions
      WHERE user_id = $1 AND status = 'active'
      GROUP BY month
      ORDER BY month`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching monthly spending" });
  }
};

export const getSatisfactionAnalytics = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT 
        satisfaction_level,
        COUNT(*) AS count
      FROM subscriptions
      WHERE user_id = $1
      GROUP BY satisfaction_level`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching satisfaction analytics" });
  }
};
