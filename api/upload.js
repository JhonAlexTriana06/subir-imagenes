import { VercelRequest, VercelResponse } from '@vercel/node';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

// Configurar Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'subir-imagenes', // Nombre de la carpeta en Cloudinary
    format: async () => 'jpg', // Formato de imagen
    public_id: (req, file) => file.originalname
  }
});

const upload = multer({ storage });

export default function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('image')(req, res, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ url: req.file.path });
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}