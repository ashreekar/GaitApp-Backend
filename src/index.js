import { app } from "./app.js";
import dotenv from 'dotenv';
import { connectDB } from "./db/index.js";

// configured dotenv taht runs before script
dotenv.config({
    path: "./env"
})

//  Imported express app runs after database is connected
connectDB()
    .then(() => {
        // started a sever and listning on PORT from env
        app.listen(process.env.PORT || 3000, () => {
            console.log(`🌐 Server started on http://localhost:${process.env.PORT}`);
            console.log(`⚡ Listening on port ${process.env.PORT}...`);
            console.log("✅ Ready to accept requests!");
        })
    }).catch((error) => {
        console.log("❌ Database connection failed: \"db/index.js\" \n", err);
    })