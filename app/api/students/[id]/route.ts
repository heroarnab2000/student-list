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
  profilePicture: string; // Base64-encoded image
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Parse JSON body
    const {
      newFirstName: firstName,
      newLastName: lastName,
      newEmail: email,
      newMobileNumber: mobileNumber,
      newAddress: address,
      newCoursePursuing: coursePursuing,
      newUniqueRollNumber: uniqueRollNumber,
      newProfilePicture: profilePicture, // Optional field
    }: {
      newFirstName: string;
      newLastName: string;
      newEmail: string;
      newMobileNumber: string;
      newAddress: string;
      newCoursePursuing: string;
      newUniqueRollNumber: string;
      newProfilePicture?: string; // Base64 string
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
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
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


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectMongoDB();
    const student = await Student.findOne({ _id: id });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ student }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching student", error: errorMessage }, { status: 500 });
  }
}
