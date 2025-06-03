"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "@/store/authSlice";
import "./navbar.css";

const Navbar = () => {
  const router = useRouter();
  const supabase = createClient();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        dispatch(setUser(user || null));
      }

      dispatch(setLoading(false));
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          dispatch(setUser(session.user));
        } else {
          dispatch(setUser(null));
        }

        dispatch(setLoading(false));

        if (_event === "SIGNED_OUT") {
          router.refresh();
        }
      }
    );

    fetchUser();

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, [dispatch, supabase, router]);

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="navbar">
      <h1
        className="navbar-logo"
        onClick={() => router.push("/movieslist")}
        style={{ cursor: "pointer" }}
      >
        MovieZone 🎬
      </h1>

      <div className="navbar-links">
        {!user ? (
          <button className="nav-btn logout" onClick={handleLogout}>
            login
          </button>
        ) : (
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
