// apiService.ts
const API_URL = "https://localhost:7260/api/Patients";

export const registerPatient = async (
  name: string,
  email: string,
  phoneNumber: string,
  countryCode: string,
  documentPhoto: File
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phoneNumber", phoneNumber);
  formData.append("countryCode", countryCode);
  if (documentPhoto) {
    formData.append("documentPhoto", documentPhoto);
  }

  const response = await fetch(`${API_URL}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to register patient");
  }

  return await response.json();
};
