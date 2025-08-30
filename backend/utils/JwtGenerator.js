// utils/jwtGenerator.js
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const jwtGenerator = (user_id) => {
  const payload = {
    user_id: user_id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export default jwtGenerator;
