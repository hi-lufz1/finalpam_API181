const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");

// GET: Retrieve all tasks
router.get("/", (req, res) => {
    connection.query(`SELECT
        t.id_tugas,
        t.id_proyek,
        p.nama_proyek,
        t.id_tim,
        tm.nama_tim,
        t.nama_tugas,
        t.deskripsi_tugas,
        t.prioritas,
        t.status_tugas
        FROM tugas t 
       JOIN proyek p ON t.id_proyek = p.id_proyek
       JOIN tim tm ON t.id_tim = tm.id_tim 
        ORDER BY t.id_tugas DESC`, (err, rows) => {
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

// GET: Retrieve all tasks by proyek
router.get("/proyek/:id_proyek", (req, res) => {
    let id_proyek = req.params.id_proyek;
    connection.query(`SELECT
        t.id_tugas,
        t.id_proyek,
        p.nama_proyek,
        t.id_tim,
        tm.nama_tim,
        t.nama_tugas,
        t.deskripsi_tugas,
        t.prioritas,
        t.status_tugas
        FROM tugas t 
        JOIN proyek p ON t.id_proyek = p.id_proyek
        JOIN tim tm ON t.id_tim = tm.id_tim 
        where t.id_proyek = ?
        ORDER BY t.id_tugas DESC`,
        id_proyek,
        (err, rows) => {
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

// POST: Create a new task
router.post(
    "/store",
    [
        body("id_proyek").notEmpty(),
        body("id_tim").notEmpty(),
        body("nama_tugas").notEmpty(),
        body("deskripsi_tugas").notEmpty(),
        body("prioritas").notEmpty(),
        body("status_tugas").notEmpty(),
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
            id_proyek: req.body.id_proyek,
            id_tim: req.body.id_tim,
            nama_tugas: req.body.nama_tugas,
            deskripsi_tugas: req.body.deskripsi_tugas,
            prioritas: req.body.prioritas,
            status_tugas: req.body.status_tugas,
        };
        connection.query("INSERT INTO tugas SET ?", formData, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                    error: err,
                });
            } else {
                return res.status(201).json({
                    status: true,
                    message: "Task created",
                    data: formData,
                });
            }
        });
    }
);

// GET: Retrieve a task by ID
router.get("/:id_tugas", (req, res) => {
    let id_tugas = req.params.id_tugas;
    connection.query(
        `SELECT
        t.id_tugas,
        t.id_proyek,
        p.nama_proyek,
        t.id_tim,
        tm.nama_tim,
        t.nama_tugas,
        t.deskripsi_tugas,
        t.prioritas,
        t.status_tugas
        FROM tugas t 
        JOIN proyek p ON t.id_proyek = p.id_proyek
        JOIN tim tm ON t.id_tim = tm.id_tim
        WHERE t.id_tugas = ?`,
        id_tugas,
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
                        message: "Task not found",
                    });
                }
            }
        }
    );
});

// PUT: Update a task by ID
router.put(
    "/:id_tugas",
    [
        body("id_proyek").notEmpty(),
        body("id_tim").notEmpty(),
        body("nama_tugas").notEmpty(),
        body("deskripsi_tugas").notEmpty(),
        body("prioritas").notEmpty(),
        body("status_tugas").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }
        let id_tugas = req.params.id_tugas;
        let formData = {
            id_proyek: req.body.id_proyek,
            id_tim: req.body.id_tim,
            nama_tugas: req.body.nama_tugas,
            deskripsi_tugas: req.body.deskripsi_tugas,
            prioritas: req.body.prioritas,
            status_tugas: req.body.status_tugas,
        };
        connection.query(
            "UPDATE tugas SET ? WHERE id_tugas = ?",
            [formData, id_tugas],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Internal Server Error",
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Task updated",
                        data: formData,
                    });
                }
            }
        );
    }
);

// DELETE: Delete a task by ID
router.delete("/:id_tugas", (req, res) => {
    let id_tugas = req.params.id_tugas;
    connection.query("DELETE FROM tugas WHERE id_tugas = ?", id_tugas, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Task deleted",
            });
        }
    });
});

module.exports = router;
