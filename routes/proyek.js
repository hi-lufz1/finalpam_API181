const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");

router.get("/", (req, res) => {
    connection.query(
        "SELECT * FROM proyek ORDER BY id_proyek DESC",
        (err, rows) => {
            if (!err) {
                 // Format tanggal dengan zona waktu lokal
                 const formattedRows = rows.map(row => ({
                    ...row,
                    tanggal_mulai: moment(row.tanggal_mulai).tz("Asia/Jakarta").format("YYYY-MM-DD"),
                    tanggal_berakhir: moment(row.tanggal_berakhir).tz("Asia/Jakarta").format("YYYY-MM-DD")
                }));
                return res.status(200).json({
                    status: true,
                    message: "Success",
                    data: formattedRows
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error"
                });
            }
        }
    );
});

// Create a new project
router.post(
    "/store",
    [
        body("nama_proyek").notEmpty(),
        body("deskripsi_proyek").notEmpty(),
        body("tanggal_mulai").isDate(),
        body("tanggal_berakhir").isDate(),
        body("status_proyek").notEmpty(),
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
            nama_proyek: req.body.nama_proyek,
            deskripsi_proyek: req.body.deskripsi_proyek,
            tanggal_mulai: req.body.tanggal_mulai,
            tanggal_berakhir: req.body.tanggal_berakhir,
            status_proyek: req.body.status_proyek,
        };

        connection.query("INSERT INTO proyek SET ?", formData, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                    error: err,
                });
            } else {
                return res.status(201).json({
                    status: true,
                    message: "Proyek created",
                    data: formData,
                });
            }
        });
    }
);

// Get a single project by id_proyek
router.get("/:id_proyek", (req, res) => {
    const id_proyek = req.params.id_proyek;
    connection.query(
        "SELECT * FROM proyek WHERE id_proyek = ?",
        [id_proyek],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error"
                });
            } else {
                if (rows.length > 0) {
                    const row = rows[0];
                    const formattedRow = {
                        ...row,
                        tanggal_mulai: moment(row.tanggal_mulai).tz("Asia/Jakarta").format("YYYY-MM-DD"),
                        tanggal_berakhir: moment(row.tanggal_berakhir).tz("Asia/Jakarta").format("YYYY-MM-DD")
                    };
                    return res.status(200).json({
                        status: true,
                        message: "Success",
                        data: formattedRow
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "Proyek not found"
                    });
                }
            }
        }
    );
});

// Update a project
router.put(
    "/:id_proyek",
    [
        body("nama_proyek").notEmpty(),
        body("deskripsi_proyek").notEmpty(),
        body("tanggal_mulai").isDate(),
        body("tanggal_berakhir").isDate(),
        body("status_proyek").notEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }

        let id_proyek = req.params.id_proyek;
        let formData = {
            nama_proyek: req.body.nama_proyek,
            deskripsi_proyek: req.body.deskripsi_proyek,
            tanggal_mulai: req.body.tanggal_mulai,
            tanggal_berakhir: req.body.tanggal_berakhir,
            status_proyek: req.body.status_proyek,
        };

        connection.query(
            "UPDATE proyek SET ? WHERE id_proyek = ?",
            [formData, id_proyek],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Internal Server Error",
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Proyek updated",
                        data: formData,
                    });
                }
            }
        );
    }
);

// Delete a project
router.delete("/:id_proyek", (req, res) => {
    let id_proyek = req.params.id_proyek;
    connection.query(
        "DELETE FROM proyek WHERE id_proyek = ?",
        id_proyek,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Proyek deleted",
                });
            }
        }
    );
});

module.exports = router;
