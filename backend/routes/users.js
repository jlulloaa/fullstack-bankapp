const express = require('express');
const authenticate = require('../authenticate/authenticate');
const firebaseAdmin = require('../server');

// const usrAuth = require('../controllers/users')
const usrRouters = express.Router();

usrRouters.get("/api/user", authenticate, async (req, res) => {
  res.status(200).json(req.user);
});

usrRouters.post('/api/user', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({
      error:
        "Invalid request body. Must contain email, password, and name for user."
    });
  }

  try {
    const newFirebaseUser = await firebaseAdmin.auth.createUser({
      email,
      password
    });

    if (newFirebaseUser) {
      const userCollection = req.app.locals.db.collection("user");
      await userCollection.insertOne({
        email,
        name,
        firebaseId: newFirebaseUser.uid
      });
    }
    return res
      .status(200)
      .json({ success: "Account created successfully. Please sign in." });
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ error: "User account already exists at email address." });
    }
    return res.status(500).json({ error: "Server error. Please try again" });
  }
});

module.exports = usrRouters;