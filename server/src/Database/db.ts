import mongoose from "mongoose";
import { databaseUrl } from "../config/envConfig";
import dns from "dns";

if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
    dns.setDefaultResultOrder("ipv4first");
  } catch (err) {
    console.warn(
      "Could not set custom DNS configurations, using system default.",
      err
    );
  }
}


export const connectDatabase = async () => {
  try {

    /* Database connection */
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );

    console.log(
      "Mongodb server connected: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Error while connecting to the database: ", error);
    process.exit(1);
  }
};
