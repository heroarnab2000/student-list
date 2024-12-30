// File: /components/StudentsList.tsx

import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  coursePursuing: string;
  uniqueRollNumber: string;
  profilePicture?: string; // Base64-encoded image with data URL prefix
}

const getStudents = async (): Promise<{ students: Student[] } | undefined> => {
  try {
    console.log("Sending request to /api/students...");
    const res = await fetch("http://localhost:3000/api/students", {
      cache: "no-store",
    });

    console.log("Response status:", res.status);
    if (!res.ok) {
      const errorDetails = await res.text();
      console.error("Error details:", errorDetails);
      throw new Error(`Failed to fetch students: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Fetched students successfully:", data);
    return data;
  } catch (error) {
    console.error("Error loading students:", error);
    throw error;
  }
};

export default async function StudentsList() {
  let data;
  try {
    data = await getStudents();
  } catch (error) {
    return <div className="text-red-500">Error loading students. Please try again later.</div>;
  }

  if (!data || !data.students || data.students.length === 0) {
    return <div className="text-gray-500">No students found.</div>;
  }

  const { students } = data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Students List</h1>
      {students.map((s) => (
        <div
          key={s._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start rounded-md shadow-sm"
        >
          {/* Profile Picture */}
          <img
            src={s.profilePicture ? s.profilePicture : "/placeholder.png"}
            alt={`${s.firstName} ${s.lastName}'s profile`}
            width={64}
            height={64}
            className="rounded-full object-cover w-16 h-16"
            loading="lazy"
          />

          {/* Student Details */}
          <div className="flex-1">
            <h2 className="font-bold text-xl mb-2">
              {s.firstName} {s.lastName}
            </h2>
            <div className="text-sm text-gray-700">
              <p><strong>Email:</strong> {s.email}</p>
              <p><strong>Mobile Number:</strong> {s.mobileNumber}</p>
              <p><strong>Address:</strong> {s.address}</p>
              <p><strong>Course Pursuing:</strong> {s.coursePursuing}</p>
              <p><strong>Unique Roll Number:</strong> {s.uniqueRollNumber}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <RemoveBtn id={s._id} />
            <Link href={`/editStudent/${s._id}`}>
              <HiPencilAlt size={24} className="text-blue-500 hover:text-blue-700" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}