import mongoose from 'mongoose';

// connecting to database function
const connectDB = async () => {
    try {
        // mogngodb url from .env file
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/gaitapp`);
        console.log(`🗄️  Database connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("❌ Database connection failed:", error);
        process.exit(1);
    }
}

export { connectDB };