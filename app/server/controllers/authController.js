import db from "../configs/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function signToken(user) {
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

    const [existing] = await db.query("SELECT 1 FROM Users WHERE Email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO Users (UserName, Password, Email, RoleName) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, role]
    );

    const userId = result.insertId;

    if (role === "candidate") {
      const candidateId = "C" + String(userId).padStart(5, "0");
      await db.query(
        "INSERT INTO Candidate (ID_User, ID_Candidate, FullName) VALUES (?, ?, ?)",
        [userId, candidateId, username]
      );
    }

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
    const [rows] = await db.query("SELECT * FROM Users WHERE Email = ?", [
      email,
    ]);
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

    // Trả về token + user 
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

export const resetPasswordDirect = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    // Kiểm tra email tồn tại
    const [rows] = await db.query("SELECT * FROM Users WHERE Email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật vào DB
    await db.query("UPDATE Users SET Password = ? WHERE Email = ?", [
      hashedPassword,
      email,
    ]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("[RESET PASSWORD ERROR]", err);
    return res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
    const userId = req.user?.id; 
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ mật khẩu." });
    }
    
    // Lấy mật khẩu đã mã hóa hiện tại từ DB
    try {
        const [rows] = await db.query(
            "SELECT Password FROM Users WHERE ID_User = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Tài khoản không tồn tại." });
        }

        const hashedPassword = rows[0].Password;

        // So sánh mật khẩu hiện tại
        const isPasswordValid = await bcrypt.compare(currentPassword, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác." });
        }
        
        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Cập nhật mật khẩu mới vào DB
        await db.query(
            "UPDATE Users SET Password = ? WHERE ID_User = ?",
            [newHashedPassword, userId]
        );

        return res.status(200).json({ message: "Đổi mật khẩu thành công." });

    } catch (err) {
        console.error("[CHANGE PASSWORD ERROR]", err);
        return res.status(500).json({ message: "Lỗi máy chủ trong quá trình đổi mật khẩu." });
    }
};