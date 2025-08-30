import pool from "../db.js";

export const addSubscription = async (req, res) => {
  try {
    const { user_id, service_name, price, start_date, renewal_date, website_url } = req.body;

    const newSub = await pool.query(
      `INSERT INTO subscriptions (user_id, service_name, price, start_date, renewal_date, website_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,'active') RETURNING *`,
      [user_id, service_name, price, start_date, renewal_date, website_url]
    );

    res.status(201).json(newSub.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const { user_id } = req.params;

    const subs = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1`,
      [user_id]
    );

    res.status(200).json(subs.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestCancelSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.params;

    const sub = await pool.query(
      `SELECT * FROM subscriptions WHERE id = $1`,
      [subscription_id]
    );

    if (sub.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json({
      message: "Open this link to cancel your subscription on provider’s site",
      website_url: sub.rows[0].website_url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const confirmCancelSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.params;

    const deleted = await pool.query(
      `DELETE FROM subscriptions WHERE id = $1 RETURNING *`,
      [subscription_id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json({
      message: "Subscription successfully cancelled",
      subscription: deleted.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const declineCancelSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.params;

    const sub = await pool.query(
      `SELECT * FROM subscriptions WHERE id = $1`,
      [subscription_id]
    );

    if (sub.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json({
      message: "Subscription kept active",
      subscription: sub.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateFeedback = async (req, res) => {
  const { id } = req.params; 
  const { priority_level, satisfaction_level } = req.body;

  try {
    if (
      (priority_level && (priority_level < 1 || priority_level > 5)) ||
      (satisfaction_level && (satisfaction_level < 1 || satisfaction_level > 5))
    ) {
      return res.status(400).json({ error: "Priority & Satisfaction must be between 1-5" });
    }

    const result = await pool.query(
      `UPDATE subscriptions
       SET priority_level = COALESCE($1, priority_level),
           satisfaction_level = COALESCE($2, satisfaction_level)
       WHERE id = $3
       RETURNING *`,
      [priority_level, satisfaction_level, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.json({
      message: "Feedback updated successfully",
      subscription: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};