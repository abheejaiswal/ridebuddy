const connection = require("../config/db");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
function parseISTDateTime(date, time) {
  const [h, m = '0', s = '0'] = time.split(':');
  return new Date(`${date}T${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}+05:30`);
}
const normalizeCity = (city) => {
  if (!city) return "";
  return city
    .toLowerCase()
    .replace(/(district|city|nagar|kheri|mandal|tehsil)/gi, '')
    .replace(/[^a-z\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const getCityFromAddress = async (address) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&language=en`;

  try {
    const response = await axios.get(url);
    const components = response.data.results[0]?.address_components || [];
    const cityComponent = components.find(c =>
      c.types.includes("locality") ||
      c.types.includes("administrative_area_level_2") ||
      c.types.includes("administrative_area_level_1")
    );
    return cityComponent?.long_name ? normalizeCity(cityComponent.long_name) : null;
  } catch (err) {
    console.error("Google API Error:", err.message);
    return null;
  }
};



function saveBase64Image(base64String, filenamePrefix) {
  if (!base64String) return null;
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  let ext = 'png';
  let data = base64String;
  if (matches && matches.length === 3) {
    ext = matches[1].split('/')[1];
    data = matches[2];
  }
  const fileName = `${filenamePrefix}_${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
  return `/uploads/${fileName}`;
}

exports.user_saveRoute = async (req, res) => {
  const body = req.body || {}; // Handle empty {}

  const {
    user_id,
    from_full_address,
    from_latitude,
    from_longitude,
    from_city,
    from_state,
    to_full_address,
    to_latitude,
    to_longitude,
    to_city,
    to_state
  } = body;

  // Field-wise validations
  if (!user_id) {
    return res.status(200).json({ message: 'User ID is required', status: 400 });
  }
  if (!from_full_address) {
    return res.status(200).json({ message: 'From address is required', status: 400 });
  }
  if (!from_latitude) {
    return res.status(200).json({ message: 'From latitude is required', status: 400 });
  }
  if (!from_longitude) {
    return res.status(200).json({ message: 'From longitude is required', status: 400 });
  }
  if (!to_full_address) {
    return res.status(200).json({ message: 'To address is required', status: 400 });
  }
  if (!to_latitude) {
    return res.status(200).json({ message: 'To latitude is required', status: 400 });
  }
  if (!to_longitude) {
    return res.status(200).json({ message: 'To longitude is required', status: 400 });
  }

  try {
    const [result] = await connection.execute(
      `INSERT INTO user_saved_routes (
        user_id,
        from_full_address, from_latitude, from_longitude, from_city, from_state,
        to_full_address, to_latitude, to_longitude, to_city, to_state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        from_full_address, from_latitude, from_longitude, from_city || '', from_state || '',
        to_full_address, to_latitude, to_longitude, to_city || '', to_state || ''
      ]
    );

    return res.status(200).json({
      message: 'Route saved successfully',
      status: 200,
      route_id: result.insertId
    });

  } catch (error) {
    console.error('Error saving route:', error);
    return res.status(500).json({ message: 'Server error', status: 500 });
  }
};

exports.getHelpSupport = async (req, res) => {
  try {
    const [rows] = await connection.execute(
      `SELECT id, slugname, content 
       FROM help_support_pages 
       WHERE status = 'active' 
       ORDER BY id ASC`
    );

    return res.status(200).json({
         message: ' Find successfully',
      status: 200,
      data: rows
    });

  } catch (err) {
    console.error("Help Support Fetch Error:", err);
    return res.status(500).json({
      message: "Server error",
      status: 500
    });
  }
};


exports.getSavedAddresses = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({
      status: 400,
      message: 'User ID is required'
    });
  }

  try {
    const [rows] = await connection.execute(
      `SELECT *
       FROM user_saved_routes
       WHERE user_id = ? 
       ORDER BY id DESC`,
      [user_id]
    );

    return res.status(200).json({
      status: 200,
      message: 'Saved routes fetched successfully',
      data: rows
    });

  } catch (error) {
    console.error('Get Saved Routes Error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};



exports.createRide = async (req, res) => {
  try {
    const {
      user_id, start_address, end_address, start_lat, start_lng,
      end_lat, end_lng, ride_time, ride_end_time, ride_date, ride_end_date,
      total_seats, available_seats, full_price, vehicle_id, booking_mode,
      toll_status, comment, stops
    } = req.body;

    if (!user_id || !start_address || !end_address || !start_lat || !start_lng ||
        !end_lat || !end_lng || !ride_time || !ride_end_time || !ride_date ||
        !ride_end_date || !total_seats || !available_seats || !full_price ||
        vehicle_id === undefined || booking_mode === undefined || toll_status === undefined) {
      return res.status(200).json({ status: 400, message: "All fields are required" });
    }

    // 🔍 Check if user already has an active ride
    const [activeRide] = await connection.execute(
      `SELECT id FROM rides WHERE user_id = ? AND status = '1' LIMIT 1`,
      [user_id]
    );

    if (activeRide.length > 0) {
      return res.status(200).json({
        status: 403,
        message: "You already have an active ride. Complete it before creating a new one."
      });
    }

    const start_city = normalizeCity(await getCityFromAddress(start_address));
    const end_city = normalizeCity(await getCityFromAddress(end_address));
    const date_time = new Date(`${ride_date}T${ride_time}`);

    const [result] = await connection.execute(
      `INSERT INTO rides (
        user_id, start_address, start_lat, start_lng,
        end_address, end_lat, end_lng,
        start_city, end_city, ride_start_datetime,
        ride_date, ride_end_date, ride_start_time, ride_end_time,
        total_seats, available_seats, full_price, vehicle_id, booking_mode, toll_status, comment, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')`,
      [
        user_id, start_address, start_lat, start_lng,
        end_address, end_lat, end_lng,
        start_city, end_city, date_time,
        ride_date, ride_end_date, ride_time, ride_end_time,
        total_seats, available_seats, full_price, vehicle_id, booking_mode, toll_status, comment || ''
      ]
    );

    const ride_id = result.insertId;

    if (Array.isArray(stops)) {
      const baseDate = new Date(ride_date);
      let previousArrivalDateTime = new Date(baseDate);

      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const stop_city = normalizeCity(await getCityFromAddress(stop.full_address));

        const arrivalParts = stop.estimated_arrival.split(":").map(Number);
        const departureParts = stop.estimated_departure.split(":").map(Number);

        let arrivalDateTime = new Date(previousArrivalDateTime);
        arrivalDateTime.setHours(arrivalParts[0], arrivalParts[1] || 0, arrivalParts[2] || 0);

        let departureDateTime = new Date(previousArrivalDateTime);
        departureDateTime.setHours(departureParts[0], departureParts[1] || 0, departureParts[2] || 0);

        if (i > 0 && arrivalDateTime < previousArrivalDateTime) {
          arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
          departureDateTime.setDate(departureDateTime.getDate() + 1);
        }

        previousArrivalDateTime = new Date(arrivalDateTime);

        await connection.execute(
          `INSERT INTO ride_stops (
            ride_id, stop_order, full_address, city_name,
            departureestimated_date, arrivalestimated_date,
            estimated_departure, estimated_arrival, price_from_start
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ride_id, i + 1, stop.full_address, stop_city,
            departureDateTime.toISOString().split('T')[0],
            arrivalDateTime.toISOString().split('T')[0],
            departureDateTime,
            arrivalDateTime,
            stop.price_from_start || 0
          ]
        );
      }
    }

    const [[user]] = await connection.execute(
      `SELECT document_status FROM users WHERE id = ?`,
      [user_id]
    );

    const documents_status = user?.document_status ?? null;
    res.status(200).json({ status: 200, message: "Ride created successfully", ride_id, documents_status });

  } catch (err) {
    console.error("Create Ride Error:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};




exports.searchRides = async (req, res) => {
  try {
    const { from_address, to_address, ride_date, required_seats } = req.body;

    if (!from_address || !to_address || !ride_date || !required_seats) {
      return res.status(200).json({ status:400, message: "Missing required fields" });
    }

    const from_city = normalizeCity(await getCityFromAddress(from_address));
    const to_city = normalizeCity(await getCityFromAddress(to_address));
    const now = new Date();
    const isToday = ride_date === now.toISOString().split("T")[0];

    const query = `
      SELECT 
        r.*, u.id AS driver_id, u.name AS driver_name, u.profile_image AS driver_profile, u.phone AS driver_mobile,
        rs1.id as from_stop_id, rs2.id as to_stop_id,

        IFNULL(rs1.full_address, r.start_address) AS pickup_address,
        IFNULL(rs2.full_address, r.end_address) AS drop_address,

        IFNULL(
          CONCAT(rs1.departureestimated_date, ' ', TIME(rs1.estimated_departure)),
          r.ride_start_datetime
        ) AS pickup_time,

        IFNULL(
          CONCAT(rs2.arrivalestimated_date, ' ', TIME(rs2.estimated_arrival)),
          CONCAT(r.ride_end_date, ' ', r.ride_end_time)
        ) AS drop_time,

        CASE
          WHEN rs1.stop_order IS NOT NULL AND rs2.stop_order IS NOT NULL THEN rs2.price_from_start - rs1.price_from_start
          WHEN r.start_city = ? AND rs2.stop_order IS NOT NULL THEN rs2.price_from_start
          WHEN rs1.stop_order IS NOT NULL AND r.end_city = ? THEN r.full_price - rs1.price_from_start
          ELSE r.full_price
        END AS price,

        IFNULL(
          CONCAT(rs1.departureestimated_date, ' ', TIME(rs1.estimated_departure)),
          r.ride_start_datetime
        ) AS pickup_check_time

      FROM rides r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN ride_stops rs1 ON rs1.ride_id = r.id AND LOWER(rs1.city_name) = ?
      LEFT JOIN ride_stops rs2 ON rs2.ride_id = r.id AND LOWER(rs2.city_name) = ?

      WHERE ? BETWEEN r.ride_date AND r.ride_end_date
        AND r.status = '1'
        AND r.available_seats >= ?
        AND (
          (rs1.stop_order IS NOT NULL AND rs2.stop_order IS NOT NULL AND rs1.stop_order < rs2.stop_order)
          OR (r.start_city = ? AND rs2.stop_order IS NOT NULL)
          OR (rs1.stop_order IS NOT NULL AND r.end_city = ?)
          OR (r.start_city = ? AND r.end_city = ?)
        )
      ORDER BY pickup_time ASC
    `;

    const values = [
      from_city,         // for price CASE: r.start_city = ?
      to_city,           // for price CASE: r.end_city = ?
      from_city,         // rs1.city_name
      to_city,           // rs2.city_name
      ride_date,
      required_seats,
      from_city, to_city, from_city, to_city // for route condition
    ];

    const [rides] = await connection.execute(query, values);
    const finalRides = [];

    for (const ride of rides) {
     const [passengers] = await connection.execute(
  `SELECT 
      u.id AS passenger_id, 
      u.name AS passenger_name, 
      u.phone AS passenger_phone, 
      u.profile_image AS passenger_image,

      -- pickup address
      IF(bs1.id IS NOT NULL, bs1.full_address, r.start_address) AS pickup_address,
      -- drop address
      IF(bs2.id IS NOT NULL, bs2.full_address, r.end_address) AS drop_address,

      -- pickup time
      IF(bs1.id IS NOT NULL, 
         CONCAT(bs1.departureestimated_date, ' ', TIME(bs1.estimated_departure)), 
         r.ride_start_datetime
      ) AS pickup_time,

      -- drop time
      IF(bs2.id IS NOT NULL, 
         CONCAT(bs2.arrivalestimated_date, ' ', TIME(bs2.estimated_arrival)), 
         CONCAT(r.ride_end_date, ' ', r.ride_end_time)
      ) AS drop_time

   FROM ride_bookings b
   JOIN users u ON b.user_id = u.id
   JOIN rides r ON b.ride_id = r.id
   LEFT JOIN ride_stops bs1 ON bs1.id = b.from_stop_id
   LEFT JOIN ride_stops bs2 ON bs2.id = b.to_stop_id
   WHERE b.status IN (0, 1) AND b.ride_id = ?`,
  [ride.id]
);


      const [ratings] = await connection.execute(`
        SELECT rating FROM ratings WHERE reviewee_id = ?
      `, [ride.user_id]);

      const avg_rating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

      ride.passengers = passengers;
      ride.total_passengers = passengers.length;
      ride.driver_average_rating = parseFloat(avg_rating);

      const pickupDateTime = new Date(ride.pickup_check_time);
      ride.departure_status = pickupDateTime < now ? 1 : 0;

      if (!isToday || pickupDateTime > now) {
        finalRides.push(ride);
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Rides found",
      data: finalRides
    });

  } catch (err) {
    console.error("Ride search error:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};






exports.addVehicle = async (req, res) => {
  try {
    // ✅ Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(200).json({ status:400, message: "Request body is empty" });
    }

    const {
      user_id,
      brand_name,
      model_name,
      vehicle_number,
      vehicle_color
    } = req.body;

    // ✅ Per-field validations
    if (!user_id) {
      return res.status(200).json({ status:400, message: "user_id is required" });
    }

    if (!brand_name) {
      return res.status(200).json({ status:400, message: "brand_name is required" });
    }

    if (!model_name) {
      return res.status(200).json({status:400, message: "model_name is required" });
    }

    if (!vehicle_number) {
      return res.status(200).json({status:400, message: "vehicle_number is required" });
    }

    if (!vehicle_color) {
      return res.status(200).json({status:400, message: "vehicle_color is required" });
    }
    
     const [existingVehicle] = await connection.execute(
      'SELECT id FROM vehicles WHERE vehicle_number = ? LIMIT 1',
      [vehicle_number]
    );

    if (existingVehicle.length > 0) {
      return res.status(200).json({
          status:400,
        message: "Vehicle number already exists. Please use a different one."
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO vehicles (user_id, brand_name, model_name, vehicle_number, vehicle_color)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, brand_name, model_name, vehicle_number, vehicle_color]
    );

    res.status(200).json({
      status:200,
      message: "Vehicle added successfully",
      vehicle_id: result.insertId
    });
  } catch (err) {
    console.error("Add vehicle error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// ✅ Update Vehicle (Only non-empty fields will be updated + user_id check)
exports.updateVehicle = async (req, res) => {
  try {
    const { user_id, vehicle_id, brand_name, model_name, vehicle_number, vehicle_color } = req.body;

    if (!user_id) {
      return res.status(200).json({ status: 400, message: "user_id is required" });
    }
    if (!vehicle_id) {
      return res.status(200).json({ status: 400, message: "vehicle_id is required" });
    }

    // Check if vehicle exists and belongs to this user
    const [vehicle] = await connection.execute(
      'SELECT * FROM vehicles WHERE id = ? AND user_id = ? LIMIT 1',
      [vehicle_id, user_id]
    );

    if (vehicle.length === 0) {
      return res.status(200).json({ status: 404, message: "Vehicle not found for this user" });
    }

    // Check if this vehicle is currently in an active ride
    const [activeRide] = await connection.execute(
      'SELECT id FROM rides WHERE vehicle_id = ? AND user_id = ? AND status IN (1,5) LIMIT 1',
      [vehicle_id, user_id]
    );

    if (activeRide.length > 0) {
      return res.status(200).json({
        status: 400,
        message: "Cannot update this vehicle. It is currently in an active ride."
      });
    }

    // Check duplicate vehicle_number if provided
    if (vehicle_number && vehicle_number.trim() !== "") {
      const [duplicate] = await connection.execute(
        'SELECT id FROM vehicles WHERE vehicle_number = ? AND id != ? LIMIT 1',
        [vehicle_number, vehicle_id]
      );
      if (duplicate.length > 0) {
        return res.status(200).json({
          status: 400,
          message: "Vehicle number already exists. Please use a different one."
        });
      }
    }

    // Build update query dynamically
    let fields = [];
    let values = [];

    if (brand_name && brand_name.trim() !== "") {
      fields.push("brand_name = ?");
      values.push(brand_name);
    }
    if (model_name && model_name.trim() !== "") {
      fields.push("model_name = ?");
      values.push(model_name);
    }
    if (vehicle_number && vehicle_number.trim() !== "") {
      fields.push("vehicle_number = ?");
      values.push(vehicle_number);
    }
    if (vehicle_color && vehicle_color.trim() !== "") {
      fields.push("vehicle_color = ?");
      values.push(vehicle_color);
    }

    if (fields.length === 0) {
      return res.status(200).json({
        status: 400,
        message: "No valid fields provided for update"
      });
    }

    values.push(vehicle_id, user_id);

    const query = `UPDATE vehicles SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`;
    await connection.execute(query, values);

    res.status(200).json({
      status: 200,
      message: "Vehicle updated successfully"
    });

  } catch (err) {
    console.error("Update vehicle error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Vehicle (with user_id check)
exports.deleteVehicle = async (req, res) => {
  try {
    const { user_id, vehicle_id } = req.body;

    if (!user_id) {
      return res.status(200).json({ status: 400, message: "user_id is required" });
    }
    if (!vehicle_id) {
      return res.status(200).json({ status: 400, message: "vehicle_id is required" });
    }

    // Check if vehicle exists and belongs to this user
    const [vehicle] = await connection.execute(
      'SELECT * FROM vehicles WHERE id = ? AND user_id = ? LIMIT 1',
      [vehicle_id, user_id]
    );

    if (vehicle.length === 0) {
      return res.status(200).json({ status: 404, message: "Vehicle not found for this user" });
    }

    // Check if this vehicle is currently in an active ride
    const [activeRide] = await connection.execute(
      'SELECT id FROM rides WHERE vehicle_id = ? AND user_id = ? AND status IN (1,5) LIMIT 1',
      [vehicle_id, user_id]
    );

    if (activeRide.length > 0) {
      return res.status(200).json({
        status: 400,
        message: "Cannot delete this vehicle. It is currently in an active ride."
      });
    }

    // Delete the vehicle
    await connection.execute(
      'DELETE FROM vehicles WHERE id = ? AND user_id = ?',
      [vehicle_id, user_id]
    );

    res.status(200).json({
      status: 200,
      message: "Vehicle deleted successfully"
    });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getVehicles = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(200).json({ status: 400, message: "user_id is required" });
    }

    const [rows] = await connection.execute(
      `SELECT * FROM vehicles 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      status: 200,
      message: "Vehicles fetched successfully",
      data: rows
    });

  } catch (err) {
    console.error("Get vehicles error:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(200).json({ status: 400, message: "user_id is required" });
    }

    const [rows] = await connection.execute(
      `SELECT id, user_id, title, message, is_read, created_at
       FROM user_notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      status: 200,
      message: "Notifications fetched successfully",
      data: rows
    });

  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ status: 500, error: "Server error" });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { notification_id } = req.body;

    if (!notification_id) {
      return res.status(200).json({
        status: 400,
        message: "notification_id is required"
      });
    }

    const [result] = await connection.execute(
      `UPDATE user_notifications SET is_read = 1 WHERE id = ?`,
      [notification_id]
    );

    if (result.affectedRows === 0) {
      return res.status(200).json({
        status: 400,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Notification marked as read"
    });

  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};




exports.uploadDocumentsBase64 = async (req, res) => {
  try {
    const {
      user_id,
      passport_photo,
      aadhar_photo,
      aadhar_back_photo,
      pan_photo
    } = req.body;

    // ✅ Validate required fields
    if (!user_id) return res.status(200).json({ status: 400, message: "user_id is required" });
    if (!aadhar_photo) return res.status(200).json({ status: 400, message: "aadhar_photo (front) is required" });
    if (!aadhar_back_photo) return res.status(200).json({ status: 400, message: "aadhar_back_photo is required" });
    if (!pan_photo) return res.status(200).json({ status: 400, message: "pan_photo is required" });

    // ✅ Check user document_status
    const [[user]] = await connection.execute(
      `SELECT document_status FROM users WHERE id = ?`,
      [user_id]
    );

    if (!user) {
      return res.status(200).json({ status: 404, message: "User not found" });
    }

    // ✅ Check if documents already uploaded
    const [existing] = await connection.execute(
      `SELECT id FROM user_documents WHERE user_id = ?`,
      [user_id]
    );

    if (existing.length > 0 && user.document_status != 3) {
      return res.status(200).json({
        status: 400,
        message: "Documents already uploaded for this user"
      });
    }

    // ✅ Save base64 images
    const passport = saveBase64Image(passport_photo, 'passport');
    const aadhar = saveBase64Image(aadhar_photo, 'aadhar_front');
    const aadhar_back = saveBase64Image(aadhar_back_photo, 'aadhar_back');
    const pan = saveBase64Image(pan_photo, 'pan');

    let documentId;

    if (existing.length > 0 && user.document_status == 3) {
      // 🔄 Re-upload: Update existing record
      await connection.execute(
        `UPDATE user_documents 
         SET passport_photo = ?, aadhar_photo = ?, aadhar_back_photo = ?, pan_photo = ?
         WHERE user_id = ?`,
        [passport, aadhar, aadhar_back, pan, user_id]
      );
      documentId = existing[0].id;
    } else {
      // 🆕 First upload: Insert new record
      const [result] = await connection.execute(
        `INSERT INTO user_documents (user_id, passport_photo, aadhar_photo, aadhar_back_photo, pan_photo)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, passport, aadhar, aadhar_back, pan]
      );
      documentId = result.insertId;
    }

    // ✅ Update users table document_status = 2 (Pending Review)
    await connection.execute(
      `UPDATE users SET document_status = 2 WHERE id = ?`,
      [user_id]
    );

    res.status(200).json({
      status: 200,
      message: user.document_status == 3 ? "Documents re-uploaded successfully" : "Documents uploaded successfully",
      document_id: documentId
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};





exports.addRating = async (req, res) => {
  try {
    const { ride_id, reviewer_id, reviewee_id, rating, comment } = req.body;

    if (!ride_id || !reviewer_id || !reviewee_id || !rating) {
      return res.status(200).json({ status: 400, message: "ride_id, reviewer_id, reviewee_id and rating are required" });
    }

    // Optional: check if this ride was shared by both users
    const [check] = await connection.execute(
      `SELECT * FROM ride_bookings WHERE ride_id = ? AND user_id = ?`,
      [ride_id, reviewer_id]
    );

    if (check.length === 0) {
      return res.status(400).json({ status: 400, message: "Invalid ride or reviewer not part of ride" });
    }

    // Optional: prevent duplicate rating
    const [existing] = await connection.execute(
      `SELECT * FROM ratings WHERE ride_id = ? AND reviewer_id = ? AND reviewee_id = ?`,
      [ride_id, reviewer_id, reviewee_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ status: 400, message: "Rating already submitted" });
    }

    const [result] = await connection.execute(
      `INSERT INTO ratings (ride_id, reviewer_id, reviewee_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [ride_id, reviewer_id, reviewee_id, rating, comment || null]
    );
     await connection.execute(
      `UPDATE ride_bookings SET status = 7 WHERE ride_id = ? AND user_id = ?`,
      [ride_id, reviewer_id]
    );
    return res.status(200).json({
      status: 200,
      message: "Rating submitted successfully",
      rating_id: result.insertId
    });

  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};


exports.getUserRatings = async (req, res) => {
  try {
    const { user_id, type } = req.body;

    if (!user_id) {
      return res.status(200).json({ status: 400, message: "user_id is required" });
    }

    if (!type || (type !== 1 && type !== 2)) {
      return res.status(200).json({ status: 400, message: "type must be 1 (received) or 2 (given)" });
    }

    let query = "";
    let values = [];

    if (type === 1) {
      // Ratings received by user
      query = `
        SELECT r.id, r.ride_id, r.reviewer_id, r.reviewee_id, r.rating, r.comment, r.created_at,
               u.name AS reviewer_name, u.profile_image
        FROM ratings r
        JOIN users u ON u.id = r.reviewer_id
        WHERE r.reviewee_id = ?
        ORDER BY r.created_at DESC
      `;
      values = [user_id];
    } else if (type === 2) {
      // Ratings given by user
      query = `
        SELECT r.id, r.ride_id, r.reviewer_id, r.reviewee_id, r.rating, r.comment, r.created_at,
               u.name AS reviewee_name, u.profile_image
        FROM ratings r
        JOIN users u ON u.id = r.reviewee_id
        WHERE r.reviewer_id = ?
        ORDER BY r.created_at DESC
      `;
      values = [user_id];
    }

    const [ratings] = await connection.execute(query, values);

    const average_rating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

    return res.status(200).json({
      status: 200,
      message: "User ratings fetched successfully",
      average_rating: parseFloat(average_rating),
      total_reviews: ratings.length,
      data: ratings
    });

  } catch (err) {
    console.error("Get ratings error:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};


exports.reportUser = async (req, res) => {
  try {
    const { reporter_id, reported_user_id, reason } = req.body;

    if (!reporter_id || !reported_user_id || !reason) {
      return res.status(200).json({
        status: 400,
        message: "reporter_id, reported_user_id and reason are required"
      });
    }

    await connection.execute(
      `INSERT INTO reports (reporter_id, reported_user_id, reason) VALUES (?, ?, ?)`,
      [reporter_id, reported_user_id, reason]
    );

    return res.status(200).json({
      status: 200,
      message: "User reported successfully"
    });
  } catch (err) {
    console.error("Report user error:", err);
    return res.status(500).json({
      status: 500,
      error: "Server error"
    });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(200).json({ status: 400, message: "user_id is required" });
    }

    const [rows] = await connection.execute(
      `SELECT * 
       FROM user_documents 
       WHERE user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(200).json({ status: 400, message: "Documents not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Documents fetched successfully",
      data: rows
    });

  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};




const serviceAccount = {
  "type": "service_account",
  "project_id": "ridebuddy-4cdb0",
  "private_key_id": "833b21d2a833b958f757248f8a364075893217da",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSnllzYYHnZai4\nEk0+FDkVmdunflLwRYpUQakWkpkIjFFcVq+rip/cvMwEB0CvqPX5uoJ5KSSZMGBV\nmMUdtTvMZ+JMHr8RSWpDEo2aj8/vBYvft5TDdXtMXWLMP6YiDpFf61uXekQW3qUi\n4k45LeIgCSQhKdzjjMbfhB0jjmf1GqQWKDed/4mFX+D1H1X7Iw4MdtmHKJ76A4XL\nRA5IQUfkco4Vty1QeaDxUYuPXdYo7+VaWYynRFnlhY+w19Z9JDPbS3z6IWXNplyw\n5k+pmF1t26gx/lTwxzn9nYiZKXeYGuo2YD3AnfvClu/yXocJrtRiXL8GxnU2Mp6b\nfOG7PvixAgMBAAECggEASLxFo/e7eg/0o1xw9VsS9qRdU7pXatsUxLfOKmSPhq4V\nrrlSbMdYhykiDN2MOZiYbksYbwL6JQTaxZwELbi68ayXlyupnenNzXhmx0aQ4QLf\nYRyxsEWX5UpuuOTahgq0E+GujncZUD8jrSqXo8YfZ8UhJ1KdQkWUY04nJnx/Fhhh\nE1b25fvh96t8VjEHZ5YUQKOqPBIqdJ668ASukWDi7BTSRmbDEfJo71dnkkfTuLla\nmrjxnePjviOx2TGjPkejcPysvxhpCPcepPX8/73LnQ0ea0Y58EpdwhfQIbJFnYyg\nIVZQYh7gtkOtgmDSuc2mhj8NVQJBoyS8w1qDqm+cAQKBgQDDbkjcMvSzTtX70LBY\nN8PMS9lkutT9A+RCa4dXG+YqSOameHRs8a1cV3DBRp+YgVCRWEo52IffoNmV0FMk\nlMHHoqEcBm3lzu4JYxeNZoBj/OHZpdvKyFljI4v/lcwbm1mlji1DsGaBy91qHSeK\nBWYRtvX5w4gh7ATHv10FdhX4TwKBgQDADz4EQtTaV7FL7qi2AqLRMhCFLZ1odYu9\nNenUOlgvJK6weIc2WVZjE1MA4pMbYfnidtG++WbLo1p24L4r/LVOjBDyn4DKUJvL\nBRQI5OX+xfJIj1+6G0r0/W0btb1NP6KL2qsGuKnZCph8NducDRmjxdBxc3+oqiD9\nWOrkS06+/wKBgBQRnTXPncVUETFcyt8kSt0N5PMtJHYfEi+n7ywI12f8OINb10jg\nwJa8+/09DWKR1P43/NdX3wwd7not/HvDMusXTkgceOiiiVs5a8+/eOvLqj25hIqc\nbGF74wKKFX24REp2ATv0P3KQxtoAyHCqAUNMcJIHfFFPdWY1xo2rBLKNAoGAPTpe\nvgMEUptURW3PUT8j4udABwUUwoF+zBJM+kCjblwWaOHz0SrH9IvrkUOqPDeO71iL\n44Mk91SbeXyKhAFrV6AlowOgjl8GW8HBslguznsSk3lJvk4HJnVIfGYC9IaN7mIG\n1fy3AR90n1yYJ3axrtlYa2Kz1vRt0fav45nyf8cCgYAVD14zolisSjtgMtWowQYA\ndEgN/1wuPSVsvITBiduSi5eId7A3w5r0dcxnLt87LLpCzyROk1F8kBaYmnmwIfXv\nJT2edwbJo+sHKOhLRGWq5Jd400SlQMC5RfyFugEtnCeIt68+um5grPQiIGTl98o2\n1o0AAQqjUZjR5n8TK358vw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@ridebuddy-4cdb0.iam.gserviceaccount.com",
  "client_id": "116961241739890892400",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ridebuddy-4cdb0.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const sendNotification = async (token, title, message,role) => {
  const payload = {
    notification: {
      title,
      body: message
    },
	  data: {
      role: role.toString(), // 👈 FCM data payload hamesha string hona chahiye
    },
    token
  };

  try {
    await admin.messaging().send(payload);
    console.log("Notification sent");
  } catch (err) {
    console.error("FCM Error:", err.message);
  }
};

exports.bookRide = async (req, res) => {
  try {
    const {
      ride_id,
      user_id,
      seats_requested,
      from_stop_id,
      to_stop_id,
      distance_km,
      fare_per_person,
	  pay_mode	
    } = req.body;
   
    // Validate required fields
    if (!ride_id || !user_id || !seats_requested || !pay_mode) {
      return res.status(200).json({
        status: 400,
        message: "ride_id, user_id, seats_requested are required"
      });
    }

    // Validate distance and fare inputs
    if (!distance_km || !fare_per_person ) {
      return res.status(200).json({
        status: 400,
        message: "distance_km and fare_per_person are required"
      });
    }
  // 0. Check if user already has pending or active booking
    const [[existingBooking]] = await connection.execute(
      `SELECT * FROM ride_bookings 
       WHERE user_id = ? AND status IN (0,1,5)`,
      [user_id]
    );

    if (existingBooking) {
      return res.status(200).json({
        status: 400,
        message: "You already have a pending or active booking. Please complete or cancel it before booking a new ride."
      });
    }

    // 1. Fetch ride detail
    const [[ride]] = await connection.execute(
      `SELECT * FROM rides WHERE id = ? AND status = '1'`,
      [ride_id]
    );
    if (!ride) {
      return res.status(200).json({
        status: 400,
        message: "Ride not found"
      });
    }

    const rideOwnerId = ride.user_id;

    // 2. Check seat availability
    if (ride.available_seats < seats_requested) {
      return res.status(200).json({
        status: 400,
        message: `Only ${ride.available_seats} seats available`
      });
    }

    const booking_status = ride.booking_mode === 0 ? 1 : 0;
    const fare = fare_per_person * seats_requested;

    // Generate 4-digit OTP (1000-9999)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 3. Insert into bookings (now including otp)
    const [result] = await connection.execute(
      `INSERT INTO ride_bookings 
        (ride_id, user_id, seats_booked, status, from_stop_id, to_stop_id, distance_km, fare, otp, pay_mode, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, NOW())`,
      [
        ride_id,
        user_id,
        seats_requested,
        booking_status,
        from_stop_id || null,
        to_stop_id || null,
        distance_km,
        fare,
        otp,
		pay_mode  
      ]
    );

    // 4. If booking confirmed, deduct seats
    if (booking_status === 1) {
      await connection.execute(
        `UPDATE rides SET available_seats = available_seats - ? WHERE id = ?`,
        [seats_requested, ride_id]
      );
    }

    // 5. Notify ride owner only
    const [[rideOwner]] = await connection.execute(
      `SELECT fcm_token FROM users WHERE id = ?`,
      [rideOwnerId]
    );

    if (rideOwner && rideOwner.fcm_token) {
      const title = "New Booking Request";
      const message = `A user has booked ${seats_requested} seat(s) for your ride.`;
	  const role = "2";
      await sendNotification(rideOwner.fcm_token, title, message,role);
    }

    // ✅ Booking user को अब notification नहीं जाएगी
    // OTP आप चाहो तो SMS/Email से भेज सकते हो
    // e.g. sendSMS(bookingUser.phone, `Your OTP is ${otp}`);
    // e.g. sendEmail(bookingUser.email, "Booking OTP", `Your OTP is ${otp}`);

    return res.status(200).json({
      status: 200,
      message: "Ride booked successfully",
      booking_id: result.insertId,
      booking_status: booking_status === 1 ? "Confirmed" : "Pending",
      booking_otp: otp // 🚨 Production में हटा देना
    });

  } catch (err) {
    console.error("Book ride error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};




exports.yourRides = async (req, res) => {
  try {
    const { user_id, type } = req.body;

    if (!user_id || !type) {
      return res.status(200).json({ status: 400, message: "user_id and type are required" });
    }

    if (type == 1) {
      // ✅ Created rides (Driver)
      const [rides] = await connection.execute(`
        SELECT r.*, v.brand_name, v.model_name, v.vehicle_number, v.vehicle_color
        FROM rides r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        WHERE r.user_id = ?
        ORDER BY r.ride_date DESC, r.ride_start_time DESC
      `, [user_id]);

      for (const ride of rides) {
        const [stops] = await connection.execute(`
          SELECT * FROM ride_stops WHERE ride_id = ? ORDER BY stop_order ASC
        `, [ride.id]);

        const [passengersRaw] = await connection.execute(`
          SELECT 
            b.id AS booking_id, b.otp_verify, b.pay_status,.b.pay_mode,
            b.ride_id, b.from_stop_id, b.to_stop_id, b.status,
            u.id AS user_id, u.name, u.phone, u.profile_image,
            b.seats_booked, b.fare
          FROM ride_bookings b
          JOIN users u ON u.id = b.user_id
          WHERE b.ride_id = ? AND b.status NOT IN (2, 3,6)
        `, [ride.id]);

        const passengers = [];

        for (const p of passengersRaw) {
          let pickup_address = '';
          let drop_address = '';

          if (p.from_stop_id == null && p.to_stop_id == null) {
            pickup_address = ride.start_address;
            drop_address = ride.end_address;
          } else if (p.from_stop_id == null) {
            pickup_address = ride.start_address;

            const [[dropStop]] = await connection.execute(`
              SELECT full_address FROM ride_stops WHERE id = ? LIMIT 1
            `, [p.to_stop_id]);
            drop_address = dropStop?.full_address || '';
          } else if (p.to_stop_id == null) {
            drop_address = ride.end_address;

            const [[pickupStop]] = await connection.execute(`
              SELECT full_address FROM ride_stops WHERE id = ? LIMIT 1
            `, [p.from_stop_id]);
            pickup_address = pickupStop?.full_address || '';
          } else {
            const [[pickupStop]] = await connection.execute(`
              SELECT full_address FROM ride_stops WHERE id = ? LIMIT 1
            `, [p.from_stop_id]);
            const [[dropStop]] = await connection.execute(`
              SELECT full_address FROM ride_stops WHERE id = ? LIMIT 1
            `, [p.to_stop_id]);

            pickup_address = pickupStop?.full_address || '';
            drop_address = dropStop?.full_address || '';
          }

          passengers.push({
            id: p.user_id,
            name: p.name,
            phone: p.phone,
            profile_image: p.profile_image,
            seats_booked: p.seats_booked,
            fare: p.fare,
            status: p.status,
            booking_id: p.booking_id,
            otp_verify: p.otp_verify,
            pay_status: p.pay_status,
			pay_mode: p.pay_mode,  
            pickup_address,
            drop_address
          });
        }

        ride.stops = stops;
        ride.passengers = passengers;
        ride.total_passengers = passengers.reduce((sum, p) => sum + (p.seats_booked || 0), 0);
      }

      return res.status(200).json({
        status: 200,
        message: "Your created rides",
        data: rides
      });

    } else if (type == 2) {
      // ✅ Booked rides (Passenger)
      const [bookings] = await connection.execute(`
        SELECT 
          b.*, 
          r.id AS ride_id,
          r.start_address, r.end_address,
          r.start_city, r.end_city,
          r.full_price AS ride_base_price,
          DATE_FORMAT(r.ride_date, '%Y-%m-%d') AS ride_start_date,
          r.ride_start_time,
          DATE_FORMAT(r.ride_end_date, '%Y-%m-%d') AS ride_end_date,
          r.ride_end_time,
          u.name AS driver_name, u.id AS driver_id, u.phone AS driver_phone, u.profile_image AS driver_image,
          v.brand_name, v.model_name, v.vehicle_number, v.vehicle_color,

          rs1.full_address AS from_address,
          rs1.price_from_start AS from_price_from_start,
          rs1.estimated_departure AS from_estimated_departure,
          rs1.departureestimated_date AS from_departure_date,

          rs2.full_address AS to_address,
          rs2.price_from_start AS to_price_from_start,
          rs2.estimated_arrival AS to_estimated_arrival,
          rs2.arrivalestimated_date AS to_arrival_date

        FROM ride_bookings b
        JOIN rides r ON r.id = b.ride_id
        JOIN users u ON r.user_id = u.id
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        LEFT JOIN ride_stops rs1 ON b.from_stop_id = rs1.id
        LEFT JOIN ride_stops rs2 ON b.to_stop_id = rs2.id
        WHERE b.user_id = ?
        ORDER BY r.ride_date DESC, r.ride_start_time DESC
      `, [user_id]);

      for (const booking of bookings) {
        const isStopToStop = booking.from_price_from_start != null && booking.to_price_from_start != null;
        const isStartToStop = booking.from_price_from_start == null && booking.to_price_from_start != null;
        const isStopToEnd = booking.from_price_from_start != null && booking.to_price_from_start == null;

        if (isStopToStop) {
          booking.pickup_date = booking.from_departure_date || booking.ride_start_date;
          booking.pickup_time = booking.from_estimated_departure || booking.ride_start_time;
          booking.drop_date = booking.to_arrival_date || booking.ride_end_date;
          booking.drop_time = booking.to_estimated_arrival || booking.ride_end_time;

          const fare = parseFloat(booking.to_price_from_start) - parseFloat(booking.from_price_from_start);
          booking.full_price = fare.toFixed(2);

        } else if (isStartToStop) {
          booking.pickup_date = booking.ride_start_date;
          booking.pickup_time = booking.ride_start_time;
          booking.drop_date = booking.to_arrival_date || booking.ride_end_date;
          booking.drop_time = booking.to_estimated_arrival || booking.ride_end_time;

          const fare = parseFloat(booking.to_price_from_start);
          booking.full_price = fare.toFixed(2);

        } else if (isStopToEnd) {
          booking.pickup_date = booking.from_departure_date || booking.ride_start_date;
          booking.pickup_time = booking.from_estimated_departure || booking.ride_start_time;
          booking.drop_date = booking.ride_end_date;
          booking.drop_time = booking.ride_end_time;

          const fare = parseFloat(booking.ride_base_price) - parseFloat(booking.from_price_from_start);
          booking.full_price = fare.toFixed(2);

        } else {
          booking.pickup_date = booking.ride_start_date;
          booking.pickup_time = booking.ride_start_time;
          booking.drop_date = booking.ride_end_date;
          booking.drop_time = booking.ride_end_time;
          booking.full_price = parseFloat(booking.ride_base_price).toFixed(2);
        }

        booking.from_address = booking.from_address || booking.start_address || null;
        booking.to_address = booking.to_address || booking.end_address || null;

        delete booking.ride_base_price;
        delete booking.from_price_from_start;
        delete booking.to_price_from_start;
        delete booking.from_estimated_departure;
        delete booking.to_estimated_arrival;
        delete booking.from_departure_date;
        delete booking.to_arrival_date;
      }

      return res.status(200).json({ status: 200, message: "Your booked rides", data: bookings });

    } else {
      return res.status(200).json({ status: 400, message: "Invalid type (must be 1 or 2)" });
    }

  } catch (err) {
    console.error("YourRides error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};



// exports.yourRides = async (req, res) => {
//   try {
//     const { user_id, type } = req.body;

//     if (!user_id || !type) {
//       return res.status(200).json({ status: 400, message: "user_id and type are required" });
//     }

//     if (type == 1) {
//       const [rides] = await connection.execute(`
//         SELECT r.*, v.brand_name, v.model_name, v.vehicle_number, v.vehicle_color
//         FROM rides r
//         LEFT JOIN vehicles v ON r.vehicle_id = v.id
//         WHERE r.user_id = ?
//         ORDER BY r.ride_start_datetime ASC
//       `, [user_id]);

//       for (const ride of rides) {
//         const [stops] = await connection.execute(`
//           SELECT * FROM ride_stops WHERE ride_id = ? ORDER BY stop_order ASC
//         `, [ride.id]);

//         const [passengers] = await connection.execute(`
//           SELECT u.id, u.name, u.phone, u.profile_image, b.seats_booked, b.fare
//           FROM ride_bookings b
//           JOIN users u ON u.id = b.user_id
//           WHERE b.ride_id = ? AND b.status != 3
//         `, [ride.id]);

//         ride.stops = stops;
//         ride.passengers = passengers;
//         ride.total_passengers = passengers.length;
//       }

//       // ✅ Separate rides into upcoming and archived
//       const upcoming = rides.filter(ride => ride.status == 1);
//       const archived = rides.filter(ride => ride.status != 1);

//       return res.status(200).json({ status: 200, message: "Your created rides", data: { upcoming, archived } });

//     } else if (type == 2) {
//       const [bookings] = await connection.execute(`
//         SELECT 
//           b.*, 
//           r.id AS ride_id,
//           r.start_address, r.end_address,
//           r.start_city, r.end_city,
//           r.full_price AS ride_base_price,
//           r.ride_date AS ride_start_date,
//           r.ride_start_time,
//           r.ride_end_date,
//           r.ride_end_time,
//           u.name AS driver_name, u.phone AS driver_phone, u.profile_image AS driver_image,
//           v.brand_name, v.model_name, v.vehicle_number, v.vehicle_color,

//           rs1.full_address AS from_address,
//           rs1.price_from_start AS from_price_from_start,
//           rs1.estimated_departure AS from_estimated_departure,
//           rs1.departureestimated_date AS from_departure_date,

//           rs2.full_address AS to_address,
//           rs2.price_from_start AS to_price_from_start,
//           rs2.estimated_arrival AS to_estimated_arrival,
//           rs2.arrivalestimated_date AS to_arrival_date

//         FROM ride_bookings b
//         JOIN rides r ON r.id = b.ride_id
//         JOIN users u ON r.user_id = u.id
//         LEFT JOIN vehicles v ON r.vehicle_id = v.id
//         LEFT JOIN ride_stops rs1 ON b.from_stop_id = rs1.id
//         LEFT JOIN ride_stops rs2 ON b.to_stop_id = rs2.id
//         WHERE b.user_id = ?
//         ORDER BY r.ride_start_datetime DESC
//       `, [user_id]);

//       for (const booking of bookings) {
//         const isStopToStop = booking.from_price_from_start != null && booking.to_price_from_start != null;

//         if (isStopToStop) {
//           booking.pickup_date = booking.from_departure_date || booking.ride_start_date;
//           booking.pickup_time = booking.from_estimated_departure || booking.ride_start_time;
//           booking.drop_date = booking.to_arrival_date || booking.ride_end_date;
//           booking.drop_time = booking.to_estimated_arrival || booking.ride_end_time;

//           const fare = parseFloat(booking.to_price_from_start) - parseFloat(booking.from_price_from_start);
//           booking.full_price = fare.toFixed(2);
//         } else {
//           booking.pickup_date = booking.ride_start_date;
//           booking.pickup_time = booking.ride_start_time;
//           booking.drop_date = booking.ride_end_date;
//           booking.drop_time = booking.ride_end_time;
//           booking.full_price = parseFloat(booking.ride_base_price).toFixed(2);
//         }

//         booking.from_address = booking.from_address || booking.start_address || null;
//         booking.to_address = booking.to_address || booking.end_address || null;

//         delete booking.ride_base_price;
//         delete booking.from_price_from_start;
//         delete booking.to_price_from_start;
//         delete booking.from_estimated_departure;
//         delete booking.to_estimated_arrival;
//         delete booking.from_departure_date;
//         delete booking.to_arrival_date;
//       }

//       // ✅ Separate bookings into upcoming and archived
//       const upcoming = bookings.filter(b => b.status == 0 || b.status == 1);
//       const archived = bookings.filter(b => b.status != 0 && b.status != 1);

//       return res.status(200).json({ status: 200, message: "Your booked rides", data: { upcoming, archived } });

//     } else {
//       return res.status(200).json({ status: 400, message: "Invalid type (must be 1 or 2)" });
//     }

//   } catch (err) {
//     console.error("YourRides error:", err);
//     return res.status(500).json({ status: 500, error: "Server error" });
//   }
// };

// exports.yourRides = async (req, res) => {
//   try {
//     const { user_id, type } = req.body;

//     if (!user_id || !type) {
//       return res.status(200).json({ status: 400, message: "user_id and type are required" });
//     }

//     // 📅 Get today's date at midnight (00:00:00)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (type == 1) {
//       const [rides] = await connection.execute(`
//         SELECT r.*, v.brand_name, v.model_name, v.vehicle_number, v.vehicle_color
//         FROM rides r
//         LEFT JOIN vehicles v ON r.vehicle_id = v.id
//         WHERE r.user_id = ?
//         ORDER BY r.ride_start_datetime ASC
//       `, [user_id]);

//       for (const ride of rides) {
//         const [stops] = await connection.execute(`
//           SELECT * FROM ride_stops WHERE ride_id = ? ORDER BY stop_order ASC
//         `, [ride.id]);

//         const [passengers] = await connection.execute(`
//           SELECT u.id, u.name, u.phone, u.profile_image, b.seats_booked, b.fare
//           FROM ride_bookings b
//           JOIN users u ON u.id = b.user_id
//           WHERE b.ride_id = ? AND b.status != 3
//         `, [ride.id]);

//         ride.stops = stops;
//         ride.passengers = passengers;
//         ride.total_passengers = passengers.length;
//       }

//       // ✅ Filter upcoming and archived based on date and status
//       const upcoming = rides.filter(ride =>
//         ride.status == 1 && new Date(ride.ride_start_datetime) >= today
//       );

//       const archived = rides.filter(ride =>
//         ride.status != 1 || new Date(ride.ride_start_datetime) < today
//       );

//       return res.status(200).json({
//         status: 200,
//         message: "Your created rides",
//         data: { upcoming, archived }
//       });

//     } else if (type == 2) {
//       const [bookings] = await connection.execute(`
//         SELECT 
//           b.*, 
//           r.id AS ride_id,
//           r.start_address, r.end_address,
//           r.start_city, r.end_city,
//           r.full_price AS ride_base_price,
//           r.ride_date AS ride_start_date,
//           r.ride_start_time,
//           r.ride_end_date,
//           r.ride_end_time,
//           u.name AS driver_name, u.phone AS driver_phone, u.profile_image AS driver_image,
//           v.brand_name, v.model_name, v.vehicle_number, v.vehicle_color,

//           rs1.full_address AS from_address,
//           rs1.price_from_start AS from_price_from_start,
//           rs1.estimated_departure AS from_estimated_departure,
//           rs1.departureestimated_date AS from_departure_date,

//           rs2.full_address AS to_address,
//           rs2.price_from_start AS to_price_from_start,
//           rs2.estimated_arrival AS to_estimated_arrival,
//           rs2.arrivalestimated_date AS to_arrival_date

//         FROM ride_bookings b
//         JOIN rides r ON r.id = b.ride_id
//         JOIN users u ON r.user_id = u.id
//         LEFT JOIN vehicles v ON r.vehicle_id = v.id
//         LEFT JOIN ride_stops rs1 ON b.from_stop_id = rs1.id
//         LEFT JOIN ride_stops rs2 ON b.to_stop_id = rs2.id
//         WHERE b.user_id = ?
//         ORDER BY r.ride_start_datetime DESC
//       `, [user_id]);

//       for (const booking of bookings) {
//         const isStopToStop = booking.from_price_from_start != null && booking.to_price_from_start != null;

//         if (isStopToStop) {
//           booking.pickup_date = booking.from_departure_date || booking.ride_start_date;
//           booking.pickup_time = booking.from_estimated_departure || booking.ride_start_time;
//           booking.drop_date = booking.to_arrival_date || booking.ride_end_date;
//           booking.drop_time = booking.to_estimated_arrival || booking.ride_end_time;

//           const fare = parseFloat(booking.to_price_from_start) - parseFloat(booking.from_price_from_start);
//           booking.full_price = fare.toFixed(2);
//         } else {
//           booking.pickup_date = booking.ride_start_date;
//           booking.pickup_time = booking.ride_start_time;
//           booking.drop_date = booking.ride_end_date;
//           booking.drop_time = booking.ride_end_time;
//           booking.full_price = parseFloat(booking.ride_base_price).toFixed(2);
//         }

//         booking.from_address = booking.from_address || booking.start_address || null;
//         booking.to_address = booking.to_address || booking.end_address || null;

//         delete booking.ride_base_price;
//         delete booking.from_price_from_start;
//         delete booking.to_price_from_start;
//         delete booking.from_estimated_departure;
//         delete booking.to_estimated_arrival;
//         delete booking.from_departure_date;
//         delete booking.to_arrival_date;
//       }

//       // ✅ Filter upcoming and archived based on date and status
//       const upcoming = bookings.filter(b => {
//         const rideDate = new Date(b.ride_start_date || b.pickup_date);
//         rideDate.setHours(0, 0, 0, 0);
//         return (b.status == 0 || b.status == 1) && rideDate >= today;
//       });

//       const archived = bookings.filter(b => {
//         const rideDate = new Date(b.ride_start_date || b.pickup_date);
//         rideDate.setHours(0, 0, 0, 0);
//         return !(b.status == 0 || b.status == 1) || rideDate < today;
//       });

//       return res.status(200).json({
//         status: 200,
//         message: "Your booked rides",
//         data: { upcoming, archived }
//       });

//     } else {
//       return res.status(200).json({ status: 400, message: "Invalid type (must be 1 or 2)" });
//     }

//   } catch (err) {
//     console.error("YourRides error:", err);
//     return res.status(500).json({ status: 500, error: "Server error" });
//   }
// };


exports.deleteSavedRoute = async (req, res) => {
  try {
    const { route_id, user_id } = req.body;

    if (!route_id || !user_id) {
      return res.status(200).json({
        status: 400,
        message: "route_id and user_id are required"
      });
    }

    const [result] = await connection.execute(
      `DELETE FROM user_saved_routes WHERE id = ? AND user_id = ?`,
      [route_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(200).json({
        status: 404,
        message: "Saved route not found or already deleted"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Saved route deleted successfully"
    });

  } catch (err) {
    console.error("Delete saved route error:", err);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};



exports.updateRide = async (req, res) => {
  try {
    const {
      ride_id,
      user_id,
      start_address,
      end_address,
      start_lat,
      start_lng,
      end_lat,
      end_lng,
      ride_time,
      ride_date,
      total_seats,
      available_seats,
      full_price,
      vehicle_id,
      booking_mode,
      toll_status,
      comment,
      stops
    } = req.body;

    if (!ride_id || !user_id) {
      return res.status(200).json({ status: 400, message: "ride_id and user_id are required" });
    }

    // Fetch existing ride
    const [existing] = await connection.execute(
      `SELECT * FROM rides WHERE id = ? AND user_id = ?`, [ride_id, user_id]
    );

    if (existing.length === 0) {
      return res.status(200).json({ status: 400, message: "Ride not found" });
    }

    const existingRide = existing[0];

    let updateFields = [];
    let updateValues = [];

    if (start_address) {
      updateFields.push("start_address = ?");
      updateValues.push(start_address);
      updateFields.push("start_city = ?");
      updateValues.push(normalizeCity(await getCityFromAddress(start_address)));
    }

    if (end_address) {
      updateFields.push("end_address = ?");
      updateValues.push(end_address);
      updateFields.push("end_city = ?");
      updateValues.push(normalizeCity(await getCityFromAddress(end_address)));
    }

    if (start_lat) updateFields.push("start_lat = ?"), updateValues.push(start_lat);
    if (start_lng) updateFields.push("start_lng = ?"), updateValues.push(start_lng);
    if (end_lat) updateFields.push("end_lat = ?"), updateValues.push(end_lat);
    if (end_lng) updateFields.push("end_lng = ?"), updateValues.push(end_lng);
    if (ride_time) updateFields.push("ride_start_time = ?"), updateValues.push(ride_time);
    if (ride_date) updateFields.push("ride_date = ?"), updateValues.push(ride_date);

    if (ride_date && ride_time) {
      updateFields.push("ride_start_datetime = ?");
      updateValues.push(new Date(`${ride_date}T${ride_time}`));
    }

    if (total_seats) updateFields.push("total_seats = ?"), updateValues.push(total_seats);
    if (available_seats) updateFields.push("available_seats = ?"), updateValues.push(available_seats);
    if (full_price) updateFields.push("full_price = ?"), updateValues.push(full_price);
    if (vehicle_id !== undefined) updateFields.push("vehicle_id = ?"), updateValues.push(vehicle_id);
    if (booking_mode !== undefined) updateFields.push("booking_mode = ?"), updateValues.push(booking_mode);
    if (toll_status !== undefined) updateFields.push("toll_status = ?"), updateValues.push(toll_status);
    if (comment !== undefined) updateFields.push("comment = ?"), updateValues.push(comment);

    if (updateFields.length > 0) {
      const query = `UPDATE rides SET ${updateFields.join(", ")} WHERE id = ? AND user_id = ?`;
      updateValues.push(ride_id, user_id);
      await connection.execute(query, updateValues);
    }

    // ✅ Update stops (delete old & insert new if given)
    if (Array.isArray(stops)) {
      await connection.execute(`DELETE FROM ride_stops WHERE ride_id = ?`, [ride_id]);

      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const stop_city = normalizeCity(await getCityFromAddress(stop.full_address));

        await connection.execute(
          `INSERT INTO ride_stops (
            ride_id, stop_order, full_address, city_name,
            estimated_departure, estimated_arrival, price_from_start
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            ride_id, i + 1, stop.full_address, stop_city,
            stop.estimated_departure || null,
            stop.estimated_arrival || null,
            stop.price_from_start || 0
          ]
        );
      }
    }

    return res.status(200).json({ status: 200, message: "Ride updated successfully" });

  } catch (err) {
    console.error("Update Ride Error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};




// exports.cancelRideOrBooking = async (req, res) => {
//   try {
//     const { user_id, ride_id, type, target_user_id } = req.body;

//     if (!user_id || !ride_id || !type) {
//       return res.status(200).json({ status: 400, message: "user_id, ride_id and type are required" });
//     }

//     // ✅ Type 1: User cancels their own booking
//     if (type == 1) {
//       const [booking] = await connection.execute(
//         `SELECT * FROM ride_bookings WHERE ride_id = ? AND user_id = ? AND status IN (0, 1)`,
//         [ride_id, user_id]
//       );

//       if (booking.length === 0) {
//         return res.status(200).json({ status: 400, message: "No active or pending booking found" });
//       }

//       const seats_booked = booking[0].seats_booked;

//       await connection.execute(
//         `UPDATE ride_bookings SET status = 2 WHERE ride_id = ? AND user_id = ?`,
//         [ride_id, user_id]
//       );

//       if (booking[0].status == 1) {
//         await connection.execute(
//           `UPDATE rides SET available_seats = available_seats + ? WHERE id = ?`,
//           [seats_booked, ride_id]
//         );
//       }

//       const [driverRow] = await connection.execute(
//         `SELECT u.fcm_token FROM rides r JOIN users u ON r.user_id = u.id WHERE r.id = ?`,
//         [ride_id]
//       );

//       if (driverRow.length > 0 && driverRow[0].fcm_token) {
//         await sendNotification(
//           driverRow[0].fcm_token,
//           "Booking Cancelled",
//           "A passenger has cancelled their booking."
//         );
//       }

//       return res.status(200).json({ status: 200, message: "Booking cancelled by user" });
//     }

//     // ✅ Type 2: Driver cancels the entire ride
//     if (type == 2) {
//       const [ride] = await connection.execute(
//         `SELECT * FROM rides WHERE id = ? AND user_id = ? AND status = 1`,
//         [ride_id, user_id]
//       );

//       if (ride.length === 0) {
//         return res.status(400).json({ status: 400, message: "Active ride not found for this user" });
//       }

//       await connection.execute(`UPDATE rides SET status = 3 WHERE id = ?`, [ride_id]);
//       await connection.execute(
//         `UPDATE ride_bookings SET status = 3 WHERE ride_id = ? AND status IN (0, 1)`,
//         [ride_id]
//       );

//       const [passengers] = await connection.execute(
//         `SELECT u.fcm_token FROM ride_bookings b JOIN users u ON b.user_id = u.id WHERE b.ride_id = ? AND b.status != 2`,
//         [ride_id]
//       );

//       for (const p of passengers) {
//         if (p.fcm_token) {
//           await sendNotification(
//             p.fcm_token,
//             "Ride Cancelled",
//             "Your ride has been cancelled by the driver."
//           );
//         }
//       }

//       return res.status(200).json({ status: 200, message: "Ride and all bookings cancelled" });
//     }

//     // ✅ Type 3: Driver confirms a passenger booking
//     if (type == 3) {
//       if (!target_user_id) {
//         return res.status(200).json({ status: 400, message: "target_user_id is required" });
//       }

//       const [booking] = await connection.execute(
//         `SELECT * FROM ride_bookings WHERE ride_id = ? AND user_id = ? AND status = 0`,
//         [ride_id, target_user_id]
//       );

//       if (booking.length === 0) {
//         return res.status(200).json({ status: 400, message: "No pending booking found" });
//       }

//       const seats_requested = booking[0].seats_booked;

//       const [ride] = await connection.execute(
//         `SELECT available_seats FROM rides WHERE id = ?`,
//         [ride_id]
//       );

//       if (ride.length === 0 || ride[0].available_seats < seats_requested) {
//         return res.status(200).json({ status: 400, message: "Insufficient available seats" });
//       }

//       await connection.execute(
//         `UPDATE ride_bookings SET status = 1 WHERE ride_id = ? AND user_id = ?`,
//         [ride_id, target_user_id]
//       );

//       await connection.execute(
//         `UPDATE rides SET available_seats = available_seats - ? WHERE id = ?`,
//         [seats_requested, ride_id]
//       );

//       const [userRow] = await connection.execute(
//         `SELECT fcm_token FROM users WHERE id = ?`,
//         [target_user_id]
//       );

//       if (userRow.length > 0 && userRow[0].fcm_token) {
//         await sendNotification(
//           userRow[0].fcm_token,
//           "Booking Confirmed",
//           "Your booking has been confirmed by the driver."
//         );
//       }

//       return res.status(200).json({ status: 200, message: "Booking confirmed successfully" });
//     }

//     // ✅ Type 4: Driver rejects passenger booking
//     if (type == 4) {
//       if (!target_user_id) {
//         return res.status(200).json({ status: 400, message: "target_user_id is required" });
//       }

//       const [booking] = await connection.execute(
//         `SELECT * FROM ride_bookings WHERE ride_id = ? AND user_id = ? AND status IN (0, 1)`,
//         [ride_id, target_user_id]
//       );

//       if (booking.length === 0) {
//         return res.status(200).json({ status: 400, message: "No booking found to reject" });
//       }

//       const seats = booking[0].seats_booked;

//       // Update booking to cancelled by driver
//       await connection.execute(
//         `UPDATE ride_bookings SET status = 3 WHERE ride_id = ? AND user_id = ?`,
//         [ride_id, target_user_id]
//       );

//       // If booking was confirmed, restore seats
//       if (booking[0].status == 1) {
//         await connection.execute(
//           `UPDATE rides SET available_seats = available_seats + ? WHERE id = ?`,
//           [seats, ride_id]
//         );
//       }

//       // 🔔 Notify user
//       const [userRow] = await connection.execute(
//         `SELECT fcm_token FROM users WHERE id = ?`,
//         [target_user_id]
//       );

//       if (userRow.length > 0 && userRow[0].fcm_token) {
//         await sendNotification(
//           userRow[0].fcm_token,
//           "Booking Rejected",
//           "Your booking was rejected by the driver."
//         );
//       }

//       return res.status(200).json({ status: 200, message: "Booking rejected by driver" });
//     }

//     return res.status(200).json({ status: 400, message: "Invalid type" });

//   } catch (err) {
//     console.error("Booking/Cancel Error:", err);
//     return res.status(500).json({ status: 500, error: "Server error" });
//   }
// };
exports.cancelRideOrBooking = async (req, res) => {
  try {
    const { user_id, ride_id, type, target_user_id, booking_id } = req.body;

    if (!user_id || !ride_id || !type) {
      return res.status(200).json({ status: 400, message: "user_id, ride_id and type are required" });
    }

    // ✅ Type 1: User cancels their own booking
    if (type == 1) {
      if (!booking_id) {
        return res.status(200).json({ status: 400, message: "booking_id is required" });
      }

      const [booking] = await connection.execute(
        `SELECT * FROM ride_bookings WHERE id = ? AND user_id = ? AND status IN (0, 1)`,
        [booking_id, user_id]
      );

      if (booking.length === 0) {
        return res.status(200).json({ status: 400, message: "No active or pending booking found" });
      }

      const seats_booked = booking[0].seats_booked;
      const ride_id = booking[0].ride_id;

      await connection.execute(
        `UPDATE ride_bookings SET status = 2 WHERE id = ?`,
        [booking_id]
      );

      if (booking[0].status == 1) {
        await connection.execute(
          `UPDATE rides SET available_seats = available_seats + ? WHERE id = ?`,
          [seats_booked, ride_id]
        );
      }

      const [driverRow] = await connection.execute(
        `SELECT u.fcm_token FROM rides r JOIN users u ON r.user_id = u.id WHERE r.id = ?`,
        [ride_id]
      );

      if (driverRow.length > 0 && driverRow[0].fcm_token) {
        await sendNotification(
          driverRow[0].fcm_token,
          "Booking Cancelled",
          "A passenger has cancelled their booking.",
			"2"
        );
      }

      return res.status(200).json({ status: 200, message: "Booking cancelled by user" });
    }

    // ✅ Type 2: Driver cancels the entire ride (no booking_id required)
    // ✅ Type 2: Driver cancels the entire ride (no booking_id required)
if (type == 2) {
  const [ride] = await connection.execute(
    `SELECT * FROM rides WHERE id = ? AND user_id = ? AND status = 1`,
    [ride_id, user_id]
  );

  if (ride.length === 0) {
    return res.status(400).json({ status: 400, message: "Active ride not found for this user" });
  }

  // Update ride and active bookings only
  await connection.execute(`UPDATE rides SET status = 3 WHERE id = ?`, [ride_id]);
  await connection.execute(
    `UPDATE ride_bookings SET status = 3 WHERE ride_id = ? AND status IN (0, 1)`,
    [ride_id]
  );

  // ✅ Get only active passengers who were affected
  const [passengers] = await connection.execute(
    `SELECT u.fcm_token 
     FROM ride_bookings b 
     JOIN users u ON b.user_id = u.id 
     WHERE b.ride_id = ? AND b.status IN (0, 1)`, // only those we just cancelled
    [ride_id]
  );

  for (const p of passengers) {
    if (p.fcm_token) {
      await sendNotification(
        p.fcm_token,
        "Ride Cancelled",
        "Your ride has been cancelled by the driver.",
        "1"
      );
    }
  }

  return res.status(200).json({ status: 200, message: "Ride and all bookings cancelled" });
}

 // ✅ Type 3: Driver confirms a passenger booking
if (type == 3) {
  if (!booking_id) {
    return res.status(200).json({ status: 400, message: "booking_id is required" });
  }

  const [booking] = await connection.execute(
    `SELECT * FROM ride_bookings WHERE id = ? AND status = 0`,
    [booking_id]
  );

  if (booking.length === 0) {
    return res.status(200).json({ status: 400, message: "No pending booking found" });
  }

  const seats_requested = booking[0].seats_booked;
  const ride_id = booking[0].ride_id;
  const target_user_id = booking[0].user_id;

  const [ride] = await connection.execute(
    `SELECT available_seats FROM rides WHERE id = ?`,
    [ride_id]
  );

  if (ride.length === 0 || ride[0].available_seats < seats_requested) {
    return res.status(200).json({ status: 400, message: "Insufficient available seats" });
  }

  // ✅ Confirm this booking
  await connection.execute(
    `UPDATE ride_bookings SET status = 1 WHERE id = ?`,
    [booking_id]
  );

  await connection.execute(
    `UPDATE rides SET available_seats = available_seats - ? WHERE id = ?`,
    [seats_requested, ride_id]
  );

  const [[updatedRide]] = await connection.execute(
    `SELECT available_seats FROM rides WHERE id = ?`,
    [ride_id]
  );

  // ✅ If ride is now full → cancel only pending bookings
  if (updatedRide.available_seats === 0) {
    // 1️⃣ Select all pending bookings that are about to be cancelled
    const [pendingBookings] = await connection.execute(
      `SELECT DISTINCT b.id, u.fcm_token 
       FROM ride_bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.ride_id = ? AND b.status = 0`,
      [ride_id]
    );

    // 2️⃣ Cancel only these pending bookings
    if (pendingBookings.length > 0) {
      const idsToCancel = pendingBookings.map(b => b.id);
      await connection.execute(
        `UPDATE ride_bookings SET status = 3 WHERE id IN (${idsToCancel.join(',')})`
      );

      // 3️⃣ Notify only the users of cancelled bookings
      for (const p of pendingBookings) {
        if (p.fcm_token) {
          await sendNotification(
            p.fcm_token,
            "Booking Cancelled",
            "Your booking was auto-cancelled as the ride is now full.",
			  "1"
          );
        }
      }
    }
  }

  // ✅ Notify the confirmed user
  const [userRow] = await connection.execute(
    `SELECT fcm_token FROM users WHERE id = ?`,
    [target_user_id]
  );

  if (userRow.length > 0 && userRow[0].fcm_token) {
    await sendNotification(
      userRow[0].fcm_token,
      "Booking Confirmed",
      "Your booking has been confirmed by the driver.",
		"1"
    );
  }

  return res.status(200).json({ status: 200, message: "Booking confirmed successfully" });
}



    // ✅ Type 4: Driver rejects passenger booking
    if (type == 4) {
      if (!booking_id) {
        return res.status(200).json({ status: 400, message: "booking_id is required" });
      }

      const [booking] = await connection.execute(
        `SELECT * FROM ride_bookings WHERE id = ? AND status IN (0, 1)`,
        [booking_id]
      );

      if (booking.length === 0) {
        return res.status(200).json({ status: 400, message: "No booking found to reject" });
      }

      const seats = booking[0].seats_booked;
      const ride_id = booking[0].ride_id;
      const target_user_id = booking[0].user_id;

      await connection.execute(
        `UPDATE ride_bookings SET status = 3 WHERE id = ? AND status = 0`,
        [booking_id]
      );

      if (booking[0].status == 1) {
        await connection.execute(
          `UPDATE rides SET available_seats = available_seats + ? WHERE id = ?`,
          [seats, ride_id]
        );
      }

      const [userRow] = await connection.execute(
        `SELECT fcm_token FROM users WHERE id = ?`,
        [target_user_id]
      );

      if (userRow.length > 0 && userRow[0].fcm_token) {
        await sendNotification(
          userRow[0].fcm_token,
          "Booking Rejected",
          "Your booking was rejected by the driver.",
			"1"
        );
      }

      return res.status(200).json({ status: 200, message: "Booking rejected by driver" });
    }

    // ✅ Type 5: Driver marks user as picked up
    if (type == 5) {
      if (!booking_id) {
        return res.status(200).json({ status: 400, message: "booking_id is required" });
      }

      const [booking] = await connection.execute(
        `SELECT * FROM ride_bookings WHERE id = ? AND status = 1`,
        [booking_id]
      );

      if (booking.length === 0) {
        return res.status(200).json({ status: 400, message: "Confirmed booking not found" });
      }

      const target_user_id = booking[0].user_id;

      await connection.execute(
        `UPDATE ride_bookings SET status = 5, updated_at = NOW() WHERE id = ?`,
        [booking_id]
      );

      const [userRow] = await connection.execute(
        `SELECT fcm_token FROM users WHERE id = ?`,
        [target_user_id]
      );

      if (userRow.length > 0 && userRow[0].fcm_token) {
        await sendNotification(
          userRow[0].fcm_token,
          "Picked Up",
          "You have been marked as picked up by the driver.",
			"1"
        );
      }

      return res.status(200).json({ status: 200, message: "Passenger marked as picked up" });
    }

    // ✅ Type 6: Driver marks user as no-show
    if (type == 6) {
      if (!booking_id) {
        return res.status(200).json({ status: 400, message: "booking_id is required" });
      }

      const [booking] = await connection.execute(
        `SELECT * FROM ride_bookings WHERE id = ? AND status = 1`,
        [booking_id]
      );

      if (booking.length === 0) {
        return res.status(200).json({ status: 400, message: "Confirmed booking not found" });
      }

      const ride_id = booking[0].ride_id;
      const seats = booking[0].seats_booked;
      const target_user_id = booking[0].user_id;

      await connection.execute(
        `UPDATE ride_bookings SET status = 6, updated_at = NOW() WHERE id = ?`,
        [booking_id]
      );

      await connection.execute(
        `UPDATE rides SET available_seats = available_seats + ? WHERE id = ?`,
        [seats, ride_id]
      );

      const [userRow] = await connection.execute(
        `SELECT fcm_token FROM users WHERE id = ?`,
        [target_user_id]
      );

      if (userRow.length > 0 && userRow[0].fcm_token) {
        await sendNotification(
          userRow[0].fcm_token,
          "No Show",
          "You were marked as not present at the pickup point.",
			"1"
        );
      }

      return res.status(200).json({ status: 200, message: "Passenger marked as no-show" });
    }

    // ❌ Invalid type
    return res.status(200).json({ status: 400, message: "Invalid type" });

  } catch (err) {
    console.error("Booking/Cancel Error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};


exports.getFareRules = async (req, res) => {
  try {
    const [rows] = await connection.execute(
      `SELECT id, min_km, max_km, rate_per_km, created_at FROM fare_rules ORDER BY min_km ASC`
    );

    res.status(200).json({
      status: 200,
      message: "Fare rules fetched successfully",
      data: rows
    });
  } catch (err) {
    console.error("Fare rule fetch error:", err);
    res.status(500).json({ status: 500, error: "Server error" });
  }
};

// POST /api/reports
exports.getReports = async (req, res) => {
  try {
    const { reporter_id } = req.body;

    if (!reporter_id) {
      return res.status(402000).json({
        status: 400,
        message: "reporter_id is required in body"
      });
    }

    const [reports] = await connection.execute(`
      SELECT 
        reports.id,
        reports.reporter_id,
        reporter.name AS user_name,
        reports.reported_user_id,
        reported.name AS driver_name,
        reported.phone AS driver_mobile,
        reported.profile_image AS driver_image,
        reports.reason,
        reports.created_at
      FROM reports
      LEFT JOIN users AS reporter ON reports.reporter_id = reporter.id
      LEFT JOIN users AS reported ON reports.reported_user_id = reported.id
      WHERE reports.reporter_id = ?
    `, [reporter_id]);

    // Optional: Add full image URL
    reports.forEach(r => {
      if (r.driver_image) {
        r.driver_image = `https://root.ridesbuddy.com${r.driver_image}`;
      }
    });

    return res.status(200).json({
      status: 200,
      message: "Reports fetched successfully",
      data: reports
    });

  } catch (error) {
    console.error("Fetch Reports Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error while fetching reports"
    });
  }
};



exports.completeUserBooking = async (req, res) => {
  try {
    const { ride_id, user_ids, booking_ids } = req.body; // ✅ booking_ids bhi array me aayega

    if (
      !ride_id ||
      !Array.isArray(user_ids) || user_ids.length === 0 ||
      !Array.isArray(booking_ids) || booking_ids.length === 0
    ) {
      return res.status(200).json({
        status: 400,
        message: "ride_id, user_ids (array) and booking_ids (array) are required"
      });
    }

    // ✅ Confirmed bookings fetch karo
    const [bookings] = await connection.execute(
      `SELECT * FROM ride_bookings 
       WHERE ride_id = ? 
       AND user_id IN (${user_ids.map(() => '?').join(',')}) 
       AND id IN (${booking_ids.map(() => '?').join(',')}) 
       AND status = 5`,
      [ride_id, ...user_ids, ...booking_ids]
    );

    if (bookings.length === 0) {
      return res.status(200).json({
        status: 400,
        message: "No confirmed bookings found for provided users and booking_ids"
      });
    }

    const confirmedUserIds = bookings.map(b => b.user_id);
    const confirmedBookingIds = bookings.map(b => b.id);

    // ✅ Update booking status to 4 (completed)
    await connection.execute(
      `UPDATE ride_bookings 
       SET status = 4, updated_at = NOW() 
       WHERE ride_id = ? 
       AND user_id IN (${confirmedUserIds.map(() => '?').join(',')}) 
       AND id IN (${confirmedBookingIds.map(() => '?').join(',')})`,
      [ride_id, ...confirmedUserIds, ...confirmedBookingIds]
    );

    // 🔔 Notify users
    const [users] = await connection.execute(
      `SELECT id, fcm_token 
       FROM users 
       WHERE id IN (${confirmedUserIds.map(() => '?').join(',')}) 
       AND fcm_token IS NOT NULL`,
      [...confirmedUserIds]
    );

    for (const user of users) {
      if (user.fcm_token) {
        await sendNotification(
          user.fcm_token,
          "Booking Completed",
          "Your ride has been marked as completed.",
			"1"
        );
      }
    }

    return res.status(200).json({
      status: 200,
      message: "All confirmed bookings marked as completed",
      completed_user_ids: confirmedUserIds,
      completed_booking_ids: confirmedBookingIds
    });

  } catch (err) {
    console.error("Complete user bookings error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};


exports.completeRide = async (req, res) => {
  try {
    const { ride_id, user_id } = req.body;

    if (!ride_id || !user_id) {
      return res.status(200).json({ status: 400, message: "ride_id and user_id are required" });
    }

    // ✅ Step 1: Check if the ride belongs to the driver and is active
    const [rideCheck] = await connection.execute(
      `SELECT id FROM rides WHERE id = ? AND user_id = ? AND status = 5`,
      [ride_id, user_id]
    );

    if (rideCheck.length === 0) {
      return res.status(200).json({
        status: 400,
        message: "Invalid request. Ride not found, not yours, or already completed."
      });
    }

    // ✅ Step 2: Check if there are any confirmed bookings remaining
    const [confirmedBookings] = await connection.execute(
      `SELECT COUNT(*) AS count FROM ride_bookings WHERE ride_id = ? AND status = 5`,
      [ride_id]
    );

    if (confirmedBookings[0].count > 0) {
      return res.status(200).json({
        status: 400,
        message: "Cannot complete ride. There are still confirmed bookings."
      });
    }

    // ✅ Step 3: Update the ride as completed
    await connection.execute(
      `UPDATE rides SET status = 2, updated_at = NOW() WHERE id = ? AND status = 5`,
      [ride_id]
    );
	  

    // ✅ Optional Step 4: Send push notification to all users of this ride (if needed)
    // Here, you can fetch `fcm_token` of all users for whom status = 4 (completed), or just skip

    return res.status(200).json({
      status: 200,
      message: "Ride marked as completed successfully."
    });

  } catch (err) {
    console.error("Complete ride error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};
exports.startsRide = async (req, res) => {
  try {
    const { ride_id, user_id } = req.body;

    if (!ride_id || !user_id) {
      return res.status(200).json({ status: 400, message: "ride_id and user_id are required" });
    }
 
  

    // ✅ Step 3: Update the ride as completed
    await connection.execute(
      `UPDATE rides SET status = 5, updated_at = NOW() WHERE id = ? AND status = 1`,
      [ride_id]
    );

    // ✅ Optional Step 4: Send push notification to all users of this ride (if needed)
    // Here, you can fetch `fcm_token` of all users for whom status = 4 (completed), or just skip

    return res.status(200).json({
      status: 200,
      message: "Ride marked as started successfully."
    });

  } catch (err) {
    console.error("Complete ride error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};



exports.recordRidePayment = async (req, res) => {
  try {
    const {
      ride_id,
      user_id,
      driver_id,
      amount,
      payment_mode,     // 0 = cash, 1 = online
      payment_status,   // 0 = pending, 1 = completed
      transaction_id,
      status            // 1 = active, 0 = inactive (if needed for soft delete or record tracking)
    } = req.body;

    if (!ride_id || !user_id || !driver_id || !amount || payment_mode === undefined || payment_status === undefined || status === undefined) {
      return res.status(200).json({
        status: 400,
        message: "All fields are required: ride_id, user_id, driver_id, amount, payment_mode, payment_status, status"
      });
    }

    // ✅ Get commission setting
    const [[setting]] = await connection.execute(`SELECT percentage FROM commission_settings LIMIT 1`);
    const commissionPercent = setting?.percentage ?? 10;

    const admin_commission = parseFloat(((commissionPercent / 100) * amount).toFixed(2));
    const driver_earning = parseFloat((amount - admin_commission).toFixed(2));

    // ✅ Step 1: Insert into ride_payments
    await connection.execute(`
      INSERT INTO ride_payments 
        (ride_id, user_id, driver_id, amount, payment_mode, admin_commission, driver_earning, transaction_id, payment_status, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ride_id,
      user_id,
      driver_id,
      amount,
      payment_mode,
      admin_commission,
      driver_earning,
      transaction_id || null,
      payment_status,
      status
    ]);

    // ✅ Step 2: Wallet + Transactions
    if (payment_mode === 1) {
      // 🟢 ONLINE
      await connection.execute(`UPDATE admins SET wallet = wallet + ? WHERE id = 1`, [admin_commission]);
      await connection.execute(`UPDATE users SET wallet = wallet + ? WHERE id = ?`, [driver_earning, driver_id]);

      // Admin transaction
      await connection.execute(`
        INSERT INTO transactions (user_id, type, amount, purpose, role)
        VALUES (?, 1, ?, ?, 'admin')
      `, [1, admin_commission, 'Online ride commission']);

      // Driver credit transaction
      await connection.execute(`
        INSERT INTO transactions (user_id, type, amount, purpose, role)
        VALUES (?, 1, ?, ?, 'user')
      `, [driver_id, driver_earning, 'Ride earning from online payment']);

    } else if (payment_mode === 0) {
      // 🔴 CASH
      await connection.execute(`UPDATE admins SET wallet = wallet + ? WHERE id = 1`, [admin_commission]);
      await connection.execute(`UPDATE users SET admin_dues = admin_dues + ? WHERE id = ?`, [admin_commission, driver_id]);

      // Admin transaction (expected cash dues)
      await connection.execute(`
        INSERT INTO transactions (user_id, type, amount, purpose, role)
        VALUES (?, 1, ?, ?, 'admin')
      `, [1, admin_commission, 'Cash ride commission']);

      // Driver ride earning (cash collected directly)
      await connection.execute(`
        INSERT INTO transactions (user_id, type, amount, purpose, role)
        VALUES (?, 1, ?, ?, 'user')
      `, [driver_id, driver_earning, 'Ride earning via cash']);
    }

    return res.status(200).json({
      status: 200,
      message: "Payment recorded successfully",
      data: {
        admin_commission,
        driver_earning,
        cash_due_to_admin: payment_mode === 0 ? admin_commission : 0
      }
    });

  } catch (err) {
    console.error("recordRidePayment error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

exports.requestWithdraw = async (req, res) => {
  try {
    const { user_id, amount, account_id } = req.body;

    if (!user_id || !amount || amount <= 0 || !account_id) {
      return res.status(400).json({
        status: 400,
        error: "user_id, account_id, and valid amount are required"
      });
    }

    // ✅ Check user existence and wallet
    const [[user]] = await connection.execute(
      `SELECT wallet FROM users WHERE id = ?`,
      [user_id]
    );

    if (!user) {
      return res.status(200).json({ status: 400, message: "User not found" });
    }

    if (user.wallet < amount) {
      return res.status(400).json({ status: 400, message: "Insufficient wallet balance" });
    }

    // ✅ Check if account_id belongs to user
    const [[account]] = await connection.execute(
      `SELECT id FROM user_bank_accounts WHERE id = ? AND user_id = ?`,
      [account_id, user_id]
    );

    if (!account) {
      return res.status(200).json({
        status: 400,
        message: "Bank account not found for this user"
      });
    }

    // ✅ Deduct amount from wallet
    await connection.execute(
      `UPDATE users SET wallet = wallet - ? WHERE id = ?`,
      [amount, user_id]
    );

    // ✅ Insert withdrawal request with account_id
    await connection.execute(
      `INSERT INTO withdraw_requests (user_id, amount, account_id) VALUES (?, ?, ?)`,
      [user_id, amount, account_id]
    );

    return res.status(200).json({
      status: 200,
      message: "Withdrawal request submitted successfully"
    });

  } catch (err) {
    console.error("Withdraw request error:", err);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};








exports.payDue = async (req, res) => {
  try {
    const {
      user_id,
      amount,
      payment_mode,
      transaction_id,
      screenshot_base64,
      status
    } = req.body;

    if (!user_id || !amount || payment_mode === undefined) {
      return res.status(200).json({
        status: 400,
        message: "Required fields are missing"
      });
    }

    // ✅ Get user's current admin_dues
    const [userResult] = await connection.execute(
      `SELECT admin_dues FROM users WHERE id = ?`,
      [user_id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ status: 404, error: "User not found" });
    }

    const currentDues = parseFloat(userResult[0].admin_dues);
    const payAmount = parseFloat(amount);

    if (currentDues < payAmount) {
      return res.status(200).json({
        status: 400,
        message: "Insufficient admin dues to pay this amount"
      });
    }

    let screenshotPath = null;
    let paymentStatus = 0;

    if (parseInt(payment_mode) === 0) {
      // 🟠 QR-based payment
      if (!screenshot_base64) {
        return res.status(200).json({
          status: 400,
          message: "Screenshot is required for QR payments"
        });
      }

      const base64Data = screenshot_base64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `qr_${Date.now()}.png`;
      const fullPath = path.join(uploadDir, filename);

      fs.writeFileSync(fullPath, buffer);
      screenshotPath = `uploads/${filename}`;
      paymentStatus = 0;

      // ✅ Insert QR payment record
      await connection.execute(
        `INSERT INTO due_payments (user_id, amount, payment_mode, screenshot, transaction_id, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          user_id,
          payAmount,
          payment_mode,
          screenshotPath,
          null,
          paymentStatus
        ]
      );

    } else if (parseInt(payment_mode) === 1) {
      // 🔵 Online payment (update existing pending record)
      if (!transaction_id) {
        return res.status(200).json({
          status: 400,
          message: "Transaction ID is required for online payments"
        });
      }

      if (status === undefined) {
        return res.status(200).json({
          status: 400,
          message: "Status is required for online payments"
        });
      }

      paymentStatus = parseInt(status);

      // ✅ Update existing pending record
      const [updateResult] = await connection.execute(
        `UPDATE due_payments 
         SET status = ? 
         WHERE user_id = ? AND transaction_id = ?`,
        [paymentStatus, user_id, transaction_id]
      );

      if (updateResult.affectedRows === 0) {
        return res.status(200).json({
          status: 400,
          message: "No pending payment found for this user and transaction_id"
        });
      }
    } else {
      return res.status(200).json({
        status: 400,
        message: "Invalid payment_mode. Use 0 (QR) or 1 (Online)"
      });
    }

    // ✅ Subtract from admin_dues
    await connection.execute(
      `UPDATE users SET admin_dues = admin_dues - ? WHERE id = ?`,
      [payAmount, user_id]
    );

    return res.status(200).json({
      status: 200,
      message:
        parseInt(payment_mode) === 0
          ? "QR payment submitted. Awaiting admin verification."
          : "Online payment updated successfully."
    });

  } catch (err) {
    console.error("payDue error:", err);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};
exports.duepaycreatePayment = async (req, res) => { 
  try {
    const { user_id, amount, payment_mode } = req.body;

    if (!user_id || !amount || payment_mode === undefined) {
      return res.json({
        status: "error",
        message: "Fields required: user_id, amount, payment_mode"
      });
    }

    // ✅ Check user exists
    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?", 
      [user_id]
    );

    if (!userRows.length) {
      return res.json({ status: "error", message: "User not found." });
    }

    const user = userRows[0];

    // ✅ Check admin_dues >= amount
    const currentDues = parseFloat(user.admin_dues);
    const payAmount = parseFloat(amount);

    if (currentDues < payAmount) {
      return res.status(200).json({
        status: 400,
        message: "Insufficient admin dues to pay this amount"
      });
    }

    const apiKey = "TEST10256948ec57a943389eb31e588f84965201";
    const secretKey = "cfsk_ma_test_4bf75f253a8b0b51dd9252a617bec825_4076da95";

    // 🔑 Generate transaction/orderId
    const orderId = "ORD" + Date.now() + Math.floor(Math.random() * 1000);

    const data = {
      order_id: orderId,
      order_amount: payAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: String(user.id),
        customer_email: user.email,
        customer_phone: String(user.phone),
        customer_name: user.name
      },
      order_meta: {
        notify_url: "" // callback URL if needed
      },
      payment_methods: "upi_intent"
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": apiKey,
      "x-client-secret": secretKey
    };

    // 🔗 Call Cashfree API
    const response = await axios.post("https://sandbox.cashfree.com/pg/orders", data, { headers });
    const responseData = response.data;

    // ✅ Insert pending record in due_payments
    await connection.execute(
      `INSERT INTO due_payments 
        (user_id, amount, payment_mode, transaction_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        payAmount,
        payment_mode,
        orderId, // Cashfree order id
        0        // pending
      ]
    );

    return res.json({
      status: "success",
      message: "Your payment is being processed successfully! & Your payment is being processed successfully!",
      transaction_id: orderId,
      data: responseData
    });

  } catch (error) {
    console.error("Error in duepaycreatePayment:", error.response?.data || error.message);
    return res.json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};



exports.getDuePaymentHistory = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(200).json({ status: 400, message: "user_id is required" });
    }

    const [rows] = await connection.execute(
      `SELECT id, user_id, amount, payment_mode, screenshot, transaction_id, status, created_at 
       FROM due_payments 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user_id]
    );

    const baseUrl = req.protocol + '://' + req.get('host') + '/';

    const formattedRows = rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      amount: row.amount,
      payment_mode: row.payment_mode,
      transaction_id: row.transaction_id,
      status: row.status,
      screenshot: row.screenshot ? baseUrl + row.screenshot : null,
      created_at: row.created_at
    }));

    return res.status(200).json({
      status: 200,
      message: "Payment history fetched successfully",
      data: formattedRows
    });

  } catch (err) {
    console.error("getDuePaymentHistory error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};


exports.getWithdrawRequestHistory = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(200).json({
        status: 400,
        message: "user_id is required"
      });
    }

    // 🔍 Check if user exists
    const [[user]] = await connection.execute(
      `SELECT id FROM users WHERE id = ?`,
      [user_id]
    );

    if (!user) {
      return res.status(200).json({
        status: 400,
        message: "User not found"
      });
    }

    // ✅ Fetch withdraw request history
    const [rows] = await connection.execute(
      `SELECT * FROM withdraw_requests WHERE user_id = ? ORDER BY requested_at DESC`,
      [user_id]
    );

    return res.status(200).json({
      status: 200,
      message: "Withdraw request history fetched successfully",
      data: rows
    });

  } catch (err) {
    console.error("getWithdrawRequestHistory error:", err);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};


const getRideSeatSegments = async (ride_id, total_seats, rideStops) => {
  try {
    const [bookings] = await connection.execute(
      `SELECT from_stop_id, to_stop_id, seats_booked FROM ride_bookings 
       WHERE ride_id = ? AND status = 'confirmed'`,
      [ride_id]
    );

    const segments = [];

    for (let i = 0; i < rideStops.length - 1; i++) {
      const segment = {
        from_stop_id: rideStops[i].id,
        to_stop_id: rideStops[i + 1].id,
        seatsOccupied: 0
      };

      for (const booking of bookings) {
        if (
          (booking.from_stop_id === null && booking.to_stop_id === null) || // Full ride booking
          (booking.from_stop_id <= segment.from_stop_id && booking.to_stop_id > segment.from_stop_id)
        ) {
          segment.seatsOccupied += booking.seats_booked;
        }
      }

      segment.seatsAvailable = total_seats - segment.seatsOccupied;
      segments.push(segment);
    }

    return segments;
  } catch (err) {
    console.error("Segment error:", err);
    return [];
  }
};


exports.searchRidesss = async (req, res) => {
  try {
    const { from_address, to_address, ride_date, required_seats } = req.body;

    if (!from_address || !to_address || !ride_date || !required_seats) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const from_city = normalizeCity(await getCityFromAddress(from_address));
    const to_city = normalizeCity(await getCityFromAddress(to_address));
    const now = new Date();
    const isToday = ride_date === now.toISOString().split("T")[0];

    const [rides] = await connection.execute(
      `SELECT * FROM rides WHERE ride_date <= ? AND ride_end_date >= ? AND status = '1'`,
      [ride_date, ride_date]
    );

    const result = [];

    for (const ride of rides) {
      const [stops] = await connection.execute(
        `SELECT * FROM ride_stops WHERE ride_id = ? ORDER BY stop_order ASC`,
        [ride.id]
      );

      const fromStop = stops.find(s => normalizeCity(s.city_name) === from_city);
      const toStop = stops.find(s => normalizeCity(s.city_name) === to_city);

      if (!fromStop || !toStop || fromStop.stop_order >= toStop.stop_order) continue;

      const segments = await getRideSeatSegments(ride.id, ride.total_seats, stops);

      const requiredSegments = segments.filter(s =>
        s.from_stop_id >= fromStop.id && s.to_stop_id <= toStop.id
      );

      const hasSeats = requiredSegments.every(s => s.seatsAvailable >= required_seats);
      if (!hasSeats) continue;

      const [driver] = await connection.execute(
        `SELECT id AS driver_id, name AS driver_name, profile_image AS driver_profile, phone AS driver_mobile FROM users WHERE id = ?`,
        [ride.user_id]
      );

      const [passengers] = await connection.execute(
        `SELECT u.id, u.name, u.phone, u.profile_image 
         FROM ride_bookings b 
         JOIN users u ON b.user_id = u.id
         WHERE b.ride_id = ?`,
        [ride.id]
      );

      const [ratings] = await connection.execute(
        `SELECT rating FROM ratings WHERE reviewee_id = ?`,
        [ride.user_id]
      );

      const avg_rating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

      const pickup_time = fromStop.departureestimated_date + ' ' + fromStop.estimated_departure;
      const pickupDateTime = new Date(pickup_time);
      const departure_status = pickupDateTime < now ? 1 : 0;

      if (isToday && departure_status === 1) continue;

      result.push({
        ...ride,
        from_stop_id: fromStop.id,
        to_stop_id: toStop.id,
        pickup_address: fromStop.full_address,
        drop_address: toStop.full_address,
        pickup_time,
        drop_time: toStop.arrivalestimated_date + ' ' + toStop.estimated_arrival,
        price: toStop.price_from_start - fromStop.price_from_start,
        passengers,
        total_passengers: passengers.length,
        driver_average_rating: parseFloat(avg_rating),
        departure_status,
        ...driver[0]
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Rides found",
      data: result
    });

  } catch (err) {
    console.error("Ride search error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

exports.getRideDetailsById = async (req, res) => {
  try {
    const { ride_id } = req.body;

    if (!ride_id) {
      return res.status(400).json({ error: "Missing ride_id" });
    }

    const now = new Date();

    // Ride fetch
    const [rides] = await connection.execute(
      `SELECT * FROM rides WHERE id = ? AND status = '1'`,
      [ride_id]
    );

    if (rides.length === 0) {
      return res.status(404).json({ status: 404, message: "Ride not found" });
    }

    const ride = rides[0];

    // Ride stops
    const [stops] = await connection.execute(
      `SELECT * FROM ride_stops WHERE ride_id = ? ORDER BY stop_order ASC`,
      [ride.id]
    );

    if (!stops.length) {
      return res.status(404).json({ status: 404, message: "Ride stops not found" });
    }

    // सभी segments की availability निकालना
    const segments = await getRideSeatSegments(ride.id, ride.total_seats, stops);

    // ride की पूरी from-to details निकालना
    const fromStop = stops[0]; // ride start stop
    const toStop = stops[stops.length - 1]; // ride last stop

    // Required segments पूरे ride को cover करेंगे
    const requiredSegments = segments.filter(s =>
      s.from_stop_id >= fromStop.id && s.to_stop_id <= toStop.id
    );

    const hasSeats = requiredSegments.every(s => s.seatsAvailable > 0);

    if (!hasSeats) {
      return res.status(200).json({ status: 200, message: "No seats available", data: [] });
    }

    // Driver details
    const [driver] = await connection.execute(
      `SELECT id AS driver_id, name AS driver_name, profile_image AS driver_profile, phone AS driver_mobile 
       FROM users WHERE id = ?`,
      [ride.user_id]
    );

    // Passengers
    const [passengers] = await connection.execute(
      `SELECT u.id, u.name, u.phone, u.profile_image 
       FROM ride_bookings b 
       JOIN users u ON b.user_id = u.id
       WHERE b.ride_id = ?`,
      [ride.id]
    );

    // Ratings
    const [ratings] = await connection.execute(
      `SELECT rating FROM ratings WHERE reviewee_id = ?`,
      [ride.user_id]
    );

    const avg_rating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    // Pickup/Drop time
    const pickup_time = fromStop.departureestimated_date + ' ' + fromStop.estimated_departure;
    const pickupDateTime = new Date(pickup_time);
    const departure_status = pickupDateTime < now ? 1 : 0;

    return res.status(200).json({
      status: 200,
      message: "Ride details found",
      data: {
        ...ride,
        from_stop_id: fromStop.id,
        to_stop_id: toStop.id,
        pickup_address: fromStop.full_address,
        drop_address: toStop.full_address,
        pickup_time,
        drop_time: toStop.arrivalestimated_date + ' ' + toStop.estimated_arrival,
        price: toStop.price_from_start - fromStop.price_from_start,
        passengers,
        total_passengers: passengers.length,
        driver_average_rating: parseFloat(avg_rating),
        departure_status,
        ...driver[0]
      }
    });

  } catch (err) {
    console.error("Ride fetch error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};


// Correct version for MySQL2 Promise Pool
exports.getVehicleColors = async (req, res) => {
  try {
    const [results] = await connection.query(
      "SELECT id, color_name, color_code FROM vehicle_colors WHERE status = 1 ORDER BY color_name ASC"
    );

    return res.status(200).json({
      status: 200,
      message: "Vehicle colors fetched successfully",
      data: results
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Database error",
      error: err.message
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { booking_id, user_id, otp } = req.body;

    if (!booking_id || !user_id || !otp) {
      return res.status(200).json({
        status: 400,
        message: "booking_id, user_id and otp are required"
      });
    }

    // OTP DB se nikal lo
    const [[booking]] = await connection.execute(
      `SELECT id, otp FROM ride_bookings WHERE id = ? AND user_id = ?`,
      [booking_id, user_id]
    );

    if (!booking) {
      return res.status(200).json({
        status: 400,
        message: "Booking not found"
      });
    }

    // Compare OTP
    if (booking.otp && booking.otp.toString() === otp.toString()) {
      // ✅ OTP verify ho gaya → update otp_verify = 1
      await connection.execute(
        `UPDATE ride_bookings SET otp_verify = 1 WHERE id = ? AND user_id = ?`,
        [booking_id, user_id]
      );

      return res.status(200).json({
        status: 200,
        message: "OTP verified successfully",
        booking_id: booking_id
      });
    } else {
      return res.status(200).json({
        status: 400,
        message: "Invalid OTP"
      });
    }

  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};


// ====================== CREATE PAYMENT (ONLINE) ======================
exports.createPayment = async (req, res) => {
  try {
    const { user_id, amount, ride_id, driver_id } = req.body;

    if (!user_id || !amount || !ride_id || !driver_id) {
      return res.json({
        status: "error",
        message: "Fields required: user_id, amount, ride_id, driver_id"
      });
    }

    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?", 
      [user_id]
    );

    if (!userRows.length) {
      return res.json({ status: "error", message: "User not found." });
    }

    const user = userRows[0];

    const apiKey = "TEST10256948ec57a943389eb31e588f84965201";
    const secretKey = "cfsk_ma_test_4bf75f253a8b0b51dd9252a617bec825_4076da95";

    const orderId = "ORD" + Date.now() + Math.floor(Math.random() * 1000);

    const data = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: String(user.id),
        customer_email: user.email,
        customer_phone: String(user.phone),
        customer_name: user.name
      },
      order_meta: { notify_url: "" },
      payment_methods: "upi_intent"
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": apiKey,
      "x-client-secret": secretKey
    };

    const response = await axios.post("https://sandbox.cashfree.com/pg/orders", data, { headers });
    const responseData = response.data;

    // Insert pending payment
    await connection.execute(
      `INSERT INTO ride_payments 
        (ride_id, user_id, driver_id, amount, payment_mode, admin_commission, driver_earning, transaction_id, payment_status, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ride_id,
        user_id,
        driver_id,
        parseFloat(amount),
        1, // online
        0,
        0,
        orderId,
        0, // pending
        1
      ]
    );

    return res.json({
      status: "success",
      message: "Your payment is being processed successfully! & Your payment is being processed successfully!",
      data: responseData
    });

  } catch (error) {
    console.error("Error in createPayment:", error.response?.data || error.message);
    return res.json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};


// ====================== PAYMENT CALLBACK (ONLINE) ======================
exports.ridePaymentCallback = async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data.order_id || !data.payment_status) {
      return res.json({ status: "invalid data" });
    }

    console.log("Ride Payment Callback Received:", JSON.stringify(data));

    const statusValue = data.payment_status === "SUCCESS" ? 1 : 0;

    const [rows] = await connection.execute(
      "SELECT * FROM ride_payments WHERE transaction_id = ? LIMIT 1",
      [data.order_id]
    );

    if (!rows.length) {
      return res.status(404).json({ status: "error", message: "No matching payment found" });
    }

    const payment = rows[0];
    const { amount, driver_id, user_id } = payment;

    let admin_commission = 0;
    let driver_earning = 0;

    if (statusValue === 1) {
      const commissionRate = 0.1; // 10%
      admin_commission = parseFloat(amount) * commissionRate;
      driver_earning = parseFloat(amount) - admin_commission;

      await connection.execute(
        `UPDATE ride_payments 
         SET payment_status = ?, admin_commission = ?, driver_earning = ?, transaction_id = ?, payment_time = ?
         WHERE transaction_id = ?`,
        [1, admin_commission, driver_earning, data.cf_payment_id || data.order_id, new Date(), data.order_id]
      );

      // Wallets update
      await connection.execute(`UPDATE admins SET wallet = wallet + ? WHERE id = 1`, [admin_commission]);
      await connection.execute(`UPDATE users SET wallet = wallet + ? WHERE id = ?`, [driver_earning, driver_id]);

      // ✅ Transactions
      await connection.execute(
        `INSERT INTO transactions (user_id, type, amount, purpose, role)
         VALUES (?, 2, ?, 'Ride booking online payment', 'user')`,
        [user_id, amount]
      );

      await connection.execute(
        `INSERT INTO transactions (user_id, type, amount, purpose, role)
         VALUES (?, 1, ?, 'Online ride commission', 'admin')`,
        [1, admin_commission]
      );

      await connection.execute(
        `INSERT INTO transactions (user_id, type, amount, purpose, role)
         VALUES (?, 1, ?, 'Ride earning from online payment', 'driver')`,
        [driver_id, driver_earning]
      );

    } else {
      await connection.execute(
        `UPDATE ride_payments 
         SET payment_status = ?, transaction_id = ?, payment_time = ?
         WHERE transaction_id = ?`,
        [0, data.cf_payment_id || data.order_id, new Date(), data.order_id]
      );
    }

    return res.json({ status: "success" });

  } catch (error) {
    console.error("Error in ridePaymentCallback:", error.message);
    return res.json({ status: "error", message: error.message });
  }
};


// ====================== RECORD RIDE PAYMENTS (CASH/ONLINE MANUAL) ======================
exports.recordRidePayments = async (req, res) => {
  try {
    const {
      ride_id,
      user_id,
      driver_id,
      amount,
      payment_mode,     // 0 = cash, 1 = online
      payment_status,   // 0 = pending, 1 = completed
      transaction_id,
      status
    } = req.body;

    if (!ride_id || !user_id || !driver_id || !amount || payment_mode === undefined || payment_status === undefined || status === undefined) {
      return res.status(200).json({
        status: 400,
        message: "All fields required: ride_id, user_id, driver_id, amount, payment_mode, payment_status, status"
      });
    }

    // 🔹 Commission settings
    const [[setting]] = await connection.execute(`SELECT percentage FROM commission_settings LIMIT 1`);
    const commissionPercent = setting?.percentage ?? 10;
    const admin_commission = parseFloat(((commissionPercent / 100) * amount).toFixed(2));
    const driver_earning = parseFloat((amount - admin_commission).toFixed(2));

    if (payment_mode === 0) {
      // ✅ Cash → always insert new row
      await connection.execute(`
        INSERT INTO ride_payments 
          (ride_id, user_id, driver_id, amount, payment_mode, admin_commission, driver_earning, transaction_id, payment_status, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        ride_id, user_id, driver_id, amount, payment_mode,
        admin_commission, driver_earning,
        transaction_id || `CASH${Date.now()}`,
        payment_status, status
      ]);
    } else {
      // ✅ Online → update only
      const [result] = await connection.execute(`
        UPDATE ride_payments
        SET payment_status = ?, status = ?, admin_commission = ?, driver_earning = ?, amount = ?
        WHERE transaction_id = ? `, [
        payment_status, status, admin_commission, driver_earning, amount,
        transaction_id
      ]);

      if (result.affectedRows === 0) {
        return res.status(200).json({
          status: 404,
          message: "No matching online payment record found to update"
        });
      }
    }

    // 🔹 If payment completed → update wallets, transactions & bookings
    if (payment_status === 1) {
      // ✅ Ride booking ka pay_status update
      await connection.execute(
  `UPDATE ride_bookings 
   SET pay_status = 1 
   WHERE ride_id = ? AND user_id = ? AND status = ?`,
  [ride_id, user_id, 4]
);

      if (payment_mode === 1) {
         // ✅ Online
        await connection.execute(`UPDATE admins SET wallet = wallet + ? WHERE id = 1`, [admin_commission]);
        await connection.execute(`UPDATE users SET wallet = wallet + ? WHERE id = ?`, [driver_earning, driver_id]);

        // 🔹 User debit (full payment)
        await connection.execute(
          `INSERT INTO transactions (user_id, driver_id, ride_id, type, amount, purpose, role)
           VALUES (?, ?, ?, 2, ?, 'Ride booking online payment', 'user')`,
          [user_id, driver_id, ride_id, amount]
        );

        // 🔹 Admin commission (linked with driver)
        await connection.execute(
          `INSERT INTO transactions (user_id, driver_id, ride_id, type, amount, purpose, role)
           VALUES (1, ?, ?, 1, ?, 'Commission received from driver (online)', 'admin')`,
          [driver_id, ride_id, admin_commission]
        );

        // 🔹 Driver earning (after commission)
        await connection.execute(
          `INSERT INTO transactions (user_id, ride_id, type, amount, purpose, role)
           VALUES (?, ?, 1, ?, 'Driver earning from online payment', 'driver')`,
          [driver_id, ride_id, driver_earning]
        );
      } else {
         // ✅ Cash
        await connection.execute(`UPDATE admins SET wallet = wallet + ? WHERE id = 1`, [admin_commission]);
        await connection.execute(`UPDATE users SET admin_dues = admin_dues + ? WHERE id = ?`, [admin_commission, driver_id]);

        // 🔹 User debit (full payment)
        await connection.execute(
          `INSERT INTO transactions (user_id, driver_id, ride_id, type, amount, purpose, role)
           VALUES (?, ?, ?, 2, ?, 'Ride booking cash payment', 'user')`,
          [user_id, driver_id, ride_id, amount]
        );

        // 🔹 Admin commission (linked with driver)
        await connection.execute(
          `INSERT INTO transactions (user_id, driver_id, ride_id, type, amount, purpose, role)
           VALUES (1, ?, ?, 1, ?, 'Commission deducted from driver (cash)', 'admin')`,
          [driver_id, ride_id, admin_commission]
        );

        // 🔹 Driver earning (after commission, cash)
        await connection.execute(
          `INSERT INTO transactions (user_id, ride_id, type, amount, purpose, role)
           VALUES (?, ?, 1, ?, 'Driver earning via cash', 'driver')`,
          [driver_id, ride_id, driver_earning]
        );
      }
    }

    // 🔔 Send notification
    if (payment_status === 1) {
      if (payment_mode === 1) {
        // ✅ Online → driver ko notify
        const [[driver]] = await connection.execute(
          `SELECT fcm_token FROM users WHERE id = ?`,
          [driver_id]
        );
        if (driver?.fcm_token) {
          const title = "Payment Received";
          const message = `You received ₹${driver_earning} from online payment for ride `;
		const role = "2";
          await sendNotification(driver.fcm_token, title, message,role);
        }
      } else {
        // ✅ Cash → user ko notify
        const [[user]] = await connection.execute(
          `SELECT fcm_token FROM users WHERE id = ?`,
          [user_id]
        );
        if (user?.fcm_token) {
          const title = "Payment Confirmed";
          const message = `Your cash payment of ₹${amount} for ride  is recorded.`;
			const role = "1";
          await sendNotification(user.fcm_token, title, message,role);
        }
      }
    }

    return res.status(200).json({
      status: 200,
      message: payment_mode === 0 ? "Your payment is being processed successfully!" : "Your payment is being processed successfully!",
      data: { admin_commission, driver_earning }
    });

  } catch (err) {
    console.error("recordRidePayment error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};


exports.getUserPaymentHistory = async (req, res) => {
  try {
    const { user_id, type } = req.body; // user_id = user ka ya driver ka id

    if (!user_id || !type) {
      return res.status(200).json({
        status: 400,
        message: "user_id and type are required"
      });
    }

    let condition = "";
    if (type == 1) {
      // User → online payments only
      condition = "rp.user_id = ? AND rp.payment_mode = 1";
    } else if (type == 2) {
      // Driver → cash payments only
      condition = "rp.driver_id = ? AND rp.payment_mode = 0";
    } else {
      return res.status(200).json({
        status: 400,
        message: "Invalid type. Use 1 for user, 2 for driver"
      });
    }

    const [rows] = await connection.execute(
      `
      SELECT
          rp.id AS payment_id,
          rp.ride_id,
          rp.user_id,
          rp.driver_id,
          rp.amount,
          rp.payment_mode, -- 0 = cash, 1 = online
          rp.admin_commission,
          rp.driver_earning,
          rp.transaction_id,
          rp.payment_status, -- 0 = pending, 1 = success, 2 = failed
          rp.status AS payment_record_status,
          rp.created_at AS payment_created_at,

          rb.id AS booking_id,
          rb.seats_booked,
          rb.fare AS fare_per_seat,
          rb.from_stop_id,
          rb.to_stop_id,
          rb.pickup_time,
          rb.drop_time,
          rb.status AS booking_status,

          CASE 
              WHEN rb.from_stop_id IS NOT NULL THEN rs_from.full_address
              ELSE r.start_address
          END AS pickup_address,

          CASE 
              WHEN rb.to_stop_id IS NOT NULL THEN rs_to.full_address
              ELSE r.end_address
          END AS drop_address,

          r.start_address,
          r.end_address,
          r.ride_date,
          r.ride_start_time,
          r.ride_end_time,
          r.total_seats,
          r.available_seats,
          r.vehicle_id,
          r.status AS ride_status,

          usr.id AS user_user_id,
          usr.name AS user_name,
          usr.phone AS user_mobile,

          drv.id AS driver_user_id,
          drv.name AS driver_name,
          drv.phone AS driver_mobile

      FROM ride_payments rp
      INNER JOIN ride_bookings rb 
          ON rp.ride_id = rb.ride_id AND rp.user_id = rb.user_id
      INNER JOIN rides r 
          ON rp.ride_id = r.id
      LEFT JOIN ride_stops rs_from 
          ON rb.from_stop_id = rs_from.id
      LEFT JOIN ride_stops rs_to 
          ON rb.to_stop_id = rs_to.id
      LEFT JOIN users drv 
          ON rp.driver_id = drv.id
      LEFT JOIN users usr 
          ON rp.user_id = usr.id
      WHERE ${condition}
      ORDER BY rp.created_at DESC
      `,
      [user_id]
    );

    return res.status(200).json({
      status: 200,
      message: type == 1 ? "User online payment history fetched successfully" : "Driver cash payment history fetched successfully",
      data: rows
    });

  } catch (err) {
    console.error("getUserPaymentHistory error:", err);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

exports.getDriverTransactionHistory = async (req, res) => {
  try {
    const { driver_id } = req.body;

    if (!driver_id) {
      return res.status(200).json({
        status: 400,
        message: "driver_id is required"
      });
    }

    // 🔹 Fetch transactions grouped by ride
    const [rows] = await connection.execute(`
      SELECT 
        rp.ride_id,
        rp.user_id,
        u.name AS user_name,
        rp.amount AS user_paid,
        rp.admin_commission,
        rp.driver_earning,
        rp.payment_mode,
        rp.payment_status,
        rp.created_at
      FROM ride_payments rp
      JOIN users u ON u.id = rp.user_id
      WHERE rp.driver_id = ? AND rp.payment_status = 1
      ORDER BY rp.created_at DESC
    `, [driver_id]);

    return res.status(200).json({
      status: 200,
      message: "Driver transaction history fetched",
      data: rows
    });

  } catch (err) {
    console.error("getDriverTransactionHistory error:", err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};













