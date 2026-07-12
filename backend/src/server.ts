import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
  ✅ AgroLact API corriendo
  📡 Puerto: ${PORT}
  🌍 Entorno: ${process.env.NODE_ENV || 'development'}
  🕐 ${new Date().toLocaleString('es-CO')}
  `);
});
