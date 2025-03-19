require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const cors = require("cors");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Error al subir imagen" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀. Usa /upload para subir imágenes.");
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
