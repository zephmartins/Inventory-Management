import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoutes.js"
import contactRoute from "./routes/contactRoute.js";
import errorHandler from "./middleware/errormiddleware.js";
import cookieParser from "cookie-parser";
import path from "path"


const app = express();
const __dirname = path.resolve();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// app.use((req, res, next) => {
  // console.log("🔹 [Server] Request Headers:", req.headers);  // This is to debug if data is being sent in properly from the front end or postman

//   let data = [];
//   req.on("data", chunk => {
//     data.push(chunk);
//   });

//   req.on("end", () => {
//     console.log("🔹 [Server] Raw Body:", Buffer.concat(data).toString());
//   });

//   next();
// }); 

app.use("/uploads",express.static(path.join(__dirname, "uploads")))

//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute)


//Route
app.get("/", (req, res) => {
  res.send("Home Page");
});

//Error Handler Middleware
app.use(errorHandler);

//connect to DB and start server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is connected to mongodb`);
      console.log(`App is running on port 3000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
