const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Get all members
router.get("/", (req, res) => {
    connection.query(`SELECT 
        a.id_anggota,
        a.id_tim,
        tm.nama_tim,
        a.nama_anggota,
        a.peran        
        FROM anggotatim a
        Left JOIN tim tm ON a.id_tim = tm.id_tim 
        ORDER BY a.id_anggota DESC`, (err, rows) => {
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

// Create a new member
router.post(
    "/store",
    [
        body("id_tim"),
        body("nama_anggota").notEmpty(),
        body("peran").notEmpty(),
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
            id_tim: req.body.id_tim == 0 ? null : req.body.id_tim,
            nama_anggota: req.body.nama_anggota,
            peran: req.body.peran,
        };

        connection.query("INSERT INTO anggotatim SET ?", formData, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                    error: err,
                });
            } else {
                return res.status(201).json({
                    status: true,
                    message: "Member created",
                    data: formData,
                });
            }
        });
    }
);

// Get a single member by id_anggota
router.get("/:id_anggota", (req, res) => {
    let id_anggota = req.params.id_anggota;
    connection.query(
        `SELECT 
        a.id_anggota,
        a.id_tim,
        tm.nama_tim,
        a.nama_anggota,
        a.peran        
        FROM anggotatim a
        left JOIN tim tm ON a.id_tim = tm.id_tim
        WHERE a.id_anggota = ?`,
        id_anggota,
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
                        message: "Member not found",
                    });
                }
            }
        }
    );
});

// Update a member
router.put(
    "/:id_anggota",
    [
        body("id_tim"),
        body("nama_anggota").notEmpty(),
        body("peran").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }

        let id_anggota = req.params.id_anggota;
        let formData = {
            id_tim: req.body.id_tim == 0 ? null : req.body.id_tim,
            nama_anggota: req.body.nama_anggota,
            peran: req.body.peran,
        };

        connection.query(
            "UPDATE anggotatim SET ? WHERE id_anggota = ?",
            [formData, id_anggota],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Internal Server Error",
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Member updated",
                        data: formData,
                    });
                }
            }
        );
    }
);

// Delete a member
router.delete("/:id_anggota", (req, res) => {
    let id_anggota = req.params.id_anggota;
    connection.query(
        "DELETE FROM anggotatim WHERE id_anggota = ?",
        id_anggota,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Member deleted",
                });
            }
        }
    );
});

// Hapus Anggota dari tim
router.put("/fromtim/:id_anggota", (req, res) => {
    let id_anggota = req.params.id_anggota;
    connection.query(
        "UPDATE anggotatim SET id_tim = null WHERE id_anggota = ?",
        id_anggota,
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
                        message: "Success Delete Anggota From Tim",
                        data: rows[0],
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "Member not found",
                    });
                }
            }
        }
    );
});

module.exports = router;
