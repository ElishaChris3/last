"use client";
import "./error.css";

export default function ErrorPage() {
  return (
    <div className="error-container">
      <div className="error-box">
        <h1>Access Denied</h1>
        <p>You do not have permission to sign in.</p>
        <p>
          Please contact the administrator if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
}
