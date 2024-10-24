import "./App.css";
import React, { useState, useEffect } from "react";
import UserList from "./components/userList/userList";
import AddUserForm from "./components/userForm/userForm";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  documentPhoto: File;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleAddUser = (
    name: string,
    email: string,
    phoneNumber: string,
    countryCode: string,
    documentPhoto: File
  ) => {
    const newUser = {
      id: users.length + 1,
      name,
      email,
      countryCode,
      phoneNumber,
      documentPhoto,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div className="main">
      <h1>User Registration</h1>
      <AddUserForm onAddUser={handleAddUser} />
      <h2>User List</h2>
      <UserList users={users} />
    </div>
  );
};

export default App;
