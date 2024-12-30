import mongoose from "mongoose";

const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoURI = "mongodb+srv://student:crud@cluster0.w21dr.mongodb.net/";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectMongoDB;

