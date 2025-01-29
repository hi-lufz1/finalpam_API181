const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Get all teams
router.get("/", (req, res) => {
    connection.query("SELECT * FROM tim ORDER BY id_tim DESC", (err, rows) => {
        if (!err) {
            return res.status(200).json({
                status: true,
                message: "Success",
                data: rows,
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        }
    });
});

// Create a new team
router.post(
    "/store",
    [
        body("nama_tim").notEmpty(),
        body("deskripsi_tim").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }

        let formData = {
            nama_tim: req.body.nama_tim,
            deskripsi_tim: req.body.deskripsi_tim,
        };

        connection.query("INSERT INTO tim SET ?", formData, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                    error: err,
                });
            } else {
                return res.status(201).json({
                    status: true,
                    message: "Team created",
                    data: formData,
                });
            }
        });
    }
);

// Get a single team by id_tim
router.get("/:id_tim", (req, res) => {
    let id_tim = req.params.id_tim;
    connection.query(
        "SELECT * FROM tim WHERE id_tim = ?",
        id_tim,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                });
            } else {
                if (rows.length > 0) {
                    return res.status(200).json({
                        status: true,
                        message: "Success",
                        data: rows[0],
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "Team not found",
                    });
                }
            }
        }
    );
});

// Update a team
router.put(
    "/:id_tim",
    [
        body("nama_tim").notEmpty(),
        body("deskripsi_tim").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }

        let id_tim = req.params.id_tim;
        let formData = {
            nama_tim: req.body.nama_tim,
            deskripsi_tim: req.body.deskripsi_tim,
        };

        connection.query(
            "UPDATE tim SET ? WHERE id_tim = ?",
            [formData, id_tim],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Internal Server Error",
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Team updated",
                        data: formData,
                    });
                }
            }
        );
    }
);

// Delete a team
router.delete("/:id_tim", (req, res) => {
    let id_tim = req.params.id_tim;
    connection.query(
        "DELETE FROM tim WHERE id_tim = ?",
        id_tim,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Team deleted",
                });
            }
        }
    );
});

module.exports = router;
