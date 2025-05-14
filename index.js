import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { handleErrors } from './utils/ErrorHandler.js';

// Routers
import schoolRouter from "./routes/school.routes.js";
import faqRouter from './routes/faq.routes.js';
import newsRouter from './routes/news.routes.js';
import eventRouter from "./routes/events.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";


dotenv.config();

// Connect to MongoDB
await mongoose
    .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    })
    .then(() => console.log(`Connected to MongoDB${process.env.MONGODB_URI}`))
    .catch((e) => console.error(e))
    .finally(() => console.log(`process.env.MONGODB_URI`));

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Required for cookies/auth
    exposedHeaders: ['set-cookie'] // Needed for cookie headers
}));
app.use(handleErrors);

app.set('view engine', 'ejs');
app.set('views', './views'); // Ensure you have a 'views' folder

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// API Routes
app.use("/api/schools", schoolRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/news", newsRouter);
app.use("/api/events", eventRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Global error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
}
);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));