import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const decodedJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error.message);
    return null;
  }
};
