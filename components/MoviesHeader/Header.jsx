"use client";

import React, { useEffect, useState } from "react";
import "./header.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const Header = () => {
  const router = useRouter();
  const [permission, setPermission] = useState({});

  useEffect(() => {
    const fetchPermission = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("permission")
          .eq("email", user.email)
          .single();

        if (error) {
          console.error("Error fetching permissions:", error.message);
        } else {
          const parsed =
            typeof data.permission === "string"
              ? JSON.parse(data.permission)
              : data.permission || {};
          setPermission(parsed);
        }
      }
    };

    fetchPermission();
  }, []);

  const handleAdd = () => {
    router.push("/create");
  };

  return (
    <header>
      <div>
        <h1>
          My movies
          <span>
            <Link href="/create">
              {/* You could put an icon here if needed */}
            </Link>
          </span>
        </h1>
      </div>

      {permission.create && (
        <div>
          <ul>
            <li>Add Movies</li>
            <span>
              <img onClick={handleAdd} src="/plus.png" alt="Add Movie" />
            </span>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
