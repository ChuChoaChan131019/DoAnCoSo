import db from "../configs/db.config.js"; // Đã sửa từ pool sang db

export async function upsertCandidateProfile(req, res) {
  try {
    if (!req.user?.id || req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const { fullName, phone, email, address } = req.body;

    let resumeUrl = null;
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    const [rows] = await db.execute( 
      "SELECT ID_Candidate FROM Candidate WHERE ID_User = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      const [cntRows] = await db.execute("SELECT COUNT(*) AS c FROM Candidate"); // Đã sửa pool.execute thành db.execute
      const next = String((cntRows[0]?.c || 0) + 1).padStart(5, "0");
      const ID_Candidate = `C${next}`;

      await db.execute( 
        `INSERT INTO Candidate (ID_User, ID_Candidate, FullName, Address, Phonenumber, Resume_URL)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, ID_Candidate, fullName || null, address || null, phone || null, resumeUrl]
      );
    } else {
      const current = rows[0].ID_Candidate;
      // Nếu không upload file mới thì giữ link cũ
      let finalResume = resumeUrl;
      if (!finalResume) {
        const [oldRows] = await db.execute( 
          "SELECT Resume_URL FROM Candidate WHERE ID_User = ?",
          [req.user.id]
        );
        finalResume = oldRows[0]?.Resume_URL || null;
      }
      await db.execute( 
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

export async function getAppliedCandidates(req, res) { 
  try {
    // Kiểm tra vai trò
    if (!req.user?.id || req.user.role !== "employer") {
      return res.status(403).json({ message: "Employer only" });
    }

    const userId = req.user.id;
    
    // Lấy ID_Employer của người dùng đang đăng nhập
    const [empRows] = await db.execute("SELECT ID_Employer FROM Employer WHERE ID_User = ?", [userId]);
    if (empRows.length === 0) {
        return res.json({ candidates: [], message: "Employer profile not found." });
    }
    const { ID_Employer } = empRows[0];


    // Truy vấn ứng viên đã apply vào Job thuộc Employer này
    const sql = `
      SELECT DISTINCT
        C.ID_Candidate,
        C.FullName,
        C.Address,
        C.Phonenumber,
        C.Resume_URL,
        U.Email,
        U.DateCreate,
        (SELECT COUNT(A.ID_Job) FROM Application A JOIN Job J ON A.ID_Job = J.ID_Job WHERE A.ID_Candidate = C.ID_Candidate AND J.ID_Employer = ?) AS ApplicationCount
      FROM Candidate C
      JOIN Users U ON C.ID_User = U.ID_User
      JOIN Application App ON C.ID_Candidate = App.ID_Candidate
      JOIN Job J ON App.ID_Job = J.ID_Job
      WHERE J.ID_Employer = ?
      ORDER BY U.DateCreate DESC
    `;

    const [rows] = await db.execute(sql, [ID_Employer, ID_Employer]); 

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
    console.error("[GET APPLIED CANDIDATES ERROR]", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getCandidateProfile(req, res){
  try {
    if (!req.user?.id || req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const userId = req.user.id;

    const sql = `SELECT C.ID_Candidate, C.FullName, C.Address, C.Phonenumber, C.Resume_URL, U.Email
                   FROM Candidate C
                   JOIN Users U ON C.ID_User=U.ID_User
                   WHERE C.ID_User = ?`;
    
    const [rows] = await db.execute(sql, [userId]); 

    if (rows.length === 0) {
      const [userRow] = await db.execute("SELECT Email FROM Users WHERE ID_User = ?", [userId]); // Đã sửa pool.execute thành db.execute
      return res.json({ Email: userRow[0]?.Email || "" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("[GET CANDIDATE PROFILE]", err);
    return res.status(500).json({ message: "Server error" });
  }
}