import pool from "../configs/db.config.js";

// body: fullName, phone, email, address
// file: req.file (multer)
export async function upsertCandidateProfile(req, res) {
  try {
    if (!req.user?.id || req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const { fullName, phone, email, address } = req.body;

    // URL để client truy cập file
    let resumeUrl = null;
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    // Sinh ID_Candidate nếu lần đầu (vd: "C00001")
    // Dựa trên count + 1 đơn giản, prod nên có generator khác.
    const [rows] = await pool.execute(
      "SELECT ID_Candidate FROM Candidate WHERE ID_User = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      const [cntRows] = await pool.execute("SELECT COUNT(*) AS c FROM Candidate");
      const next = String((cntRows[0]?.c || 0) + 1).padStart(5, "0");
      const ID_Candidate = `C${next}`;

      await pool.execute(
        `INSERT INTO Candidate (ID_User, ID_Candidate, FullName, Address, Phonenumber, Resume_URL)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, ID_Candidate, fullName || null, address || null, phone || null, resumeUrl]
      );
    } else {
      const current = rows[0].ID_Candidate;
      // Nếu không upload file mới thì giữ link cũ
      let finalResume = resumeUrl;
      if (!finalResume) {
        const [oldRows] = await pool.execute(
          "SELECT Resume_URL FROM Candidate WHERE ID_User = ?",
          [req.user.id]
        );
        finalResume = oldRows[0]?.Resume_URL || null;
      }
      await pool.execute(
        `UPDATE Candidate
         SET FullName = ?, Address = ?, Phonenumber = ?, Resume_URL = ?
         WHERE ID_User = ?`,
        [fullName || null, address || null, phone || null, finalResume, req.user.id]
      );
    }

    return res.json({ ok: true, resumeUrl });
  } catch (err) {
    console.error("[UPSERT CANDIDATE]", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAllCandidates(req, res) {
  try {
    // Chỉ employer mới được xem
    if (!req.user?.id || req.user.role !== "employer") {
      return res.status(403).json({ message: "Employer only" });
    }

    const sql = `
      SELECT 
        C.ID_Candidate,
        C.FullName,
        C.Address,
        C.Phonenumber,
        C.Resume_URL,
        U.Email,
        U.DateCreate
      FROM Candidate C
      JOIN Users U ON C.ID_User = U.ID_User
      ORDER BY U.DateCreate DESC
    `;
    const [rows] = await pool.execute(sql);

    // Chuẩn hoá link CV (nếu có)
    const normalized = rows.map((r) => ({
      ...r,
      Resume_URL: r.Resume_URL
        ? (r.Resume_URL.startsWith("/uploads/")
            ? r.Resume_URL
            : `/uploads/${r.Resume_URL}`)
        : null,
    }));

    return res.json({ candidates: normalized });
  } catch (err) {
    console.error("[GET ALL CANDIDATES]", err);
    return res.status(500).json({ message: "Server error" });
  }
}