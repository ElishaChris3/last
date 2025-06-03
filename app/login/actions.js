"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  // Check permissions

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("permission")
    .eq("email", email)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();

    return redirect("/error"); // Profile not found
  }

  const permission =
    typeof profile.permission === "string"
      ? JSON.parse(profile.permission)
      : profile.permission || {};

  if (!permission.view) {
    await supabase.auth.signOut();

    return redirect("/error"); // Access denied
  }

  // ✅ Continue to protected page
  revalidatePath("/movieslist", "layout");
  return redirect("/movieslist");
}

export async function signup(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const data = {
    email: email,
    password: password,
  };

  await supabase.from("profiles").insert({
    email: email,
    permission: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  });

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
