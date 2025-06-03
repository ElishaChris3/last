// "use client";

// import { useSearchParams } from "next/navigation";
// import { login } from "./actions";
// import Link from "next/link";
// import "./login.css";

// export default function Login() {
//   const searchParams = useSearchParams();
//   const error = searchParams.get("error");

//   return (
//     <div className="login-container">
//       <form className="login-form">
//         <h1>Login</h1>

//         {error && <p className="error-message">{error}</p>}

//         <input name="email" type="email" placeholder="Email" required />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           required
//         />

//         <div className="checkbox-containers">
//           <input type="checkbox" className="check" id="remember" />
//           <label htmlFor="remember" className="remember">
//             Remember me
//           </label>
//         </div>

//         <button formAction={login}>Login</button>

//         <div className="checkbox-container">
//           <p>
//             Not a member?{" "}
//             <Link href="/signup">
//               <span>Signup</span>
//             </Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Loading login form...</p>}>
      <LoginForm />
    </Suspense>
  );
}
