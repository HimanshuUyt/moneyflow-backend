const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const categoryRoutes = require('./src/routes/category');
const userRoutes = require('./src/routes/user');

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DB =================
mongoose.connect("mongodb+srv://moneyflow:moneyflow2004@moneyflow.alytj1f.mongodb.net/moneyflow")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= ROUTES =================
app.use('/api', categoryRoutes);
app.use('/api', userRoutes);

// TEST
app.get('/', (req, res) => {
  res.send('API Running 🚀');
});

// ================= START =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});