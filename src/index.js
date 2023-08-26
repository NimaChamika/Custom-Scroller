import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div
        id="innerDiv"
        style={{
          position: "relative",
          maxWidth: "100vw",
          height: "100vh",
          width: "576px",
        }}
      >
        <App />
      </div>
    </div>
  </React.StrictMode>
);
