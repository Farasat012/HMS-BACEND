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

async function resetPasswords() {
    try {
        // Hash the password ONCE
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Get all users
        const users = await User.find({});
        
        console.log("🔄 Resetting passwords for all users...\n");
        
        for (let user of users) {
            // Update password directly without triggering pre-save hook
            await User.updateOne(
                { _id: user._id },
                { $set: { password: hashedPassword, activated: true } }
            );
            console.log(`✅ ${user.email} (${user.userType}) - Password reset to: password123`);
        }
        
        console.log("\n✅ All passwords reset successfully!");
        console.log("\n📋 Login credentials:");
        console.log("Password for ALL accounts: password123");
        console.log("\nAccounts:");
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.userType})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

resetPasswords();
