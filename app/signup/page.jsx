"use client";

import { signup } from "../login/actions";
import Link from "next/link";
import "./signup.css";

export default function SignupPage() {
  return (
    <div className="login-container">
      <form className="login-form">
        <h1>Sign up</h1>

        <input type="email" name="email" placeholder="Email" required />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <p>
          Have already an account?{" "}
          <Link href="/login">
            <span>Login</span>
          </Link>
        </p>

        <button className="btn-signup" formAction={signup}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
