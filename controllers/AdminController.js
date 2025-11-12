const { render } = require("ejs");
const connection = require("../config/db");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const axios = require("axios");
//===================== DASHBOARD =====================//
exports.dashboard = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect('/');

  const success = req.session.success;
  delete req.session.success;

  try {
    const [rows] = await connection.query(`
      SELECT
          -- Users
          COUNT(*) AS total_user,
          SUM(CASE WHEN u.status = 1 THEN 1 ELSE 0 END) AS active_user,
          SUM(CASE WHEN u.status != 1 THEN 1 ELSE 0 END) AS inactive_user,

          -- Rides
          (SELECT COUNT(*) FROM rides) AS total_ride,
          (SELECT SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) FROM rides) AS ride_placed,
          (SELECT SUM(CASE WHEN status = 5 THEN 1 ELSE 0 END) FROM rides) AS ride_on_going,
          (SELECT SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) FROM rides) AS ride_completed,

          -- Ride Bookings
          (SELECT COUNT(*) FROM ride_bookings) AS total_ride_booking,
          (SELECT SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) FROM ride_bookings) AS pending_requests,

          -- Ride Payments
          (SELECT SUM(amount) FROM ride_payments WHERE payment_status = 1) AS total_earnings,
          (SELECT SUM(admin_commission) FROM ride_payments WHERE payment_status = 1) AS total_admin_commission
      FROM users u;
    `);

    const dashboardData = rows[0];

    res.render("index", {
      admin,
      success,
      dashboardData
    });

  } catch (error) {
    console.error(error);
    res.render("index", { admin, success, dashboardData: {} });
  }
};


//================= USER LIST ==================//
exports.users = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect('/');

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const [countRows] = await connection.query("SELECT COUNT(*) AS total FROM users");
    const totalUsers = countRows[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    const [users] = await connection.query(
      "SELECT * FROM users ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.render("users", {
	  admin,	
      users,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
};
// ✅ Multer Storage Configuration
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads/logo");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ✅ Multer Middleware
const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.test(ext)) {
      return cb(new Error("Only image files are allowed (.jpg, .jpeg, .png, .webp)"));
    }
    cb(null, true);
  },
}).single("site_logo");

// ✅ Controller: Render Settings Page
exports.setting = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect("/");

  try {
    // Fetch System Settings
    const [settings] = await connection.query("SELECT * FROM setting");

    // Fetch Admin Settings (Logo & Name)
    const [adminSettingRows] = await connection.query(
      "SELECT site_name, site_logo FROM admin_settings LIMIT 1"
    );
    const adminSetting = adminSettingRows.length
      ? adminSettingRows[0]
      : { site_name: "", site_logo: "" };

    res.render("setting", {
		admin,
      settings,
      site_name: adminSetting.site_name,
      site_logo: adminSetting.site_logo,
    });
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Controller: Update Settings + Logo + Site Name
exports.updateSetting = async (req, res) => {
  uploadLogo(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { id, upload_document_status, site_name } = req.body;
    const file = req.file;

    try {
      // Update system setting
      await connection.query(
        "UPDATE setting SET upload_document_status = ?, updated = NOW() WHERE id = ?",
        [upload_document_status, id]
      );

      // Prepare new logo path if uploaded
      let logoPath = null;
      if (file) {
        logoPath = `/uploads/logo/${file.filename}`;
      }

      // Update admin settings
      if (logoPath) {
        await connection.query(
          "UPDATE admin_settings SET site_name = ?, site_logo = ?",
          [site_name, logoPath]
        );
      } else {
        await connection.query(
          "UPDATE admin_settings SET site_name = ?",
          [site_name]
        );
      }

      res.json({
        success: true,
        message: "Settings updated successfully!",
        site_logo: logoPath,
      });
    } catch (err) {
      console.error("Error updating settings:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  });
};



//===================== BLOCK / UNBLOCK USER =====================//
exports.blockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await connection.query("UPDATE users SET status = 0 WHERE id = ?", [userId]);
    
    // AJAX friendly response
    res.json({ success: true, message: "User blocked successfully" });
  } catch (err) {
    console.error("Error blocking user:", err);
    res.json({ success: false, message: "Failed to block user" });
  }
};

exports.unblockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await connection.query("UPDATE users SET status = 1 WHERE id = ?", [userId]);
    res.json({ success: true, message: "User unblocked successfully" });
  } catch (err) {
    console.error("Error unblocking user:", err);
    res.json({ success: false, message: "Failed to unblock user" });
  }
};

//===================== USER DOCUMENT DETAILS =====================//
exports.userDetail = async (req, res) => {
  const userId = req.params.id;
const admin = req.session.admin;
  if (!admin) return res.redirect("/");
  try {
    const [rows] = await connection.query(
      `SELECT id, user_id, passport_photo, aadhar_photo, aadhar_back_photo, pan_photo, created_at
       FROM user_documents
       WHERE user_id = ?`,
      [userId]
    );

    
    const documents = rows[0] || { user_id: userId };

    res.render("user-detail", {
		admin,
      documents,
      BASE_URL: process.env.BASE_URL || "http://localhost:3000/"
    });
  } catch (err) {
    console.error("Error fetching user document details:", err);
    res.status(500).send("Internal Server Error");
  }
};
//=======================user_view more =================//
exports.user_view_more = async (req, res) => {
  const userId = req.params.id;
const admin = req.session.admin;
  if (!admin) return res.redirect("/");
  try {
    // User details
    const [user] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (!user.length) return res.send("User not found");
    const userData = user[0];

    // Safe wallet (agar null ya string ho)
    userData.wallet = parseFloat(userData.wallet || 0);

    // Rides (Publish)
    const [publishRides] = await connection.query(
      "SELECT * FROM rides WHERE user_id = ?",
      [userId]
    );

    // My Rides (booking)
    const [myRides] = await connection.query(
      `SELECT rb.id AS booking_id, r.start_address, r.end_address, r.ride_date, rb.status
       FROM ride_bookings rb
       JOIN rides r ON rb.ride_id = r.id
       WHERE rb.user_id = ?`,
      [userId]
    );

    // Wallet Transactions
const [walletTxRaw] = await connection.query(
  `
    SELECT *
    FROM (
      SELECT 
          id,
          'ride_payment' AS source,
          id AS ref_id,
          amount * -1 AS amount,
          'debit' AS type,
          NULL AS purpose,
          created_at
      FROM ride_payments
      WHERE user_id = ?

      UNION ALL

      SELECT 
          id,
          'due_payment' AS source,
          id AS ref_id,
          amount * -1 AS amount,
          CASE 
            WHEN status = 1 THEN 'debit'
            WHEN status = 0 THEN 'pending'
            ELSE 'rejected'
          END AS type,
          NULL AS purpose,
          created_at
      FROM due_payments
      WHERE user_id = ?

      UNION ALL

      SELECT 
          id,
          'transaction' AS source,
          NULL AS ref_id,
          amount,
          CASE WHEN amount >= 0 THEN 'credit' ELSE 'debit' END AS type,
          purpose,
          created_at
      FROM transactions
      WHERE user_id = ?
    ) AS all_tx

    ORDER BY created_at ASC
  `,
  [userId, userId, userId]
);

// Add running balance manually in Node.js
let runningBalance = user.wallet || 0; // agar aap user ka current wallet rakhte ho
const walletTx = walletTxRaw
  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // ensure chronological
  .map(tx => {
    runningBalance += parseFloat(tx.amount || 0);
    return {
      ...tx,
      amount: parseFloat(tx.amount || 0),
      balance_after: runningBalance
    };
  })
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // reverse order for display


    // Vehicles
    const [vehicles] = await connection.query(
      "SELECT * FROM vehicles WHERE user_id = ?",
      [userId]
    );

    // Render with safe data
    res.render("user_view_more", {
      user: userData,
      publishRides,
      myRides,
      walletTx,
      vehicles
    });

  } catch (err) {
    console.error("User View Error:", err);
    res.status(500).send("Server Error");
  }
};


//===================== INACTIVE USERS =====================//
exports.inactive_users = async (req, res) => {
	const admin = req.session.admin;
  if (!admin) return res.redirect("/");
  try {
    const [users] = await connection.query("SELECT * FROM users WHERE status = 0");
    res.render("users", {
		admin,
      users,
      statusType: "Inactive"
    });
  } catch (err) {
    console.error("Error fetching inactive users:", err);
    res.status(500).send("Internal Server Error");
  }
};

//===================== RIDE LIST =====================//
exports.ride_list = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect('/');

  try {
    const [rows] = await connection.query(`
      SELECT r.*, u.name AS user_name
      FROM rides r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.id DESC
    `);

    res.render("ride-details", { admin, documents: rows });
  } catch (err) {
    console.error("Error fetching rides:", err);
    res.status(500).send("Internal Server Error");
  }
};



//===================== DELETE RIDE =====================//
exports.ride_delete = async (req, res) => {
  const rideId = req.params.id;

  try {
    await connection.query("DELETE FROM rides WHERE id = ?", [rideId]);
    res.redirect("/ride-details");
  } catch (err) {
    console.error("Ride Delete Error:", err);
    res.status(500).send("Error deleting ride");
  }
};


//===================== VEHICLE LIST =====================//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads/car/carBrand");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// =====================
// Brand List
// =====================
// ✅ Show page only
exports.brand_list = async (req, res) => {
	const admin = req.session.admin;
  if (!admin) return res.redirect("/");
  try {
    res.render("brand_list", {admin}); // no brands passed
  } catch (err) {
    console.error("Error rendering brand list page:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Separate route for AJAX brand data
exports.get_brands = async (req, res) => {
  try {
    const [brands] = await connection.query("SELECT brand_id, brand_name, image FROM CarBrand");
    res.json({ success: true, brands });
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// =====================
// Add Brand
// =====================
exports.add_brand = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { brand_name } = req.body;
      if (!brand_name) return res.json({ success: false, message: "Brand name is required" });

      let imagePath = req.file ? "/uploads/car/carBrand/" + req.file.filename : null;

      await connection.query("INSERT INTO CarBrand (brand_name, image) VALUES (?, ?)", [brand_name, imagePath]);

      res.json({ success: true, message: "Brand added successfully" });
    } catch (err) {
      console.error("Add Brand Error:", err);
      res.json({ success: false, message: "Failed to add brand" });
    }
  },
];

// =====================
// Edit Brand
// =====================
exports.edit_brand = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { brand_id, brand_name, old_image } = req.body;
      if (!brand_id || !brand_name) return res.json({ success: false, message: "Brand ID and name required" });

      let imagePath = req.file ? "/uploads/car/carBrand/" + req.file.filename : old_image || null;

      await connection.query(
        "UPDATE CarBrand SET brand_name = ?, image = ? WHERE brand_id = ?",
        [brand_name, imagePath, brand_id]
      );

      res.json({ success: true, message: "Brand updated successfully" });
    } catch (err) {
      console.error("Edit Brand Error:", err);
      res.json({ success: false, message: "Failed to update brand" });
    }
  },
];

// =====================
// Delete Brand
// =====================
exports.delete_brand = async (req, res) => {
  try {
    const { brand_id } = req.body;
    if (!brand_id) return res.json({ success: false, message: "Brand ID required" });

    await connection.query("DELETE FROM CarBrand WHERE brand_id = ?", [brand_id]);
    res.json({ success: true, message: "Brand deleted successfully" });
  } catch (err) {
    console.error("Delete Brand Error:", err);
    res.json({ success: false, message: "Failed to delete brand" });
  }
};


// ===================== MULTER CONFIG FOR MODEL =====================
const storagemodal = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads/car/carModal");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// use the correct variable name here 👇
const uploadmodal = multer({ storage: storagemodal });

// ===================== MODEL CONTROLLER =====================

// Model List (View Page)
exports.modal_list = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect("/");

  try {
    res.render("modal_list", { admin });
  } catch (err) {
    console.error("Error rendering modal list page:", err);
    res.status(500).send("Internal Server Error");
  }
};


// Get Models
exports.get_modal = async (req, res) => {
  try {
    const [models] = await connection.query(`
      SELECT 
        cm.model_id, 
        cm.brand_id, 
        cb.brand_name,
        cm.model_name, 
        cm.category, 
        cm.sub_category, 
        cm.fuel_type, 
        cm.transmission, 
        cm.notes, 
        cm.image
      FROM CarModel cm
      LEFT JOIN CarBrand cb ON cm.brand_id = cb.brand_id
    `);
    res.json({ success: true, models });
  } catch (err) {
    console.error("Error fetching models:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Add Model
exports.add_modal = [
  uploadmodal.single("image"),
  async (req, res) => {
    try {
      const { brand_id, model_name, category, sub_category, fuel_type, transmission, notes } = req.body;

      if (!brand_id || !model_name)
        return res.json({ success: false, message: "Brand and Model Name required" });

      const imagePath = req.file ? "/uploads/car/carModal/" + req.file.filename : null;

      await connection.query(
        `INSERT INTO CarModel (brand_id, model_name, category, sub_category, fuel_type, transmission, notes, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [brand_id, model_name, category, sub_category, fuel_type, transmission, notes, imagePath]
      );

      res.json({ success: true, message: "Model added successfully" });
    } catch (err) {
      console.error("Add Model Error:", err);
      res.json({ success: false, message: "Failed to add model" });
    }
  },
];

// Edit Model
exports.edit_modal = [
  uploadmodal.single("image"),
  async (req, res) => {
    try {
      const { model_id, brand_id, model_name, category, sub_category, fuel_type, transmission, notes, old_image } = req.body;
      if (!model_id || !brand_id || !model_name)
        return res.json({ success: false, message: "Model ID, Brand, and Name required" });

      const imagePath = req.file ? "/uploads/car/carModal/" + req.file.filename : old_image || null;

      await connection.query(
        `UPDATE CarModel 
         SET brand_id=?, model_name=?, category=?, sub_category=?, fuel_type=?, transmission=?, notes=?, image=? 
         WHERE model_id=?`,
        [brand_id, model_name, category, sub_category, fuel_type, transmission, notes, imagePath, model_id]
      );

      res.json({ success: true, message: "Model updated successfully" });
    } catch (err) {
      console.error("Edit Model Error:", err);
      res.json({ success: false, message: "Failed to update model" });
    }
  },
];

// Delete Model
exports.delete_modal = async (req, res) => {
  try {
    const { model_id } = req.body;
    if (!model_id) return res.json({ success: false, message: "Model ID required" });

    await connection.query("DELETE FROM CarModel WHERE model_id = ?", [model_id]);
    res.json({ success: true, message: "Model deleted successfully" });
  } catch (err) {
    console.error("Delete Model Error:", err);
    res.json({ success: false, message: "Failed to delete model" });
  }
};







exports.vehicle_list = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect('/');

  try {
    const [vehicles] = await connection.query(`
      SELECT v.*, u.name AS user_name
      FROM vehicles v
      LEFT JOIN users u ON v.user_id = u.id
      ORDER BY v.id DESC
    `);

    res.render("vehicle", { 
      admin, 
      documents: vehicles 
    });
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).send("Internal Server Error");
  }
};




//===================== ADD VEHICLE =====================//
exports.addVehicle = async (req, res) => {
  const { color_name, color_code } = req.body;

  try {
    await connection.query(
      "INSERT INTO vehicle_colors (color_code, color_name, created_at) VALUES (?, ?, NOW())",
      [color_code, color_name]
    );
    res.redirect('/vehicle');
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).send("Error adding vehicle");
  }
};



//================ VEHICLE COLOR =====================//
exports.vehicle_color = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect('/');

  try {
    const [rows] = await connection.query(`SELECT * FROM vehicle_colors`);
    res.render("vehicle_color", { admin,documents: rows });
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).send("Internal Server Error");
  }
};



//=============== DELETE VEHICLE COLOR ===============//
exports.vehicleColor_delete = async (req, res) => {
  const rideId = req.params.id;

  try {
    await connection.query("DELETE FROM vehicle_colors WHERE id = ?", [rideId]);
    res.redirect("/vehicle_color");
  } catch (err) {
    console.error("Ride Delete Error:", err);
    res.status(500).send("Error deleting ride");
  }
};



//==============UPDATE VEHICLE COLOR==================//
exports.update_vehiclecolor = async (req, res) => {
  const { color_name, color_code } = req.body;
  const id = req.params.id; 
  try {
    await connection.query(
      "UPDATE vehicle_colors SET color_name = ?, color_code = ? WHERE id = ?",
      [color_name, color_code, id]
    );
    res.redirect('/vehicle_color');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating vehicle color");
  }
};


//===================== FEEDBACK =====================//
exports.feedback = async (req, res) => {
	const admin = req.session.admin; 
	if (!admin) return res.redirect("/");
  try {
    const page = parseInt(req.query.page) || 1; // current page
    const limit = 10; // records per page
    const offset = (page - 1) * limit;

    // Get total count
    const [countRows] = await connection.query(`SELECT COUNT(*) as total FROM ratings`);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated feedback with reviewer/reviewee names
    const [rows] = await connection.query(`
      SELECT 
        r.id,
        r.ride_id,
        r.rating,
        r.comment,
        r.created_at,
        reviewer.name AS reviewer_name,
        reviewee.name AS reviewee_name
      FROM ratings r
      LEFT JOIN users reviewer ON reviewer.id = r.reviewer_id
      LEFT JOIN users reviewee ON reviewee.id = r.reviewee_id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    res.render("feedback", { 
		admin,
      documents: rows,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).send("Internal Server Error");
  }
};



//===================== RIDE BOOKING =====================//
exports.ride_booking = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect('/'); // redirect if not logged in

  try {
    // Fetch all ride bookings with user name
    const [bookings] = await connection.query(`
      SELECT rb.*, u.name AS user_name
      FROM ride_bookings rb
      JOIN users u ON u.id = rb.user_id
    `);

    // Map bookings to include start_address and end_address
    const detailedBookings = await Promise.all(bookings.map(async (booking) => {
      let start_address = '';
      let end_address = '';

      if (!booking.from_stop_id && !booking.to_stop_id) {
        // If both stops are null, get addresses from rides table
        const [ride] = await connection.query(
          `SELECT start_address, end_address FROM rides WHERE id = ?`,
          [booking.ride_id]
        );
        if (ride.length) {
          start_address = ride[0].start_address;
          end_address = ride[0].end_address;
        }
      } else {
        // If from_stop_id exists, get start address from ride_stops
        if (booking.from_stop_id) {
          const [fromStop] = await connection.query(
            `SELECT full_address FROM ride_stops WHERE id = ?`,
            [booking.from_stop_id]
          );
          if (fromStop.length) start_address = fromStop[0].full_address;
        } else {
          // fallback to ride start_address
          const [ride] = await connection.query(
            `SELECT start_address FROM rides WHERE id = ?`,
            [booking.ride_id]
          );
          if (ride.length) start_address = ride[0].start_address;
        }

        // If to_stop_id exists, get end address from ride_stops
        if (booking.to_stop_id) {
          const [toStop] = await connection.query(
            `SELECT full_address FROM ride_stops WHERE id = ?`,
            [booking.to_stop_id]
          );
          if (toStop.length) end_address = toStop[0].full_address;
        } else {
          // fallback to ride end_address
          const [ride] = await connection.query(
            `SELECT end_address FROM rides WHERE id = ?`,
            [booking.ride_id]
          );
          if (ride.length) end_address = ride[0].end_address;
        }
      }

      return {
        ...booking,
        start_address,
        end_address,
      };
    }));

    res.render("ridebooking_details", { admin,documents: detailedBookings });
  } catch (err) {
    console.error("Error fetching ride bookings:", err);
    res.status(500).send("Internal Server Error");
  }
};


//===================== UPDATE DOCUMENT STATUS =====================//
exports.updateDocumentStatus = async (req, res) => {
  const userId = req.params.id;
  const status = req.params.status;

  try {
    const [result] = await connection.query(
      'UPDATE users SET document_status = ? WHERE id = ?',
      [status, userId]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Document status updated successfully.' });
    } else {
      res.status(404).json({ message: 'User not found or no change in status.' });
    }
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

//===================== WALLET HISTORY =====================//
exports.payment = async (req, res) => {
	const admin = req.session.admin;  
	if (!admin) return res.redirect("/");
  try {
    const [rows] = await connection.query(`
      SELECT 
          rp.id,
          rp.ride_id,
          rp.user_id,
          rp.driver_id,
          rp.amount,
          rp.payment_mode,
          rp.admin_commission,
          rp.driver_earning,
          rp.transaction_id,
          rp.payment_status,
          rp.status,
          rp.created_at,
          rb.distance_km,
          -- Determine start address
          COALESCE(rs_from.full_address, r.start_address) AS from_address,
          -- Determine end address
          COALESCE(rs_to.full_address, r.end_address) AS to_address,
          -- Fetch user and driver names
          u.name AS user_name,
          d.name AS driver_name
      FROM ride_payments rp
      LEFT JOIN ride_bookings rb ON rp.ride_id = rb.id
      LEFT JOIN rides r ON rb.ride_id = r.id
      LEFT JOIN ride_stops rs_from ON rb.from_stop_id = rs_from.id
      LEFT JOIN ride_stops rs_to ON rb.to_stop_id = rs_to.id
      LEFT JOIN users u ON rp.user_id = u.id
      LEFT JOIN users d ON rp.driver_id = d.id
      ORDER BY rp.created_at DESC
    `);

    // Render the Payment page with enriched data
    res.render("Payment", { admin,documents: rows });
  } catch (err) {
    console.error("Error fetching payment history:", err);
    res.status(500).send("Internal Server Error");
  }
};


//===================== DELETE PAYMENT =====================//
exports.Payment_delete = async (req, res) => {
  const id = req.params.id;

  try {
    await connection.query("DELETE FROM ride_payments WHERE id = ?", [id]);
    res.redirect('/Payment');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting payment");
  }
};

//===================== USER NOTIFICATIONS =====================//
// Get all notifications
exports.user_notification = async (req, res) => {
		const admin = req.session.admin;  
	if (!admin) return res.redirect("/");
  try {
    const [notifications] = await connection.query(`SELECT * FROM user_notifications ORDER BY created_at DESC`);
    const [users] = await connection.query(`SELECT id, name FROM users ORDER BY name ASC`);
    res.render("notification", { admin,documents: notifications, users });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Send notification to multiple users
exports.send_notification = async (req, res) => {
  console.log("dfghjhgfdsdfghjkjhgfdsdfghjhgfdsdfghjhgfdsdfghgfd")
  const { user_ids, title, message } = req.body;

  // ✅ Input validation
  if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0 || !title || !message) {
    return res.status(400).send("Please provide user IDs, title, and message");
  }

  try {
    // ✅ Prepare insert data (bulk insert)
    const insertValues = user_ids.map(id => [
      id,
      title,
      message,
      0, // is_read = unread
      new Date() // created_at
    ]);

    // ✅ Insert into table
    await connection.query(
      `INSERT INTO user_notifications (user_id, title, message, is_read, created_at) VALUES ?`,
      [insertValues]
    );

    // ✅ Redirect or send response
    res.redirect("/notification");
    // Or use: res.json({ success: true, message: "Notifications sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending notifications:", err);
    res.status(500).send("Error sending notifications");
  }
};


// Delete a notification
exports.notification_delete = async (req, res) => {
  const id = req.params.id;
  try {
    await connection.query("DELETE FROM user_notifications WHERE id = ?", [id]);
    res.redirect('/notification');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting notification");
  }
};
exports.notification_delete_multiple = async (req, res) => {
  try {
    const ids = req.body.ids ? req.body.ids.split(',') : [];
    if (ids.length === 0) return res.redirect('/notification');

    const placeholders = ids.map(() => '?').join(',');
    await connection.query(`DELETE FROM user_notifications WHERE id IN (${placeholders})`, ids);
    res.redirect('/notification');
  } catch (error) {
    console.error("Error deleting multiple notifications:", error);
    res.status(500).send("Error deleting notifications");
  }
};

//===================== DUE PAYMENTS =====================//
exports.due_payment = async (req, res) => {
		const admin = req.session.admin;  
	if (!admin) return res.redirect("/");
  try {
    const [rows] = await connection.query(`SELECT * FROM due_payments`);
    res.render("duepayment", {admin, documents: rows });
  } catch (err) {
    console.error("Error fetching due payments:", err);
    res.status(500).send("Internal Server Error");
  }
};

//===================== FARE RULES =====================//
exports.fare_rules = async (req, res) => {
		const admin = req.session.admin;  
	if (!admin) return res.redirect("/");
  try {
    const [rows] = await connection.query(`SELECT * FROM fare_rules`);
    res.render("fare-rules", { admin,documents: rows });
  } catch (err) {
    console.error("Error fetching fare rules:", err);
    res.status(500).send("Internal Server Error");
  }
};


//===============DELETE RULES========================//
exports.deletefare_rules = async (req, res) => {
  const id = req.params.id; 
  try {
    await connection.query("DELETE FROM fare_rules WHERE id = ?", [id]);
    res.redirect('/fare-rules');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting fare rule");
  }
};



//=================================================//
exports.addPayment = async (req, res) => {
  const { min_km, max_km, rate_per_km } = req.body; 
  try {
    await connection.query(
      "INSERT INTO fare_rules (min_km, max_km, rate_per_km, created_at) VALUES (?, ?, ?, NOW())",
      [min_km, max_km, rate_per_km]
    );
    res.redirect('/fare-rules');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding fare rule");
  }
};


//===============================================//
exports.updateFareRule = async (req, res) => {
  const { min_km, max_km, rate_per_km } = req.body;
  const id = req.params.id; 
  try {
    await connection.query(
      "UPDATE fare_rules SET min_km = ?, max_km = ?, rate_per_km = ? WHERE id = ?",
      [min_km, max_km, rate_per_km, id]
    );
    res.redirect('/fare-rules');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating fare rule");
  }
};


//===================== BANK DETAILS =====================//
exports.bank_details = async (req, res) => {
	const admin = req.session.admin; 
 if (!admin) return res.redirect("/");
  try {
    const [rows] = await connection.query(`
      SELECT 
        uba.*,
        u.name AS user_name
      FROM user_bank_accounts uba
      LEFT JOIN users u ON u.id = uba.user_id
      ORDER BY uba.id DESC
    `);

    res.render("bankdetails", { admin , documents: rows });
  } catch (err) {
    console.error("Error fetching bank details:", err);
    res.status(500).send("Internal Server Error");
  }
};



//===================================================//
exports.bankdetails_delete = async (req, res) => {
  const id = req.params.id;

  try {
    await connection.query("DELETE FROM user_bank_accounts WHERE id = ?", [id]);
    res.redirect('/bankdetails');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting bank details");
  }
};

//===================== RIDE STOP DETAILS =====================//
exports.ride_stop = async (req, res) => {
	const admin = req.session.admin;  
	if (!admin) return res.redirect("/");
  const rideId = req.params.id;

  try {
    const [rows] = await connection.query(
      `SELECT * FROM ride_stops WHERE ride_id = ?`,
      [rideId]
    );

    if (rows.length === 0) {
      return res.status(404).send("No stops found for this ride.");
    }

    res.render("ride_stop", { admin,documents: rows });
  } catch (err) {
    console.error("Error fetching ride stops:", err);
    res.status(500).send("Internal Server Error");
  }
};

//===================== COMMISSION =====================//
exports.commission = async (req, res) => {
		const admin = req.session.admin;  
	if (!admin) return res.redirect("/");
  try {
    const [rows] = await connection.query(`SELECT * FROM commission_settings`);
    res.render("commission", { admin,documents: rows });
  } catch (err) {
    console.error("Error fetching commission:", err);
    res.status(500).send("Internal Server Error");
  }
};


//=================================================//
exports.commission_delete = async (req, res) => {
  const id = req.params.id;

  try {
    await connection.query("DELETE FROM commission_settings WHERE id = ?", [id]);
    res.redirect('/commission');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting commission");
  }
};


//================================================//
exports.add_commission = async (req, res) => {
  const { percentage } = req.body;
  let qr_image = null;

  if (req.file){
    qr_image = '/uploads/' + req.file.filename;
  }

  try {
    await connection.query(
      "INSERT INTO commission_settings (percentage, qr_image) VALUES (?, ?)",
      [percentage, qr_image]
    );
    res.redirect('/commission');
  } catch (error) {
    console.error("Error adding commission:", error);
    res.status(500).send("Error adding commission");
  }
};

    
//==================================================//
exports.update_commission = async (req, res) => {
  const id = req.params.id;
  const { percentage } = req.body;
  let qr_image = null;

  if (req.file){
    qr_image = '/uploads/' + req.file.filename;
  }

  try {
    let query = "UPDATE commission_settings SET percentage = ? WHERE id = ?";
    let values = [percentage, id];

    if (qr_image) {
      query = "UPDATE commission_settings SET percentage = ?, qr_image = ? WHERE id = ?";
      values = [percentage, qr_image, id];
    }

    await connection.query(query, values);
    res.redirect('/commission');
  } catch (error) {
    console.error("Error updating commission:", error);
    res.status(500).send("Error updating commission");
  }
};

//===================== REPORT =====================//


exports.report = async (req, res) => {
  const admin = req.session.admin;
  if (!admin) {
    return res.redirect('/');
  }

  try {
    const query = `
      SELECT 
        r.id,
        r.reporter_id,
        r.reported_user_id,
        r.reason,
        r.created_at,
        COALESCE(reporter.name, 'Unknown Reporter') AS reporter_name,
        COALESCE(reported.name, 'Unknown User') AS reported_name
      FROM reports r
      LEFT JOIN users AS reporter ON r.reporter_id = reporter.id
      LEFT JOIN users AS reported ON r.reported_user_id = reported.id
      ORDER BY r.id DESC
    `;

    const [reports] = await connection.query(query);

    res.render("report", { 
      admin, 
      reports 
    });
  } catch (error) {
    console.error("❌ Error fetching reports:", error.message);
    res.status(500).render("error", { 
      message: "Unable to load reports. Please try again later.", 
      error 
    });
  }
};



//===================== WITHDRAWAL HISTORY =====================//
// 📄 Controller: withdrawal.js

// Get all withdrawal requests
exports.withdrwal_history = async (req, res) => {
		const admin = req.session.admin;  
	if (!admin) return res.redirect("/");
  try {
    const [rows] = await connection.query(`
      SELECT id, user_id, account_id, amount, status, requested_at, processed_at, remarks 
      FROM withdraw_requests ORDER BY id DESC
    `);
    res.render("withdrwal", { admin,documents: rows });
  } catch (err) {
    console.error("Error fetching withdrawal requests:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ AJAX Update with Cashfree Payout (Test Mode) + Wallet Refund Logic
exports.update_withdraw_status = async (req, res) => {
  const { id, status, remarks } = req.body;

  try {
    // ✅ Step 1: Fetch withdrawal request
    const [[withdraw]] = await connection.execute(
      `SELECT * FROM withdraw_requests WHERE id = ?`,
      [id]
    );

    if (!withdraw) {
      return res.json({ success: false, message: "Withdrawal request not found" });
    }

    // Prevent double processing
    if (withdraw.status !== 0) {
      return res.json({ success: false, message: "Already processed request" });
    }

    // ✅ Step 2: On APPROVE, simulate Cashfree payout
    if (status == 1) {
      try {
        // 🧪 Cashfree TEST MODE Credentials
        const clientId = "CFTEST5Y39FLMXK4AQ";  
        const clientSecret = "cfsk_test_6e9c1e4eebc4d37c143d2f77a57c8c5e7b90c55b";

        // 🔹 Get Authentication Token from Cashfree Test Environment
        const authRes = await axios.post(
          "https://sandbox.cashfree.com/payout/v1/authorize",
          {},
          {
            headers: {
              "X-Client-Id": clientId,
              "X-Client-Secret": clientSecret,
            },
          }
        );

        const token = authRes.data.data?.token;
        if (!token) throw new Error("Failed to get Cashfree Auth Token");

        // 🔹 Simulate Payout API call (Test environment)
        // (In production, you'll send actual beneficiary + amount details)
        const success = Math.random() > 0.2; // 80% success chance

        if (success) {
          await connection.execute(
            `UPDATE withdraw_requests 
             SET status = 1, remarks = ?, processed_at = NOW() 
             WHERE id = ?`,
            [remarks || "Withdrawal approved via Cashfree (Test)", id]
          );

          return res.json({
            success: true,
            message: "✅ Withdrawal Approved Successfully (Cashfree Test)",
          });
        } else {
          // ❌ If payout failed → refund wallet
          await connection.execute(
            `UPDATE withdraw_requests 
             SET status = 2, remarks = ?, processed_at = NOW() 
             WHERE id = ?`,
            ["Cashfree payout failed. Refunded to wallet.", id]
          );

          await connection.execute(
            `UPDATE users SET wallet = wallet + ? WHERE id = ?`,
            [withdraw.amount, withdraw.user_id]
          );

          return res.json({
            success: false,
            message: "❌ Payout failed (test). Refunded to wallet.",
          });
        }
      } catch (err) {
        console.error("Cashfree API Error:", err.message);

        // Refund if any API error occurs
        await connection.execute(
          `UPDATE withdraw_requests 
           SET status = 2, remarks = ?, processed_at = NOW() 
           WHERE id = ?`,
          ["Cashfree payout API error. Refunded to wallet.", id]
        );

        await connection.execute(
          `UPDATE users SET wallet = wallet + ? WHERE id = ?`,
          [withdraw.amount, withdraw.user_id]
        );

        return res.json({
          success: false,
          message: "⚠️ Cashfree API error. Amount refunded.",
        });
      }
    }

    // ✅ Step 3: On REJECT → refund to wallet
    if (status == 2) {
      await connection.execute(
        `UPDATE withdraw_requests 
         SET status = 2, remarks = ?, processed_at = NOW() 
         WHERE id = ?`,
        [remarks || "Rejected by admin", id]
      );

      await connection.execute(
        `UPDATE users SET wallet = wallet + ? WHERE id = ?`,
        [withdraw.amount, withdraw.user_id]
      );

      return res.json({
        success: true,
        message: "💰 Withdrawal Rejected & Refunded Successfully",
      });
    }

    // ✅ Step 4: Invalid status
    return res.json({ success: false, message: "Invalid status provided" });
  } catch (err) {
    console.error("Error updating withdrawal:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    //const admin = req.session.admin;
	const admin = req.session.admin;
    if (!admin) return res.json({ success: false, message: "Unauthorized" });

    // Directly get data from req.body
    const current_password = req.body.current_password;
    const new_password = req.body.new_password;
    const confirm_password = req.body.confirm_password;

    if (!current_password || !new_password || !confirm_password)
      return res.json({ success: false, message: "All fields are required." });

    if (new_password !== confirm_password)
      return res.json({ success: false, message: "Passwords do not match." });

    // Fetch admin
    const [rows] = await connection.query("SELECT * FROM admins WHERE id = ?", [admin.id]);
    if (!rows || rows.length === 0) return res.json({ success: false, message: "Admin not found." });

    const user = rows[0];

    if (user.password !== current_password) {
      return res.json({ success: false, message: "Current password is incorrect." });
    }

    // Update password
    await connection.query("UPDATE admins SET password = ? WHERE id = ?", [new_password, admin.id]);

    return res.json({ success: true, message: "Password updated successfully!" });
  } catch (err) {
    console.error("Password update error:", err);
    return res.json({ success: false, message: "Internal server error.", error: err.message });
  }
};


//===================== AGENT TREE + COUNTRY =====================//
exports.agenttree = (req, res) => {
  res.render("agenttree");
};

exports.country_agent = (req, res) => {
  res.render("country");
};
