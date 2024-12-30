"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

interface RemoveBtnProps {
  id: string;
}

export default function RemoveBtn({ id }: RemoveBtnProps) {
  const router = useRouter();

  const removeStudent = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/students?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          router.refresh();
        } else {
          console.error("Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  return (
    <button onClick={removeStudent} className="text-red-400 hover:text-red-600 transition">
      <HiOutlineTrash size={24} />
    </button>
  );
}
