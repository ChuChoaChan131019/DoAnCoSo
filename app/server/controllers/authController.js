import db from "../configs/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function signToken(user) {
  // payload tối giản: sub = user id
  return jwt.sign(
    { sub: user.ID_User, email: user.Email, role: user.RoleName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check email trùng
    const [existing] = await db.query("SELECT 1 FROM Users WHERE Email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Thêm user
    const [result] = await db.query(
      "INSERT INTO Users (UserName, Password, Email, RoleName) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, role]
    );

    const userId = result.insertId;

    // Nếu là Candidate → thêm Candidate
    if (role === "candidate") {
      const candidateId = "C" + String(userId).padStart(5, "0");
      await db.query(
        "INSERT INTO Candidate (ID_User, ID_Candidate, FullName) VALUES (?, ?, ?)",
        [userId, candidateId, username]
      );
    }

    // Nếu là Employer → thêm Employer
    if (role === "employer") {
      const employerId = "E" + String(userId).padStart(5, "0");
      await db.query(
        "INSERT INTO Employer (ID_User, ID_Employer, Company_Name) VALUES (?, ?, ?)",
        [userId, employerId, username]
      );
    }

    // Lấy lại user để trả ra + tạo token
    const [rows] = await db.query("SELECT * FROM Users WHERE ID_User = ?", [userId]);
    const user = rows[0];
    const token = signToken(user);

    return res.status(201).json({
      message: "Register success",
      token,
      user: {
        id: user.ID_User,
        username: user.UserName,
        email: user.Email,
        role: user.RoleName,
      },
    });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Tìm user theo email
    const [rows] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = rows[0];

    // So sánh password
    const ok = await bcrypt.compare(password, user.Password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Tạo JWT
    if (!process.env.JWT_SECRET) {
      console.warn("[WARN] JWT_SECRET is missing in .env");
    }
    const token = signToken(user);

    // Trả về token + user (ẩn password)
    return res.status(200).json({
      message: "Login success",
      token,
      user: {
        id: user.ID_User,
        username: user.UserName,
        email: user.Email,
        role: user.RoleName,
      },
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return res.status(500).json({ error: err.message });
  }
};
