import connectMongoDB from "@/lib/mongodb";
import Student from "@/models/student";
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

async function DBConnection() {
  await connectMongoDB();
}

function validateProfilePicture(profilePicture: string): boolean {
  return /^data:image\/[a-zA-Z]+;base64,/.test(profilePicture);
}

function validateStudentData(student: Partial<StudentData>, checkPicture = true) {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "address",
    "coursePursuing",
    "uniqueRollNumber",
  ];

  for (const field of requiredFields) {
    if (!student[field as keyof StudentData]) {
      throw new Error(`${field} is required`);
    }
  }

  if (checkPicture && !validateProfilePicture(student.profilePicture || "")) {
    throw new Error("Invalid profile picture format");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await DBConnection();

    const { id } = params;
    const updatedFields = await request.json();

    const {
      newFirstName: firstName,
      newLastName: lastName,
      newEmail: email,
      newMobileNumber: mobileNumber,
      newAddress: address,
      newCoursePursuing: coursePursuing,
      newUniqueRollNumber: uniqueRollNumber,
      newProfilePicture: profilePicture,
    } = updatedFields;

    const updateData: Partial<StudentData> = {
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      coursePursuing,
      uniqueRollNumber,
      ...(profilePicture && { profilePicture }),
    };

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student details updated", student: updatedStudent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating student", error: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await DBConnection();

    const students = await Student.find();
    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: "No students found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching students", error: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await DBConnection();

    const studentData: StudentData = await request.json();
    validateStudentData(studentData);

    const newStudent = await Student.create(studentData);

    return NextResponse.json(
      { message: "Student created", student: newStudent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding student", error: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await DBConnection();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted", student: deletedStudent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting student", error: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}
