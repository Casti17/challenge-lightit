const API_URL = process.env.REACT_APP_API_URL;
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
  formData.append("phoneNumber", `+${countryCode} ${phoneNumber}`);

  if (documentPhoto) {
    formData.append("documentPhoto", documentPhoto);
  }

  const response = await fetch(`${API_URL}/Patients`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to register patient");
  }

  return await response.json();
};

export const getAllPatients = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/Patients`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return await response.json();
};
