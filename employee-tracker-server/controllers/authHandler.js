const express = require("express");
const { login, logout } = require("../services/AuthHandler");

const router = express.Router({ strict: true });

router.post('/api/login', login);
router.get("/api/logout", logout);

module.exports = router