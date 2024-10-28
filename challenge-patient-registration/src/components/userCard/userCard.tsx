import React from "react";

interface User {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  documentPhotoPath: string | null;
}

interface UserCardProps {
  user: User;
  isExpanded: boolean;
  onToggleExpand: (event: React.MouseEvent) => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isExpanded,
  onToggleExpand,
  className,
}) => {
  const baseUrl = process.env.REACT_APP_PICTURE_URL;

  return (
    <div className={`user-card ${className}`} onClick={onToggleExpand}>
      <div className="user-card-header">
        {user.documentPhotoPath ? (
          <img
            src={`${baseUrl}${user.documentPhotoPath}`}
            alt="Document"
            className="user-photo"
          />
        ) : (
          <p>No photo available</p>
        )}
        <p className="user-name">{user.name}</p>
      </div>
      {isExpanded && (
        <div className="user-details">
          <p>Email: {user.email}</p>
          <p>Phone: {` ${user.phoneNumber}`}</p>
        </div>
      )}
    </div>
  );
};

export default UserCard;
