"use client";

import React, { useState } from "react";
import "./editpage.css";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const CreatePage = () => {
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const uploadImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file. ");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setFormError("User not authenticated");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      setFormError("Image upload failed");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    setImage(publicUrl);
    setImageFile(file);
    setFormError("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadImage(file);
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await uploadImage(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (!title || !year || !image) {
      setFormError("Please fill all fields");
      return;
    }

    const { error } = await supabase.from("Movies").insert([
      {
        title,
        year,
        image,
      },
    ]);

    if (error) {
      setFormError(error.message);
      return;
    }

    alert("Movie created successfully!");
    setTitle("");
    setYear("");
    setImage("");
    setImageFile(null);
    setFormError("");
    router.push("/movieslist");
  };

  return (
    <div className="create-movie-container">
      <h1>Create a new movie</h1>
      <div className="form-wrapper">
        <div
          className="image-dropzone"
          onDragOver={handleDragOver}
          onDrop={handleImageDrop}
        >
          {image ? (
            <img src={image} alt="Preview" className="preview-image" />
          ) : (
            <label className="image-upload-label">
              <span>Click to Upload Image</span>
              <input
                className="preview-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
        <div className="form-fields">
          <input
            type="text"
            className="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="publish"
            placeholder="Publishing year"
            value={year}
            inputMode="numeric"
            maxLength={4}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d{0,4}$/.test(input)) {
                setYear(input);
              }
            }}
          />

          <div className="form-buttons">
            <button
              className="cancel-btn"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              Create
            </button>
          </div>
          {formError && <p className="error-text">{formError}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
