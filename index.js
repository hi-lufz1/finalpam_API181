const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const anggotaRouter = require("./routes/anggota");
app.use("/api/anggota", anggotaRouter);

const proyekRouter = require("./routes/proyek");
app.use("/api/proyek", proyekRouter);

const timRouter = require("./routes/tim");
app.use("/api/tim", timRouter);

const tugasRouter = require("./routes/tugas");
app.use("/api/tugas", tugasRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
