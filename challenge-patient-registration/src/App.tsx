import "./App.css";
import React, { useState, useEffect } from "react";
import UserList from "./components/userList/userList";
import AddUserForm from "./components/userForm/userForm";
import { getAllPatients } from "./services/patientsService";
import Modal from "./components/modal/modal";

const App: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllPatients();
      setUsers(fetchedUsers);
      localStorage.setItem("users", JSON.stringify(fetchedUsers));
    } catch (error) {
      setIsModalOpen(true);
      setErrorMessages(["Couldn't load users"]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    fetchUsers();
  };

  return (
    <>
      <div className="main">
        <h1>User Registration</h1>
        <AddUserForm onAddUser={handleAddUser} />
        <h2>User List</h2>
        <UserList users={users} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setErrorMessages([]);
          setIsModalOpen(false);
        }}
        message={errorMessages[0]}
        messageType={"error"}
      />
    </>
  );
};

export default App;
