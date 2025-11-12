const { render } = require("ejs");
const connection = require("../config/db");
const session = require('express-session');


exports.login = async (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  try {
    // Fetch admin settings
    const [rows] = await connection.query(
      "SELECT site_name, site_logo FROM admin_settings LIMIT 1"
    );
    const adminSetting = rows.length ? rows[0] : { site_name: '', site_logo: '' };

    // Render login page
    res.render("partials/login", {
      error,
      site_name: adminSetting.site_name,
      site_logo: adminSetting.site_logo
    });
  } catch (err) {
    console.error("Error fetching admin settings:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.login_process = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.session.error = 'Email and Password are required';
    return res.redirect('/');
  }

  try {
    const [results] = await connection.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (results.length === 0 || results[0].password !== password) {
      req.session.error = 'Invalid email or password';
      return res.redirect('/');
    }

    const admin = results[0];
    req.session.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email
    };
    req.session.success = 'Login successful! Welcome, ' + admin.name;
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.session.error = 'Something went wrong. Please try again.';
    res.redirect('/');
  }
};




