const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users") 
const authRoute = require("./routes/auth") 
const postRoute = require("./routes/posts") 

dotenv.config();

// Connect to MongoDB using async/await
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

// Call the function to connect to MongoDB 
connectDB();

// Middleware (helmet, morgan, etc.)
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


//creting a request response for users 
app.use("/api/users",userRoute)

app.use("/api/auth",authRoute)

app.use("/api/posts",postRoute)


// Server listening on port 8800
app.listen(8800, () => {
  console.log("Server is running on port 8800!");
});
