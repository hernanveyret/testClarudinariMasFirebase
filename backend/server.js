import express from 'express';
import cors from 'cors';
import cloudinary from './cloudinary.js';

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para eliminar imagen
app.delete('/api/eliminar-imagen', async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'Falta el public_id' });
  }

  try {
    const resultado = await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, resultado });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Puerto del backend
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor backend corriendo en puerto ${PORT}`));
