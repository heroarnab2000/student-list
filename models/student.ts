import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    coursePursuing: { type: String, required: true },
    uniqueRollNumber: { type: String, required: true, unique: true },
    profilePicture: { type: String },
  },
  { 
    timestamps: true
  }
);

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;