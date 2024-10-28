import React, { useState } from "react";
import "./userList.css";
import UserCard from "../userCard/userCard";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  documentPhotoPath: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const [expandedCardId, setExpandedCardId] = React.useState<number | null>(
    null
  );

  const toggleExpand = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedCardId((prevId) => (prevId === id ? null : id));
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
              isExpanded={expandedCardId === user.id}
              onToggleExpand={(event) => toggleExpand(user.id, event)}
              className={expandedCardId === user.id ? "expanded" : ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
