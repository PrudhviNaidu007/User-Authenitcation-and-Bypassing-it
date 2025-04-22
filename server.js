const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "supersecretkey",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // set to true only if using HTTPS
    })
);

// MongoDB User model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model("User", userSchema);

// Routes

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Missing username or password" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user.username;
            return res.status(200).json({ message: "Login successful", username: user.username });
        }

        res.status(401).json({ message: "Invalid credentials" });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Session check (used on dashboard.html)
app.get("/session-check", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ message: "Logged out successfully" });
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
