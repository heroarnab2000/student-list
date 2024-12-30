"use client";

import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
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
    profilePicture?: string;
  }

const getStudents = async (): Promise<Student[]> => {
  const res = await fetch("http://localhost:3000/api/students", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }
  const data = await res.json();
  return data.students || [];
};

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch {
        setError("Error loading students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns: TableColumn<Student>[] = [
    {
      name: "Profile Picture",
      cell: (row) => (
        <img
          src={row.profilePicture || "/placeholder.png"}
          alt={`${row.firstName} ${row.lastName}'s profile`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Course Pursuing",
      selector: (row) => row.coursePursuing,
    },
    {
      name: "Roll Number",
      selector: (row) => row.uniqueRollNumber,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <RemoveBtn id={row._id} />
          <Link href={`/editStudent/${row._id}`}>
            <HiPencilAlt size={24} className="text-blue-500 hover:text-blue-700" />
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Students List</h1>
      <DataTable
        columns={columns}
        data={students}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}
