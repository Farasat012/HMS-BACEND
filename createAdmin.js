const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true });

const UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    activated: Boolean,
    firstName: String,
    lastName: String,
    userType: String
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Create admin user
        const admin = await User.create({
            email: "admin@hospital.com",
            username: "admin",
            password: hashedPassword,
            firstName: "System",
            lastName: "Admin",
            userType: "Admin",
            activated: true
        });
        
        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@hospital.com");
        console.log("Username: admin");
        console.log("Password: admin123");
        console.log("\nYou can now login at http://localhost:3000/login");
        
        process.exit(0);
    } catch (error) {
        if (error.code === 11000) {
            console.log("⚠️  Admin user already exists!");
        } else {
            console.error("❌ Error creating admin:", error.message);
        }
        process.exit(1);
    }
}

createAdmin();
