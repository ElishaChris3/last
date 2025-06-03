"use client";

import { useState, useEffect } from "react";
import "../../create/editpage.css";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const EditPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Get dynamic ID from route

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();
  useEffect(() => {
    const fetchMovie = async () => {
      const { data, error } = await supabase
        .from("Movies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch error:", error.message);
        setError("Failed to fetch movie");
        return;
      }

      setTitle(data.title);
      setYear(data.year);
      setImage(data.image);
    };

    fetchMovie();
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("User not authenticated");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Image upload error:", uploadError.message);
      setError("Image upload failed");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    setImage(publicUrl);
    setImageFile(file);
    setError("");
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Image upload error:", uploadError.message);
      setError("Image upload failed");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    setImage(publicUrl);
    setImageFile(file);
    setError("");
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (!title || !year || !image) {
      setError("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("Movies")
      .update({ title, year, image })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error.message);
      setError("Failed to update movie");
      return;
    }

    alert("Movie updated successfully!");
    router.push("/movieslist");
  };

  return (
    <div className="create-movie-container">
      <h1>Edit movie</h1>
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
                hidden
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
            onChange={(e) => setYear(e.target.value)}
          />
          <div className="form-buttons">
            <button
              className="cancel-btn"
              onClick={() => router.push("/movieslist")}
            >
              Cancel
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              Edit
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditPage;
