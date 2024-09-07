import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.route.js";



const app = express();

// middlewares
app.use(express.json())

app.use("/api/auth", authRouter)










const PORT = process.env.PORT || 3000
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running on port, " + PORT + " ")
    })
})








// 5OsVXabVea560ke1