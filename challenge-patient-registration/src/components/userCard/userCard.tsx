import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  documentPhoto: Blob | null;
}

interface UserCardProps {
  user: User;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isExpanded,
  onToggleExpand,
}) => {
  const [documentPhotoUrl, setDocumentPhotoUrl] = useState<string | null>(null);

  // Generate URL for the document photo
  useEffect(() => {
    if (user.documentPhoto) {
      const objectUrl = URL.createObjectURL(user.documentPhoto);
      setDocumentPhotoUrl(objectUrl);

      // Clean up the object URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [user.documentPhoto]);

  return (
    <div
      className={`user-card ${isExpanded ? "expanded" : ""}`}
      onClick={onToggleExpand}
    >
      <div className="user-card-header">
        {documentPhotoUrl ? (
          <img src={documentPhotoUrl} alt="Document" className="user-photo" />
        ) : (
          <p>No document photo available</p>
        )}
        <p className="user-name">{user.name}</p>
      </div>
      {isExpanded && (
        <div className="user-details">
          <p>Email: {user.email}</p>
          <p>
            Phone: {user.countryCode} {user.phoneNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserCard;
