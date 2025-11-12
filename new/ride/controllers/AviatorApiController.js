const connection = require("../config/db");





exports.aviatorBetNew = async (req, res) => {
  const { uid, number, amount, game_id, game_sr_num } = req.body || {};
  const stop_multiplier = req.body?.stop_multiplier || 0;
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  console.log("Request body:", req.body);

  // Validation
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(200).json({ status: 400, message: 'Request body is empty.' });
  }
  if (!uid) return res.status(200).json({ status: 400, message: 'uid is required.' });
  if (!number) return res.status(200).json({ status: 400, message: 'number is required.' });
  if (!amount) return res.status(200).json({ status: 400, message: 'amount is required.' });
  if (!game_id) return res.status(200).json({ status: 400, message: 'game_id is required.' });
  if (!game_sr_num) return res.status(200).json({ status: 400, message: 'game_sr_num is required.' });
  if (parseInt(game_id) !== 5) {
    return res.status(200).json({ status: 400, message: 'Invalid game_id' });
  }

  try {
    // Check if bet already exists
    const [existingBet] = await connection.query(
      'SELECT * FROM aviator_bet WHERE uid = ? AND game_id = 5 AND number = ? AND game_sr_num = ? AND status = 0',
      [uid, number, game_sr_num]
    );
    if (existingBet.length > 0) {
      return res.status(200).json({ status: 400, message: 'Already bet created!' });
    }

    // Fetch user
    const [userRows] = await connection.query(
      'SELECT * FROM users WHERE id = ?',
      [uid]
    );
    if (userRows.length === 0) {
      return res.status(200).json({ status: 404, message: 'User not found' });
    }
    const user = userRows[0];

    const deposit_wallet = parseFloat(user.deposit_wallet);
    const winning_wallet = parseFloat(user.winning_wallet);
    const total_wallet = parseFloat(user.wallet);

    if (total_wallet < amount) {
      return res.status(200).json({ status: 400, message: 'Insufficient funds!' });
    }

    let deduct_from_deposit = 0;
    let deduct_from_winning = 0;

    if (deposit_wallet >= amount) {
      deduct_from_deposit = amount;
    } else {
      deduct_from_deposit = deposit_wallet;
      deduct_from_winning = amount - deposit_wallet;
    }

    const newDepositWallet = deposit_wallet - deduct_from_deposit;
    const newWinningWallet = winning_wallet - deduct_from_winning;
    const newWallet = total_wallet - amount;

    // Update user wallet (no today_turnover update here)
    await connection.query(
      'UPDATE users SET deposit_wallet = ?, winning_wallet = ?, wallet = ? WHERE id = ?',
      [newDepositWallet, newWinningWallet, newWallet, uid]
    );

    console.log("User wallet updated:", { newDepositWallet, newWinningWallet, newWallet });

    // Get admin settings (commission percentage)
    const [settingsRows] = await connection.query(
      'SELECT * FROM admin_settings WHERE id = 10'
    );

    const percentage_bet = parseFloat(settingsRows[0]?.longtext || 0);
    const commission = amount * percentage_bet;
    const totalAmount = amount - commission;

    // Insert bet
    await connection.query(
      `INSERT INTO aviator_bet 
        (uid, amount, number, game_id, totalamount, color, game_sr_num, commission, status, stop_multiplier, datetime, created_at)
       VALUES (?, ?, ?, ?, ?, 'Aviator', ?, ?, 0, ?, ?, ?)`,
      [uid, amount, number, game_id, totalAmount, game_sr_num, commission, stop_multiplier, datetime, datetime]
    );

    console.log("Bet placed successfully");

    return res.status(200).json({ status: 200, message: 'Bet placed successfully.' });

  } catch (error) {
    console.error("aviatorBetNew Error:", error);
    return res.status(200).json({ status: 500, message: 'Internal Server Error' });
  }
};




exports.aviatorHistory = async (req, res) => {
  try {
    // Get the parameters from the query string (for GET request)
    const { uid, game_id, limit = 10000, offset = 0, created_at } = req.query;

    // Validation
    if (!uid) {
      return res.status(200).json({ status: 400, message: "uid is required" });
    }

    if (!game_id) {
      return res.status(200).json({ status: 400, message: "game_id is required" });
    }

    // WHERE conditions for the SQL query
    let whereClauses = [];
    whereClauses.push(`aviator_bet.uid = '${uid}'`);
    whereClauses.push(`aviator_bet.game_id = '${game_id}'`);

    if (created_at) {
      whereClauses.push(`aviator_bet.created_at LIKE '${created_at}%'`);
    }

    // Build SQL query
    let query = `
      SELECT aviator_bet.*, 
             aviator_bet.win AS cashout_amount,
             aviator_bet.multiplier AS multiplier,
             aviator_result.price AS crash_point 
      FROM aviator_bet 
      LEFT JOIN aviator_result 
        ON aviator_bet.game_sr_num = aviator_result.game_sr_num
    `;

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += ` ORDER BY aviator_bet.id DESC LIMIT ${offset}, ${limit}`;

    // Execute the query
    const [results] = await connection.query(query);

    if (results.length > 0) {
      return res.status(200).json({
        status: 200,
        message: "Data found",
        data: results
      });
    } else {
      return res.status(200).json({
        status: 400,
        message: "No Data found",
        data: []
      });
    }

  } catch (error) {
    console.error("aviatorHistory Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      error: error.message
    });
  }
};


exports.betCancel = async (req, res) => {
  try {
    const { userid, number, gamesno } = req.query || {};

    // One-by-one validation
    if (!userid) {
      return res.status(200).json({ status: 400, message: 'userid is required.' });
    }
    if (!number) {
      return res.status(200).json({ status: 400, message: 'number is required.' });
    }
    if (!gamesno) {
      return res.status(200).json({ status: 400, message: 'gamesno is required.' });
    }

    // Fetch the user bet data
    const [userBetData] = await connection.query(
      'SELECT amount FROM aviator_bet WHERE uid = ? AND number = ? AND status = 0 AND game_sr_num = ?',
      [userid, number, gamesno]
    );

    if (userBetData.length === 0) {
      return res.status(200).json({ status: 400, message: 'Bet not found or already processed' });
    }

    const betAmount = userBetData[0].amount;

    // Update user wallet (winning_wallet and wallet)
    const [userUpdateResult] = await connection.query(
      'UPDATE users SET deposit_wallet = deposit_wallet + ?, wallet = wallet + ? WHERE id = ?',
      [betAmount, betAmount, userid]
    );

    if (userUpdateResult.affectedRows === 0) {
      return res.status(500).json({ status: 500, message: 'Failed to update user wallet' });
    }

    // Delete the bet
    const [betDeleteResult] = await connection.query(
      'DELETE FROM aviator_bet WHERE uid = ? AND number = ? AND status = 0 AND game_sr_num = ?',
      [userid, number, gamesno]
    );

    if (betDeleteResult.affectedRows > 0) {
      return res.status(200).json({ message: 'Bet Cancelled Successfully', status: 200 });
    } else {
      return res.status(200).json({ message: 'Unable to cancel bet', status: 400 });
    }

  } catch (error) {
    console.error("betCancel Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      error: error.message
    });
  }
};



exports.lastFiveResult = async (req, res) => {
  try {
    // Fetch the last 10 results from aviator_result table
    const [results] = await connection.query(
      'SELECT price FROM aviator_result WHERE status = 1 ORDER BY id DESC LIMIT 25'
    );

    if (results.length > 0) {
      return res.status(200).json({
        status: "200",
        message: 'success',
        data: results,
      });
    } else {
      return res.status(400).json({
        status: "400",
        message: 'Data Not Found',
      });
    }
  } catch (error) {
    console.error("lastFiveResult Error:", error);
    return res.status(500).json({
      status: "500",
      message: "Server Error",
      error: error.message,
    });
  }
};


exports.halfResult = async (req, res) => {
  try {
    // Query for total amount, total users, etc.
    const query = `
      SELECT 
        COALESCE(SUM(amount), 0) AS totalamount, 
        COALESCE(COUNT(uid), 0) AS totalusers, 
        COALESCE(amount, 0) AS highestamount, 
        (SELECT COALESCE(MAX(game_sr_num), 0) + 1 FROM aviator_result) AS game_sr, 
        (SELECT COALESCE(
          (SELECT COALESCE(multiplier, 0) 
           FROM aviator_admin_result 
           WHERE game_sr_num = (SELECT COALESCE(MAX(game_sr_num), 0) + 1 FROM aviator_result) 
           AND game_id = '5'
           LIMIT 1
          ), 0 )) AS adminmultiply, 
        (SELECT winning_percentage 
         FROM game_settings 
         WHERE id = 5) AS adminpercent
      FROM aviator_bet 
      WHERE game_id = '5' 
      AND game_sr_num = (SELECT COALESCE(MAX(game_sr_num), 0) + 1 FROM aviator_result)
      ORDER BY amount DESC 
      LIMIT 1
    `;

    const [results] = await connection.query(query); // Await the result

    if (results.length > 0) {
      const resData = results[0];
      const game_sr = resData.game_sr;

      // Query to get multiplier from admin result
      const multiplierQuery = `SELECT number FROM aviator_admin_result WHERE game_sr_num = '${game_sr}' LIMIT 1`;
      const [multiplierResults] = await connection.query(multiplierQuery); // Await the result
      let multiplier = 0;
      if (multiplierResults.length > 0) {
        multiplier = multiplierResults[0].number;
      }

      // Query to get total win for the game session
      const totalWinQuery = `SELECT COALESCE(SUM(win), 0) AS total_win FROM aviator_bet WHERE game_sr_num = '${game_sr}' AND game_id = '5'`;
      const [winResults] = await connection.query(totalWinQuery); // Await the result

      const totalWin = winResults[0].total_win;

      // Fetch game settings
      const gameSettingsQuery = 'SELECT * FROM aviator_setting WHERE id = 1';
      const [settingsResults] = await connection.query(gameSettingsQuery); // Await the result

      const aviatorSetting = settingsResults[0] || {};
      const response = {
        message: 'Data fetched successfully',
        status: 200,
        totalamount: parseInt(resData.totalamount),
        totalusers: parseInt(resData.totalusers),
        game_sr: parseInt(game_sr),
        highestamount: parseInt(resData.highestamount),
        adminmultiply: multiplier,
        adminpercent: aviatorSetting.win_per || 0,
        loss_per: aviatorSetting.loss_per || 0,
        min_amount: aviatorSetting.amount || 0,
        total_win: totalWin,
      };

      // Send the response as JSON
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ message: 'Data not found', status: 400 });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(400).json({ message: 'Error occurred', status: 400 });
  }
};



exports.resultInsert = async (req, res) => {
  try {
    const datetime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).replace(',', '');
    const currentDateTime = new Date(datetime).toISOString().slice(0, 19).replace('T', ' ');
console.log("dfghjhgfdfgh");
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed', status: 405 });
    }
console.log(req.body)
    const { adminmultiply, game_sr } = req.body || {};

    // One by one parameter validation
    if (adminmultiply === undefined || adminmultiply === null || adminmultiply === '') {
      return res.status(400).json({ message: 'adminmultiply is required', status: 400 });
    }
    if (game_sr === undefined || game_sr === null || game_sr === '') {
      return res.status(400).json({ message: 'game_sr is required', status: 400 });
    }

    // --- baaki ka logic same as before ---
    
    const [existingResult] = await connection.query(
      'SELECT * FROM aviator_result WHERE game_sr_num = ?',
      [game_sr]
    );

    if (existingResult.length > 0) {
      return res.status(400).json({ message: 'Game Sr No. Already Exist', status: 400 });
    }

    const [insertResult] = await connection.query(
      `INSERT INTO aviator_result (color, game_sr_num, game_id, price, status, datetime)
       VALUES ('Aviator', ?, 5, ?, 1, ?)`,
      [game_sr, adminmultiply, currentDateTime]
    );

    if (insertResult.affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to insert result!', status: 400 });
    }

    const [bets] = await connection.query(
      `SELECT * FROM aviator_bet
       WHERE game_sr_num = ? AND game_id = 5 AND status = 0 AND win = 0 AND result_status = 0`,
      [game_sr]
    );

    if (bets.length === 0) {
      return res.status(200).json({ message: 'Result declared, no user bets found.', status: 200 });
    }

    for (let bet of bets) {
      const { id, uid, stop_multiplier, totalamount } = bet;

      if (stop_multiplier !== 0 && stop_multiplier <= adminmultiply) {
        const win_amount = totalamount * stop_multiplier;

        await connection.query(
          `UPDATE aviator_bet SET status = 1, result_status = 1, win = ? WHERE id = ?`,
          [win_amount, id]
        );

        await connection.query(
          `INSERT INTO wallet_history (userid, amount, subtypeid) VALUES (?, ?, 24)`,
          [uid, win_amount]
        );

        const [userRows] = await connection.query(`SELECT wallet, winning_wallet FROM users WHERE id = ?`, [uid]);
        const user = userRows[0];

        const updatedWallet = user.wallet + win_amount;
        const updatedWinningWallet = user.winning_wallet + win_amount;

        await connection.query(
          `UPDATE users SET wallet = ?, winning_wallet = ? WHERE id = ?`,
          [updatedWallet, updatedWinningWallet, uid]
        );

      } else {
        await connection.query(
          `UPDATE aviator_bet SET status = 2, result_status = 1 WHERE id = ? AND game_sr_num = ?`,
          [id, game_sr]
        );
      }
    }

    return res.status(200).json({ message: 'Result declared, user bet history updated.', status: 200 });

  } catch (error) {
    console.error('resultInsert Error:', error);
    return res.status(500).json({ message: 'Server Error', status: 500, error: error.message });
  }
};










exports.aviatorCashout = async (req, res) => {
  try {
    console.log("Request Query:", req.query);

    if (!req.query || !req.query.salt) {
      return res.status(400).json({ status: 400, message: "Missing required 'salt' parameter" });
    }

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(req.query.salt, 'base64').toString('utf-8'));
    } catch (err) {
      console.error("Salt Decode Error:", err);
      return res.status(400).json({ status: 400, message: "Invalid salt format" });
    }

    const uid = decoded.uid;
    const multiplier = parseFloat(decoded.multiplier);
    const game_sr_num = decoded.game_sr_num;
    const number = decoded.number;

    if (!uid || isNaN(multiplier) || !game_sr_num || !number) {
      return res.status(400).json({ status: 400, message: "Missing or invalid required fields" });
    }

    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Fetch bet details
    const [betDetailsRows] = await connection.query(
      `SELECT * FROM aviator_bet 
       WHERE game_sr_num = ? AND game_id = 5 AND uid = ? AND number = ? 
       AND status = 0 AND result_status = 0`,
      [game_sr_num, uid, number]
    );

    if (!betDetailsRows.length) {
      return res.status(400).json({ status: 400, message: "Already cashout or invalid bet!" });
    }

    const bet = betDetailsRows[0];
    const amount_trade = parseFloat(bet.totalamount);
    const win_amount = amount_trade * multiplier;

    // Update aviator_bet
    const [updateBetResult] = await connection.query(
      `UPDATE aviator_bet 
       SET status = 1, result_status = 1, multiplier = ?, win = ? 
       WHERE uid = ? AND number = ? AND game_id = 5 
       AND game_sr_num = ? AND status = 0 AND result_status = 0`,
      [multiplier, win_amount, uid, number, game_sr_num]
    );

    if (updateBetResult.affectedRows === 0) {
      return res.status(400).json({ status: 400, message: "Failed to update bet" });
    }

    // Update user wallet
    const [userUpdateResult] = await connection.query(
      `UPDATE users 
       SET winning_wallet = winning_wallet + ?, wallet = wallet + ? 
       WHERE id = ?`,
      [win_amount, win_amount, uid]
    );

    if (userUpdateResult.affectedRows === 0) {
      return res.status(400).json({ status: 400, message: "Failed to update user wallet" });
    }

    // Insert into wallet_history
    const [walletHistoryResult] = await connection.query(
      `INSERT INTO wallet_history (userid, amount, subtypeid, created_at, updated_at) 
       VALUES (?, ?, 24, ?, ?)`,
      [uid, win_amount, datetime, datetime]
    );

    if (walletHistoryResult.affectedRows === 0) {
      return res.status(400).json({ status: 400, message: "Failed to insert wallet history" });
    }

    return res.status(200).json({
      status: 200,
      message: `${win_amount.toFixed(2)} Rs. Cashout Successfully`
    });

  } catch (error) {
    console.error("aviatorCashout Error:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};







