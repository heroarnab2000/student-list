"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditStudentFormProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  coursePursuing: string;
  uniqueRollNumber: string;
  profilePicture?: string; // Add profilePicture as optional prop
}

export default function EditStudentForm({
  id,
  firstName,
  lastName,
  email,
  mobileNumber,
  address,
  coursePursuing,
  uniqueRollNumber,
  profilePicture,
}: EditStudentFormProps) {
  const [newFirstName, setNewFirstName] = useState<string>(firstName);
  const [newLastName, setNewLastName] = useState<string>(lastName);
  const [newEmail, setNewEmail] = useState<string>(email);
  const [newMobileNumber, setNewMobileNumber] = useState<string>(mobileNumber);
  const [newAddress, setNewAddress] = useState<string>(address);
  const [newCoursePursuing, setNewCoursePursuing] = useState<string>(coursePursuing);
  const [newUniqueRollNumber, setNewUniqueRollNumber] = useState<string>(uniqueRollNumber);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    profilePicture ? `data:image/jpeg;base64,${profilePicture}` : null
  );

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("newFirstName", newFirstName);
    formData.append("newLastName", newLastName);
    formData.append("newEmail", newEmail);
    formData.append("newMobileNumber", newMobileNumber);
    formData.append("newAddress", newAddress);
    formData.append("newCoursePursuing", newCoursePursuing);
    formData.append("newUniqueRollNumber", newUniqueRollNumber);

    if (newProfilePicture) {
      formData.append("profilePicture", newProfilePicture);
    }

    try {
      const res = await fetch(`http://localhost:3000/api/students/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update student");
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setNewFirstName(e.target.value)}
        value={newFirstName}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="First Name"
        required
      />

      <input
        onChange={(e) => setNewLastName(e.target.value)}
        value={newLastName}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Last Name"
        required
      />

      <input
        onChange={(e) => setNewEmail(e.target.value)}
        value={newEmail}
        className="border border-slate-500 px-8 py-2"
        type="email"
        placeholder="Email"
        required
      />

      <input
        onChange={(e) => setNewMobileNumber(e.target.value)}
        value={newMobileNumber}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Mobile Number"
        required
      />

      <input
        onChange={(e) => setNewAddress(e.target.value)}
        value={newAddress}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Address"
        required
      />

      <input
        onChange={(e) => setNewCoursePursuing(e.target.value)}
        value={newCoursePursuing}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Course Pursuing"
        required
      />

      <input
        onChange={(e) => setNewUniqueRollNumber(e.target.value)}
        value={newUniqueRollNumber}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Unique Roll Number"
        required
      />

      {/* Profile Picture Upload */}
      <div>
        <label htmlFor="profilePicture" className="block text-sm font-medium">
          Update Profile Picture
        </label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
      </div>

      {/* Image Preview */}
      {previewImage && (
        <div className="mt-4">
          <h3 className="text-sm font-medium">Preview:</h3>
          <img
            src={previewImage}
            alt="Profile Preview"
            className="mt-2 w-48 h-48 object-cover rounded-md"
          />
        </div>
      )}

      <button type="submit" className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
        Update Student
      </button>
    </form>
  );
}
