"use client";

import { useEffect, useState } from "react";
import "./permission.css";
import Loader from "@/components/Loader/Loader";
import { createClient } from "@/utils/supabase/client";

const Permission = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        const userList = data.map((u) => ({
          ...u,
          permission:
            typeof u.permission === "string"
              ? JSON.parse(u.permission)
              : u.permission || {},
        }));
        setUsers(userList);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleChange = async (email, perm, checked) => {
    const supabase = createClient();

    const updatedUsers = users.map((u) => {
      if (u.email === email) {
        return {
          ...u,
          permission: {
            ...u.permission,
            [perm]: checked,
          },
        };
      }
      return u;
    });

    setUsers(updatedUsers);

    const userToUpdate = updatedUsers.find((u) => u.email === email);

    const { error } = await supabase
      .from("profiles")
      .update({ permission: userToUpdate.permission })
      .eq("email", email);

    if (error) {
      console.error("Error updating permissions:", error.message);
    }
  };

  return (
    <div className="table-container">
      {loading && <Loader />}
      <h1>Permission Dashboard</h1>

      <table className="permission-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Create</th>
            <th>Update</th>
            <th>Delete</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.email}</td>
              {["create", "update", "delete", "view"].map((perm) => (
                <td key={perm}>
                  <input
                    type="checkbox"
                    checked={user.permission?.[perm] || false}
                    onChange={(e) =>
                      handleChange(user.email, perm, e.target.checked)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Permission;
