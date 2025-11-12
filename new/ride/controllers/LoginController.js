const { render } = require("ejs");
const connection = require("../config/db");
const session = require('express-session');


exports.login = async (req, res) => {
  const error = req.session.error;
  delete req.session.error;
    console.log("mohan ji");
    console.log(error);
     res.render("partials/login", {error});
}

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




