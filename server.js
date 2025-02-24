const express = require("express");
const dotenv = require("dotenv");
const cors=require('cors');
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Import user routes
const parcelsRoutes = require("./routes/parcelRoutes");
const deliveryRoutes = require("./routes/deliveryPartnerRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/parcels", parcelsRoutes);
app.use("/api/delivery-partner", deliveryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
