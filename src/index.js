import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id="innerDiv"
        style={{
          height: "100vh",
          width: "100%",
          maxWidth: "576px",
        }}
      >
        <App />
      </div>
    </div>
  </React.StrictMode>
);
