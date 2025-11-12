const connection = require("../config/db");
const fs = require('fs');
const path = require('path');


// exports.user_register = async (req, res) => {
//     const { name, email, phone, gender, dob } = req.body || {};

//     // First missing field check
//     if (!name) {
//         return res.status(200).json({ message: 'Name is required', status: 400 });
//     } else if (!email) {
//         return res.status(200).json({ message: 'Email is required', status: 400 });
//     } else if (!phone) {
//         return res.status(200).json({ message: 'Phone number is required', status: 400 });
//     } else if (!gender) {
//         return res.status(200).json({ message: 'Gender is required', status: 400 });
//     } else if (!dob) {
//         return res.status(200).json({ message: 'Date of Birth is required', status: 400 });
//     }

//     try {
//         // Email check
//         const [emailExists] = await connection.execute(
//             'SELECT id FROM users WHERE email = ? LIMIT 1',
//             [email]
//         );

//         if (emailExists.length > 0) {
//             return res.status(200).json({ message: 'Email already registered', status: 400 });
//         }

//         // Phone check
//         const [phoneExists] = await connection.execute(
//             'SELECT id FROM users WHERE phone = ? LIMIT 1',
//             [phone]
//         );

//         if (phoneExists.length > 0) {
//             return res.status(200).json({ message: 'Phone number already registered', status: 400 });
//         }

//         // Insert
//         const [result] = await connection.execute(
//             `INSERT INTO users (name, email, phone, gender, dob)
//              VALUES (?, ?, ?, ?, ?)`,
//             [name, email, phone, gender, dob]
//         );

//         res.status(200).json({
//             message: 'Registration successful',
//             status: 200,
//             user_id: result.insertId
//         });

//     } catch (error) {
//         console.error('Register error:', error);
//         res.status(500).json({ message: 'Server error', status: 500 });
//     }
// };
// exports.user_register = async (req, res) => {
//     const { name, email, phone, gender, dob, fcm_token } = req.body || {};

//     // Required field checks
//     if (!name) {
//         return res.status(200).json({ message: 'Name is required', status: 400 });
//     } else if (!email) {
//         return res.status(200).json({ message: 'Email is required', status: 400 });
//     } else if (!phone) {
//         return res.status(200).json({ message: 'Phone number is required', status: 400 });
//     } else if (!gender) {
//         return res.status(200).json({ message: 'Gender is required', status: 400 });
//     } else if (!dob) {
//         return res.status(200).json({ message: 'Date of Birth is required', status: 400 });
//     } else if (!fcm_token) {
//         return res.status(200).json({ message: 'FCM Token is required', status: 400 });
//     }

//     try {
//         // Email check
//         const [emailExists] = await connection.execute(
//             'SELECT id FROM users WHERE email = ? LIMIT 1',
//             [email]
//         );

//         if (emailExists.length > 0) {
//             return res.status(200).json({ message: 'Email already registered', status: 400 });
//         }

//         // Phone check
//         const [phoneExists] = await connection.execute(
//             'SELECT id FROM users WHERE phone = ? LIMIT 1',
//             [phone]
//         );

//         if (phoneExists.length > 0) {
//             return res.status(200).json({ message: 'Phone number already registered', status: 400 });
//         }

//         // Insert
//         const [result] = await connection.execute(
//             `INSERT INTO users (name, email, phone, gender, dob, fcm_token)
//              VALUES (?, ?, ?, ?, ?, ?)`,
//             [name, email, phone, gender, dob, fcm_token]
//         );

//         res.status(200).json({
//             message: 'Registration successful',
//             status: 200,
//             user_id: result.insertId
//         });

//     } catch (error) {
//         console.error('Register error:', error);
//         res.status(500).json({ message: 'Server error', status: 500 });
//     }
// };
exports.user_register = async (req, res) => {
  const { name, email, phone, gender, dob, fcm_token } = req.body || {};

  // Required field checks
  if (!name) {
    return res.status(200).json({ message: 'Name is required', status: 400 });
  } else if (!email) {
    return res.status(200).json({ message: 'Email is required', status: 400 });
  } else if (!phone) {
    return res.status(200).json({ message: 'Phone number is required', status: 400 });
  } else if (!gender) {
    return res.status(200).json({ message: 'Gender is required', status: 400 });
  } else if (!dob) {
    return res.status(200).json({ message: 'Date of Birth is required', status: 400 });
  } else if (!fcm_token) {
    return res.status(200).json({ message: 'FCM Token is required', status: 400 });
  }

  try {
    // Email check
    const [emailExists] = await connection.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (emailExists.length > 0) {
      return res.status(200).json({ message: 'Email already registered', status: 400 });
    }

    // Phone check
    const [phoneExists] = await connection.execute(
      'SELECT id FROM users WHERE phone = ? LIMIT 1',
      [phone]
    );

    if (phoneExists.length > 0) {
      return res.status(200).json({ message: 'Phone number already registered', status: 400 });
    }

    // ✅ Default profile image
    const profile_image = 'uploads/download (3).png';

    // Insert with profile_image
    const [result] = await connection.execute(
      `INSERT INTO users (name, email, phone, gender, dob, fcm_token, profile_image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, gender, dob, fcm_token, profile_image]
    );

    res.status(200).json({
      message: 'Registration successful',
      status: 200,
      user_id: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', status: 500 });
  }
};

exports.user_login = async (req, res) => {
    // Step 1: Check if request body and phone exist
    if (!req.body || !req.body.phone) {
        return res.status(200).json({
            message: 'Phone number is required',
            status: 400
        });
    }

    const { phone, fcm_token } = req.body;

    if (!fcm_token) {
        return res.status(200).json({
            message: 'FCM Token is required',
            status: 400
        });
    }

    // Step 2: Validate 10-digit numeric phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(200).json({
            message: 'Phone number must be exactly 10 digits',
            status: 400
        });
    }

    try {
        // Step 3: Check if user exists with phone
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE phone = ? LIMIT 1',
            [phone]
        );

        if (rows.length === 0) {
            return res.status(200).json({
                register_status: '0',
                message: 'This phone number is not registered. Please register first.',
                status: 400
            });
        }

        // ✅ Now define user before using it
        const user = rows[0];
            if (user.status === 0) {
            return res.status(200).json({
                message: 'You are blocked by admin',
                status: 400,
                register_status:'2'
            });
        }
        // Step 4: Update FCM token
        await connection.execute(
            'UPDATE users SET fcm_token = ? WHERE id = ?',
            [fcm_token, user.id]
        );

        // Step 5: Success
        res.status(200).json({
            message: 'Login successful',
            status: 200,
            user_id: user.id,
            register_status: '1',
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error',
            status: 500
        });
    }
};


exports.getProfile = async (req, res) => {
    const user_id = req.body && req.body.user_id;

    if (!user_id) {
        return res.status(400).json({
            message: 'User ID is required',
            status: 400
        });
    }

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'User not found',
                status: 404
            });
        }

        const user = rows[0];

        // Format dob if exists
       if (user.dob) {
    const d = new Date(user.dob);
    user.dob = d.toLocaleDateString("en-CA"); // hamesha YYYY-MM-DD format
}
		 // setting table se upload_document_status nikalna
        const [settingRows] = await connection.execute(
            'SELECT upload_document_status FROM setting WHERE 1 LIMIT 1'
        );

        if (settingRows.length > 0) {
            user.upload_document_status = settingRows[0].upload_document_status;
        } else {
            user.upload_document_status = null; // agar setting table khali hai
        }

        res.status(200).json({
            message: 'Profile fetched successfully',
            status: 200,
            data: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: 'Server error',
            status: 500
        });
    }
};




exports.updateProfile = async (req, res) => {
    const { user_id } = req?.body || {};

    console.log(req.body);

    // Step 1: Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: 'User ID is required',
            status: 400
        });
    }

    // Step 2: Check if user_id is given
    if (!user_id) {
        return res.status(400).json({
            message: 'User ID is required',
            status: 400
        });
    }

    try {
        // Step 3: Find user
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'User not found',
                status: 404
            });
        }

        // Step 4: Prepare fields to update
        const fields = [];
        const values = [];

        const validField = (val) => val !== undefined && val !== null && val !== '';

        if (validField(req.body.name)) {
            fields.push('name = ?');
            values.push(req.body.name);
        }

        if (validField(req.body.email)) {
            fields.push('email = ?');
            values.push(req.body.email);
        }

        if (validField(req.body.gender)) {
            fields.push('gender = ?');
            values.push(req.body.gender);
        }

        if (validField(req.body.dob)) {
            fields.push('dob = ?');
            values.push(req.body.dob);
        }

        // ✅ Base64 image handle
        if (validField(req.body.profile_image)) {
            const base64Data = req.body.profile_image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = `profile_${Date.now()}.png`;
            const savePath = path.join(__dirname, '../public/uploads', filename);

            fs.mkdirSync(path.dirname(savePath), { recursive: true });
            fs.writeFileSync(savePath, buffer);

            fields.push('profile_image = ?');
            values.push(`/uploads/${filename}`);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                message: 'No valid fields to update',
                status: 400
            });
        }

        // Step 5: Final query
        values.push(user_id);
        const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

        await connection.execute(updateQuery, values);

        return res.status(200).json({
            message: 'Profile updated successfully',
            status: 200
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            message: 'Server error',
            status: 500
        });
    }
};

exports.addBankAccount = async (req, res) => {
  try {
    const {
      user_id,
      account_holder_name,
      bank_name,
      account_number,
      ifsc_code,
      branch_name
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !account_holder_name ||
      !bank_name ||
      !account_number ||
      !ifsc_code ||
      !branch_name
    ) {
      return res.status(200).json({
        status: 400,
        error: "All fields are required"
      });
    }

    // 🔍 Check if user exists
    const [userCheck] = await connection.execute(
      `SELECT id FROM users WHERE id = ?`,
      [user_id]
    );

    if (userCheck.length === 0) {
      return res.status(200).json({
        status: 400,
        error: "User not found"
      });
    }

    // 🔁 Check if bank account already exists for this user
    const [accountCheck] = await connection.execute(
      `SELECT id FROM user_bank_accounts WHERE user_id = ?`,
      [user_id]
    );

    if (accountCheck.length > 0) {
      return res.status(200).json({
        status: 400,
        error: "Bank account already exists for this user"
      });
    }

    // ✅ Insert into user_bank_accounts table
    await connection.execute(
      `INSERT INTO user_bank_accounts 
       (user_id, account_holder_name, bank_name, account_number, ifsc_code, branch_name, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        account_holder_name,
        bank_name,
        account_number,
        ifsc_code,
        branch_name
      ]
    );

    return res.status(200).json({
      status: 200,
      message: "Bank account added successfully"
    });

  } catch (err) {
    console.error("addBankAccount error:", err);
    return res.status(500).json({
      status: 500,
      error: "Server error"
    });
  }
};


exports.updateBankAccount = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(200).json({
        status: 400,
        error: "user_id is required"
      });
    }

    // 🔍 Check if user has a bank account
    const [accountCheck] = await connection.execute(
      `SELECT * FROM user_bank_accounts WHERE user_id = ?`,
      [user_id]
    );

    if (accountCheck.length === 0) {
      return res.status(200).json({
        status: 400,
        error: "No bank account found for this user"
      });
    }

    // 🔧 Build update fields only if provided and not empty string
    const fields = [];
    const values = [];

    const fieldMap = {
      account_holder_name: req.body.account_holder_name,
      bank_name: req.body.bank_name,
      account_number: req.body.account_number,
      ifsc_code: req.body.ifsc_code,
      branch_name: req.body.branch_name
    };

    for (const [key, value] of Object.entries(fieldMap)) {
      if (value !== undefined && value !== "") {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        status: 400,
        error: "No valid fields provided for update"
      });
    }

    values.push(user_id); // for WHERE clause

    const query = `UPDATE user_bank_accounts SET ${fields.join(", ")} WHERE user_id = ?`;
    await connection.execute(query, values);

    return res.status(200).json({
      status: 200,
      message: "Bank account updated successfully"
    });

  } catch (err) {
    console.error("updateBankAccount error:", err);
    return res.status(500).json({
      status: 500,
      error: "Server error"
    });
  }
};

exports.getBankAccountDetails = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(200).json({
        status: 400,
        error: "user_id is required"
      });
    }

    // 🔍 Check if user exists
    const [userCheck] = await connection.execute(
      `SELECT id FROM users WHERE id = ?`,
      [user_id]
    );

    if (userCheck.length === 0) {
      return res.status(200).json({
        status: 400,
        error: "User not found"
      });
    }

    // 🔍 Get bank account
    const [rows] = await connection.execute(
      `SELECT * 
       FROM user_bank_accounts 
       WHERE user_id = ? 
       LIMIT 1`,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(200).json({
        status: 400,
        error: "Bank account not found for this user"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Bank account details fetched successfully",
      data: rows[0]
    });

  } catch (err) {
    console.error("getBankAccountDetails error:", err);
    return res.status(500).json({
      status: 500,
      error: "Server error"
    });
  }
};

exports.adminqr = async (req, res) => {
  try {
    const [rows] = await connection.execute(
      `SELECT qr_image, updated_at FROM commission_settings LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(200).json({
        status: 400,
        error: "QR image not found"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "QR image fetched successfully",
      data: rows[0]
    });

  } catch (err) {
    console.error("adminqr error:", err);
    return res.status(500).json({
      status: 500,
      error: "Server error"
    });
  }
};

exports.getwithdraw_commission = async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM withdraw_commission LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(200).json({
        status: 404,
        message: "No commission settings found"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Commission settings fetched successfully",
      data: rows[0]
    });
  } catch (error) {
    console.error("Error fetching commission settings:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};
exports.getBrandAndModel = async (req, res) => {
  try {
    const [brands] = await connection.query("SELECT * FROM CarBrand");

    if (!brands.length) {
      return res.status(200).json({ status: 404, message: "No brands found" });
    }

    // fetch all models once (avoid multiple queries)
    const [models] = await connection.query("SELECT * FROM CarModel");

    // map models to respective brands
    const data = brands.map((brand) => {
      return {
        id: brand.brand_id,
        brand_name: brand.brand_name,
        image: brand.image,
        models: models
          .filter((m) => m.brand_id === brand.brand_id)
          .map((m) => ({
            id: m.model_id,
            model_name: m.model_name,
            category: m.category,
            sub_category: m.sub_category,
            fuel_type: m.fuel_type,
            transmission: m.transmission,
            notes: m.notes,
            image: m.image,
          })),
      };
    });

    return res.status(200).json({ status: 200, data });
  } catch (err) {
    console.error("Error fetching brands and models:", err);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};


