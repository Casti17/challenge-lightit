import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./userForm.css";
import Modal from "../modal/modal";
import { registerPatient } from "../../services/patientsService";

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
  );
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "image/jpeg") {
      setDocumentPhoto(file);
      setErrorMessages((prev) =>
        prev.filter((msg) => msg !== "Only .jpg images are allowed")
      );
    } else {
      setErrorMessages((prev) => [...prev, "Only .jpg images are allowed"]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [] },
    multiple: false,
  });

  const validateFields = () => {
    const errors: string[] = [];
    if (!name) {
      errors.push("Name is required");
    } else if (!/^[a-zA-Z ]+$/.test(name)) {
      errors.push("Name must contain only letters");
    }
    if (!email || !email.endsWith("@gmail.com")) {
      errors.push("Email must be a @gmail.com address");
    }
    if (!phoneNumber) {
      errors.push("Phone number is required");
    }
    if (!countryCode) {
      errors.push("Country code is required");
    }
    if (!documentPhoto) {
      errors.push("Document photo is required");
    }

    setErrorMessages(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateFields()) {
      setMessageType("error");
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const newUser = await createUser();

      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      localStorage.setItem(
        "users",
        JSON.stringify([...existingUsers, newUser])
      );

      setMessageType("success");
      setIsModalOpen(true);
      resetUserForm();
      setIsLoading(false);
    } catch (error) {
      setMessageType("error");
      setErrorMessages(["An error occurred while adding the user."]);
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    async function createUser() {
      const data = await registerPatient(
        name,
        email,
        phoneNumber,
        countryCode,
        documentPhoto!
      );

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
      return newUser;
    }

    function resetUserForm() {
      setErrorMessages([]);
      setName("");
      setCountryCode("");
      setEmail("");
      setPhoneNumber("");
      setDocumentPhoto(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\D/g, "");
    setCountryCode(sanitizedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="add-user-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          {errorMessages.includes("Name is required") && (
            <p className="error-message animate">Name is required</p>
          )}
          {errorMessages.includes("Name must contain only letters") && (
            <p className="error-message animate">
              Name must contain only letters
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errorMessages.includes("Email must be a @gmail.com address") && (
            <p className="error-message animate">
              Email must be a @gmail.com address
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <input
              type="number"
              value={countryCode}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Country Code"
              style={{ width: "100px" }}
            />
            <input
              type="number"
              value={phoneNumber}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Phone Number"
              style={{ display: "flex", width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: "30px" }}>
            {errorMessages.includes("Country code is required") && (
              <p className="error-message animate">Code is required</p>
            )}
            {errorMessages.includes("Phone number is required") && (
              <p className="error-message animate">Phone number is required</p>
            )}
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
        {errorMessages.includes("Only .jpg images are allowed") && (
          <p className="error-message animate">Only .jpg images are allowed</p>
        )}

        {documentPhoto && (
          <div className="document-photo-preview-container">
            <img
              className="document-photo-preview"
              src={URL.createObjectURL(documentPhoto)}
              alt={documentPhoto.name}
              width={100}
              height={100}
            />
            <p style={{ marginTop: "2px" }}>{documentPhoto.name}</p>
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="spinner">
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
            </div>
          ) : (
            "Add User"
          )}
        </button>
      </form>

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
