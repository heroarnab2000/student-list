import connectMongoDB from "../../../../lib/mongodb";
import Student from "../../../../models/student";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  coursePursuing: string;
  uniqueRollNumber: string;
  profilePicture: string;
}

async function DBconnection() {
  try {
    await connectMongoDB();
  } catch (error) {
    console.error("Error connecting to MongoDB:", (error as Error).message);
    throw new Error("Database connection failed");
  }
}

function validateStudentUpdate(data: Partial<StudentData>, id: string) {
  if (!id) {
    throw new Error("Student ID is required");
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "address",
    "coursePursuing",
    "uniqueRollNumber",
    "profilePicture",
  ];

  for (const key of Object.keys(data)) {
    if (!allowedFields.includes(key)) {
      throw new Error(`Invalid field: ${key}`);
    }
  }
}

function createResponse(success: boolean, message: string, data: unknown = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updatedFields = await request.json();

    validateStudentUpdate(updatedFields, id);

    await DBconnection();

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return createResponse(false, "Student not found", null, 404);
    }

    return createResponse(true, "Student details updated", updatedStudent);
  } catch (error) {
    console.error("PUT Error:", (error as Error).message);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return createResponse(false, "Error updating student details", errorMessage, 500);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return createResponse(false, "Student ID is required", null, 400);
    }

    await DBconnection();

    const student = await Student.findById(id);

    if (!student) {
      return createResponse(false, "Student not found", null, 404);
    }

    return createResponse(true, "Student fetched successfully", student);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("GET Error:", errorMessage);
    return createResponse(false, "Error fetching student", errorMessage, 500);
  }
}
