"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  coursePursuing: string;
  uniqueRollNumber: string;
  profilePicture: string; // Base64-encoded image
}

export default function AddStudent() {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    coursePursuing: "",
    uniqueRollNumber: "",
    profilePicture: "", // Initialize as empty string
  });

  const router = useRouter();

  // Handle text input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes and convert to Base64
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, profilePicture: base64String }));
      };

      reader.onerror = () => {
        console.error("Failed to read file!");
        alert("Failed to read the selected file.");
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      coursePursuing,
      uniqueRollNumber,
      profilePicture,
    } = formData;

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
      alert("All fields are required, including the profile picture.");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Student added successfully!");
        router.push("/");
      } else {
        const errorDetails = await res.json();
        console.error("Failed to add student:", errorDetails);
        alert(errorDetails.message || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
            <label htmlFor="email" className="block text-sm font-medium">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={(e) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
                if (!emailRegex.test(e.target.value)) {
                    alert("Please enter a valid email address.");
                }
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
            />
            </div>

            <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium">
                Mobile Number
            </label>
            <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                onBlur={(e) => {
                const mobileRegex = /^[6-9]\d{9}$/; // Regex for Indian mobile numbers (10 digits starting with 6-9)
                if (!mobileRegex.test(e.target.value)) {
                    alert("Please enter a valid mobile number.");
                }
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
            />
        </div>


        <div>
          <label htmlFor="address" className="block text-sm font-medium">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="coursePursuing" className="block text-sm font-medium">
            Course Pursuing
          </label>
          <input
            type="text"
            id="coursePursuing"
            name="coursePursuing"
            placeholder="Course Pursuing"
            value={formData.coursePursuing}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Unique Roll Number */}
        <div>
          <label htmlFor="uniqueRollNumber" className="block text-sm font-medium">
            Unique Roll Number
          </label>
          <input
            type="text"
            id="uniqueRollNumber"
            name="uniqueRollNumber"
            placeholder="Unique Roll Number"
            value={formData.uniqueRollNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        {/* Image Preview */}
        {formData.profilePicture && (
          <div className="mt-4">
            <h3 className="text-sm font-medium">Preview:</h3>
            <img
              src={formData.profilePicture}
              alt="Profile Preview"
              className="mt-2 w-48 h-48 object-cover rounded-md"
            />
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
}