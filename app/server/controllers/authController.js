import db from "../configs/db.config.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Mã hoá password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check email trùng
    const [existing] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Thêm user vào bảng Users
    const [result] = await db.query(
      "INSERT INTO Users (UserName, Password, Email, RoleName) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, role]
    );

    const userId = result.insertId;

    // Nếu là Candidate thì thêm Candidate
    if (role === "candidate") {
      const candidateId = "C" + userId.toString().padStart(5, "0");
      await db.query(
        "INSERT INTO Candidate (ID_User, ID_Candidate, FullName) VALUES (?, ?, ?)",
        [userId, candidateId, username]
      );
    }

    // Nếu là Employer thì thêm Employer
    if (role === "employer") {
      const employerId = "E" + userId.toString().padStart(5, "0");
      await db.query(
        "INSERT INTO Employer (ID_User, ID_Employer, Company_Name) VALUES (?, ?, ?)",
        [userId, employerId, username]
      );
    }

    res.status(201).json({ message: "Register success!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Lấy user theo email
    const [rows] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = rows[0];

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Trả về thông tin user (ẩn password)
    res.status(200).json({
      message: "Login success",
      user: {
        id: user.ID_User,
        username: user.UserName,
        email: user.Email,
        role: user.RoleName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};