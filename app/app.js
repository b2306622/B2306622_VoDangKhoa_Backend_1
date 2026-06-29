const express = require("express");
const cors = require("cors");

const ApiError = require("./api-error");
const contactsRouter = require("./routes/contact.route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trang chủ
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to contact book application.",
    });
});

// Contacts API
app.use("/api/contacts", contactsRouter);

// ============================
// 404 - Route không tồn tại
// ============================
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// ============================
// Error Handler
// ============================
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;