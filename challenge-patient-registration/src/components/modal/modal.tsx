// Modal.tsx
import React from "react";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string | string[]; // Can be a string or an array of error messages
  messageType: "success" | "error"; // To differentiate between success and error states
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  message,
  messageType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {messageType === "success" && <h2>Success!</h2>}
        {messageType === "error" && <h2>Error!</h2>}

        {Array.isArray(message) ? (
          <ul>
            {message.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : (
          <p>{message}</p>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
