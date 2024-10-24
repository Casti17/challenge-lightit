import React, { useState } from "react";
import "./userList.css";
import UserCard from "../userCard/userCard";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  documentPhoto: File;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id)); // Toggle between expanding and collapsing
  };

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p className="empty-state">No users available</p>
      ) : (
        <div className="user-grid">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isExpanded={user.id === expandedCardId}
              onToggleExpand={() => toggleExpand(user.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
