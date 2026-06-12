import { createContext, useContext, useState, useCallback, useRef } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "success", // success, warning, error, delete, approve, prompt
    message: "",
    defaultValue: "",
    inputValue: "",
  });

  const resolverRef = useRef(null);

  const openModal = useCallback((config) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModalState({
        isOpen: true,
        type: config.type,
        message: config.message,
        defaultValue: config.defaultValue || "",
        inputValue: config.defaultValue || "",
      });
    });
  }, []);

  const showAlert = (message, type = "success") => {
    return openModal({ type, message });
  };

  const showConfirm = (message, type = "approve") => {
    return openModal({ type, message });
  };

  const showPrompt = (message, defaultValue = "") => {
    return openModal({ type: "prompt", message, defaultValue });
  };

  const handleConfirm = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      if (modalState.type === "prompt") {
        resolverRef.current(modalState.inputValue);
      } else {
        resolverRef.current(true);
      }
      resolverRef.current = null;
    }
  };

  const handleCancel = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      if (modalState.type === "prompt") {
        resolverRef.current(null);
      } else {
        resolverRef.current(false);
      }
      resolverRef.current = null;
    }
  };

  const getIcon = () => {
    switch (modalState.type) {
      case "success":
      case "approve":
        return (
          <div className="modal-icon modal-icon-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        );
      case "error":
      case "delete":
        return (
          <div className="modal-icon modal-icon-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
        );
      case "warning":
        return (
          <div className="modal-icon modal-icon-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
        );
      case "prompt":
        return (
          <div className="modal-icon modal-icon-prompt">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {modalState.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            {getIcon()}
            <p className="modal-message">{modalState.message}</p>
            
            {modalState.type === "prompt" && (
              <input
                type="text"
                className="modal-input"
                value={modalState.inputValue}
                onChange={(e) => setModalState({ ...modalState, inputValue: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
                autoFocus
              />
            )}

            <div className="modal-actions">
              {(modalState.type === "delete" || modalState.type === "approve" || modalState.type === "prompt") && (
                <button className="btn-modal btn-modal-cancel" onClick={handleCancel}>
                  Cancelar
                </button>
              )}
              
              <button 
                className={`btn-modal btn-modal-${modalState.type}`} 
                onClick={handleConfirm}
              >
                {modalState.type === "delete" ? "Excluir" : 
                 modalState.type === "approve" ? "Aprovar" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
