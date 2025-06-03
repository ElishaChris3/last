"use client";

import AddMovie from "@/components/AddMovie/AddMovie";
import "./moviepage.css";
import { createClient } from "@/utils/supabase/client";
import Card from "@/components/Cards/Card";
import { useEffect, useState } from "react";
import Header from "@/components/MoviesHeader/Header";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        // 1. Check user session
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error(userError?.message || "User not authenticated");
        }

        // 2. Fetch movies
        const { data, error: movieError } = await supabase
          .from("Movies")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (movieError) throw movieError;

        setMovies(data || []);
      } catch (error) {
        console.error("Error:", error.message);
        setError(error.message);
        router.push("/login"); // Redirect if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [supabase, router]);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("Movies").delete().eq("id", id);

      if (error) throw error;

      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error("Delete error:", error.message);
      setError("Failed to delete movie");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "63vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <Header />
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")}>Dismiss</button>
        </div>
      )}

      {movies.length === 0 && <AddMovie />}

      <div className="movies">
        {/* <AddMovie
          onAdd={(newMovie) => setMovies((prev) => [newMovie, ...prev])}
        /> */}

        {movies.map((movie) => (
          <Card
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={movie.image}
            year={movie.year}
            rating={movie.rating}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviePage;
