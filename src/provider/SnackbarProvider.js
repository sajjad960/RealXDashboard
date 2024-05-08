import React from "react";
import { FaTimes } from 'react-icons/fa';


import { SnackbarProvider as NotistackProvider, useSnackbar } from "notistack";

const CloseButton = ({ id }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() => closeSnackbar(id)}
  >
    <FaTimes />
  </button>
)
};

const SnackbarProvider = ({ children }) => {
  return (
    <NotistackProvider
      maxSnack={3}
      preventDuplicate
      action={(key) => <CloseButton key={key} id={key} />}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {children}
    </NotistackProvider>
  );
};

export default SnackbarProvider;
