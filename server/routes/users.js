const express = require("express");

const router = express.Router();
const connection = require("../db");
const { checkAuth } = require("../middlewares/checkAuth");

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

router.post("/info", checkAuth, async (req, res) => {
  try {
    const userId = req.user.uid;

    const result = await queryAsync(
      `SELECT * 
      FROM users u 
      JOIN electric_vehicles v ON u.vid=v.id 
      JOIN vehicle_ports p ON v.id = p.vid
      WHERE u.uid = ?`,
      [userId]
    );

    if (result.length > 1) {
      const ports = result.map((d) => d.port);
      const portString = ports.join(",");
      result[0].port = portString;
      res.json(result[0]);
    } else if (result.length === 1) {
      res.json(result[0]);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/updateInfo/:vid", checkAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { vid } = req.params;

    const result = await queryAsync("SELECT * FROM users WHERE uid = ?", [
      userId,
    ]);

    if (result.length > 0) {
      // User ID exists, update the row
      await connection.query("UPDATE users SET vid = ? WHERE uid = ?", [
        vid,
        userId,
      ]);
      res.json({
        status: "updated",
        message: "User info updated successfully.",
      });
    } else {
      // User ID does not exist, insert a new row
      await connection.query("INSERT INTO users (uid, vid) VALUES (?, ?)", [
        userId,
        vid,
      ]);
      res.json({
        status: "inserted",
        message: "User info inserted successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
