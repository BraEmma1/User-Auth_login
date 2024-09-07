import mongoose from "mongoose";
import "dotenv/config"


export const connectDB = async () => {
   try {
     await mongoose.connect(process.env.MONGO_URI)
     console.log("Database connected successfully")
   } catch (error) {
    
     console.log("Error:connection to database failed", error.message)
     process.exit(1)  
   }
} 