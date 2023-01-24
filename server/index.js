import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

// So we can access dotenv variables
dotenv.config();

const app = express();
/**
 * Cross-origin resource sharing (CORS)
 * is a mechanism that allows restricted resources
 * on a web page to be requested from another
 * domain outside the domain from which the first resource was served.
 */
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

// Verify that our application is working
app.get("/", async (req, res) => {
    res.send("Hello from DALL-E!");
});

// Start server and connect to MongoDB Atlas Cluster
const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => {
            console.log("Server has started on port http://localhost:8080");
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();
