import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./userForm.css";
import Modal from "../modal/modal";
import { registerPatient } from "../../services/registerService";

interface AddUserFormProps {
  onAddUser: (
    name: string,
    email: string,
    phoneNumber: string,
    countryCode: string,
    documentPhoto: File
  ) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAddUser }) => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [documentPhoto, setDocumentPhoto] = useState<File | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  ); // Track modal state

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "image/jpeg") {
      setDocumentPhoto(file);
      setErrorMessages([]); // Clear errors when valid file is added
    } else {
      setErrorMessages(["Only .jpg images are allowed"]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [] },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    // Validation checks
    if (!name) errors.push("Name is required");
    if (!email || !email.endsWith("@gmail.com"))
      errors.push("Email must be a @gmail.com address");
    if (!phoneNumber) errors.push("Phone number is required");
    if (!countryCode) errors.push("Country code is required");
    if (!documentPhoto) errors.push("Document photo is required");

    // Show errors if there are any
    if (errors.length > 0) {
      setErrorMessages(errors);
      setMessageType("error");
      setIsModalOpen(true);
      return;
    }

    // Clear errors and submit user
    try {
      /*const data = await registerPatient(
        name,
        email,
        phoneNumber,
        countryCode,
        documentPhoto!
      );*/
      if (documentPhoto) {
        onAddUser(name, email, phoneNumber, countryCode, documentPhoto);
      }

      const newUser = {
        name,
        email,
        phoneNumber,
        countryCode,
        documentPhoto: documentPhoto ? URL.createObjectURL(documentPhoto) : "",
      };

      // Retrieve existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // Save the new user in localStorage
      localStorage.setItem(
        "users",
        JSON.stringify([...existingUsers, newUser])
      );

      setMessageType("success");
      setIsModalOpen(true); // Show success modal

      setName("");
      setCountryCode("");
      setEmail("");
      setPhoneNumber("");
      setDocumentPhoto(null);
    } catch (error) {
      setErrorMessages([
        (error as Error).message ||
          "Failed to register patient. Please try again.",
      ]);
      setMessageType("error");
      setIsModalOpen(true);
    }
    // Optionally reset form fields after submission
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="add-user-form">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label>Phone Number:</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder="Country Code"
              style={{ width: "100px" }}
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
        </div>

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>
              Drag & drop a .jpg document photo here, or click to select one
            </p>
          )}
        </div>

        <button type="submit">Add User</button>
      </form>

      {/* Modal for success/error messages */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={
          errorMessages.length > 0 ? errorMessages : "User added successfully!"
        }
        messageType={messageType}
      />
    </>
  );
};

export default AddUserForm;
