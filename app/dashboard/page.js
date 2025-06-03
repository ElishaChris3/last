"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setUser(user);
    };
    getUser();
  }, [router]);

  return user ? <h1>Welcome, {user.email}</h1> : <p>Loading...</p>;
}
