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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const {
      newFirstName: firstName,
      newLastName: lastName,
      newEmail: email,
      newMobileNumber: mobileNumber,
      newAddress: address,
      newCoursePursuing: coursePursuing,
      newUniqueRollNumber: uniqueRollNumber,
      newProfilePicture: profilePicture,
    }: {
      newFirstName: string;
      newLastName: string;
      newEmail: string;
      newMobileNumber: string;
      newAddress: string;
      newCoursePursuing: string;
      newUniqueRollNumber: string;
      newProfilePicture?: string;
    } = await request.json();

    await connectMongoDB();

    const updateData: Partial<StudentData> = {
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      coursePursuing,
      uniqueRollNumber,
    };

    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error updating student details", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const students = await Student.find();
    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: "No students found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching students", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const studentData: StudentData = await request.json();

    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      coursePursuing,
      uniqueRollNumber,
      profilePicture,
    } = studentData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobileNumber ||
      !address ||
      !coursePursuing ||
      !uniqueRollNumber ||
      !profilePicture
    ) {
      return NextResponse.json(
        { message: "All fields are required, including the profile picture." },
        { status: 400 }
      );
    }

    const isBase64 = /^data:image\/[a-zA-Z]+;base64,/.test(profilePicture);
    if (!isBase64) {
      return NextResponse.json(
        { message: "Invalid profile picture format." },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const newStudent = await Student.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      coursePursuing,
      uniqueRollNumber,
      profilePicture,
    });

    return NextResponse.json(
      { message: "Student created", student: newStudent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/students:", error);
    return NextResponse.json(
      {
        message: "Error adding student",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting student", error: errorMessage },
      { status: 500 }
    );
  }
}
