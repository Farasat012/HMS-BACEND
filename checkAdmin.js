const mongoose = require("mongoose");
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

async function checkAdmin() {
    try {
        const admin = await User.findOne({ email: "admin@hospital.com" });
        
        if (admin) {
            console.log("✅ Admin user found!");
            console.log("Email:", admin.email);
            console.log("Username:", admin.username);
            console.log("User Type:", admin.userType);
            console.log("Activated:", admin.activated);
            console.log("\nLogin credentials:");
            console.log("Email: admin@hospital.com");
            console.log("Password: admin123");
        } else {
            console.log("❌ Admin user not found!");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

checkAdmin();
