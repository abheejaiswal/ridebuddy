const { render } = require("ejs");
const connection = require("../config/db");

exports.dashboard = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect('/');

  const success = req.session.success;
  delete req.session.success;

  res.render("index", { admin, success });
};


exports.users = async (req, res) => {
  console.log("📥 Route hit: /users");

  const admin = req.session.admin;
  if (!admin) {
    console.log("❌ Admin session not found. Redirecting to login.");
    return res.redirect('/');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  console.log(`🔢 Pagination - Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

  try {
    const [countRows] = await connection.query("SELECT COUNT(*) AS total FROM users");
    const totalUsers = countRows[0].total;
    const totalPages = Math.ceil(totalUsers / limit);
    console.log(`📊 Total Users: ${totalUsers}, Total Pages: ${totalPages}`);

    const [users] = await connection.query(
      "SELECT * FROM users LIMIT ? OFFSET ?",
      [limit, offset]
    );
    console.log(`✅ Fetched ${users.length} users for page ${page}`);

    res.render("users", {
      users,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.blockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await connection.query("UPDATE users SET status = 0 WHERE id = ?", [userId]);
    console.log(`🔒 User ${userId} blocked.`);
    res.redirect("/users");
  } catch (err) {
    console.error("❌ Error blocking user:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Unblock user
exports.unblockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await connection.query("UPDATE users SET status = 1 WHERE id = ?", [userId]);
    console.log(`✅ User ${userId} unblocked.`);
    res.redirect("/users");
  } catch (err) {
    console.error("❌ Error unblocking user:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.userDetail = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await connection.query(
      `SELECT id, user_id, passport_photo, aadhar_photo, aadhar_back_photo, pan_photo, created_at
       FROM user_documents
       WHERE user_id = ?`, [userId]
    );

    const documents = rows[0]; // assuming one row per user

    if (!documents) {
      return res.status(404).send("Documents not found for this user.");
    }

    res.render("user-detail", { documents });
  } catch (err) {
    console.error("❌ Error fetching user document details:", err);
    res.status(500).send("Internal Server Error");
  }
};



exports.agenttree = (req , res) =>{
    res.render("agenttree");
};
exports.country_agent = (req , res) =>{
    res.render("country");
};


