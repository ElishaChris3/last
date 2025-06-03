"use client";

import React from "react";
import Link from "next/link";
import "./addmovie.css";

const AddMovie = () => {
  return (
    <section className="add">
      <h2>Your movie list is empty</h2>
      <Link href="/create">
        <button>Add a new movie</button>
      </Link>
    </section>
  );
};

export default AddMovie;
