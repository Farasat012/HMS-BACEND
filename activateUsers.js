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

async function activateAllUsers() {
    try {
        // Update all users to activated: true
        const result = await User.updateMany(
            { activated: false },
            { $set: { activated: true } }
        );
        
        console.log("✅ Activated all users!");
        console.log(`Updated ${result.modifiedCount} user(s)`);
        
        // Show all users
        const allUsers = await User.find({}, 'email username userType activated');
        console.log("\n📋 All users in database:");
        allUsers.forEach(user => {
            console.log(`  - ${user.email} (${user.userType}) - Activated: ${user.activated}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

activateAllUsers();
