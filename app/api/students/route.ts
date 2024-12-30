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

<<<<<<< HEAD
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
=======
async function withMongoDB(callback: () => Promise<NextResponse>) {
  try {
    await connectMongoDB();
    return await callback();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Database error", error: errorMessage },
      { status: 500 }
    );
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
<<<<<<< HEAD
  try {
    await DBConnection();

    const { id } = params;
    const updatedFields = await request.json();
=======
  return withMongoDB(async () => {
    const { id } = params;
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5

    const {
      newFirstName: firstName,
      newLastName: lastName,
      newEmail: email,
      newMobileNumber: mobileNumber,
      newAddress: address,
      newCoursePursuing: coursePursuing,
      newUniqueRollNumber: uniqueRollNumber,
      newProfilePicture: profilePicture,
<<<<<<< HEAD
    } = updatedFields;
=======
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
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5

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
<<<<<<< HEAD
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

=======
  });
}

export async function GET() {
  return withMongoDB(async () => {
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5
    const students = await Student.find();
    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: "No students found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ students }, { status: 200 });
<<<<<<< HEAD
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

=======
  });
}

export async function POST(request: NextRequest) {
  return withMongoDB(async () => {
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5
    const studentData: StudentData = await request.json();
    validateStudentData(studentData);

<<<<<<< HEAD
    const newStudent = await Student.create(studentData);
=======
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
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5

    return NextResponse.json(
      { message: "Student created", student: newStudent },
      { status: 201 }
    );
<<<<<<< HEAD
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

=======
  });
}

export async function DELETE(request: NextRequest) {
  return withMongoDB(async () => {
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5
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
<<<<<<< HEAD
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting student", error: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
=======
  });
>>>>>>> e8aadec75cccc7ca6c06ff51298f9b05fdb557f5
}
