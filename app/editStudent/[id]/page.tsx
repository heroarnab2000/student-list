import EditStudentForm from "../../../components/EditStudents";

const getStudentById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/students/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch student");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching student:", error);
  }
};

interface EditStudentsProps {
  params: {
    id: string;
  };
}

export default async function EditStudent({ params }: EditStudentsProps) {
  const { id } = params;
  const data = await getStudentById(id);

  if (!data || !data.student) {
    return <div>Error loading student details.</div>;
  }

  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    address,
    coursePursuing,
    uniqueRollNumber,
    profilePicture,
  } = data.student;

  return (
    <EditStudentForm
      id={id}
      firstName={firstName}
      lastName={lastName}
      email={email}
      mobileNumber={mobileNumber}
      address={address}
      coursePursuing={coursePursuing}
      uniqueRollNumber={uniqueRollNumber}
      profilePicture={profilePicture}
    />
  );
}
