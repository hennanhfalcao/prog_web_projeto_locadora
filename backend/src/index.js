require("dotenv/config");
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const usuarioRouter = require("./routes/usuarioRoutes");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

app.use("/", authRouter);
app.use("/usuarios", usuarioRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});
