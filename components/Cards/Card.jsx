"use client";

import React, { useEffect, useState } from "react";
import "./card.css";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const Card = ({ title, year, image, id, onDelete }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
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
          console.error("Error fetching permission:", error.message);
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

  const handleEdit = () => {
    router.push(`/edit/${id}`);
  };

  const onConfirmDelete = (e) => {
    e.preventDefault(); // Prevent form submission
    onDelete(id); // Call the delete function passed from parent
    setShowModal(false);
  };

  return (
    <>
      <div className="card">
        <div className="image_container">
          <img src={image} alt={title} />
        </div>

        <div className="details">
          <p className="title">{title}</p>
          <p>{year}</p>
        </div>

        <div className="btn-div">
          {permission.delete && (
            <button className="del-btn" onClick={() => setShowModal(true)}>
              Delete
            </button>
          )}
          {permission.update && (
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={onConfirmDelete}>
              <p>Are you sure you want to delete this movie?</p>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
