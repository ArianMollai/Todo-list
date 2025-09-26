import mongoose from "mongoose";
import app from "./app";
import { env } from "./config/env";



mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database...");
    app.listen(env.PORT, () => {
      console.log(`app listening on port ${env.PORT}...`);
    });
  })
  .catch((error: any) => {
    console.log(error);
  });
