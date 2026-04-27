"use server";

import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

import { signIn, signOut } from "@/auth";

import { SignUpState } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const saltRounds = 10;

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const repPassword = formData.get("password-rep") as string;

  if (!username || !password || !repPassword) {
    return { error: "Fatal error: values missing.", success: false };
  }

  if (password !== repPassword) {
    return { error: "Passwords do not match.", success: false };
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hash})
    `;

    return { error: null, success: true };
  } catch (err) {
    console.log(err);
    return { error: "Sign up failed, please try again later.", success: false };
  }
}

export async function acceptPostById(id: number) {
  try {
    await sql`UPDATE posts SET in_review = false WHERE posts.id = ${id}`;
    return true;
  } catch (error) {
    console.log("Database error: " + error);
    throw new Error("Error updating database");
  }
}

export async function setSuccessfulXXS(id: number) {
  try {
    await sql`UPDATE posts SET successful_xss = true WHERE posts.id = ${id}`;
    revalidatePath("/account/posts");
    revalidatePath("/posts");
    revalidatePath("/in-review");
    return true;
  } catch (error) {
    console.log("Database error: " + error);
    throw new Error("Error updating database");
  }
}

export async function checkUsernameExists(username: string) {
  const data = await sql<{ exists: boolean }[]>`
    SELECT EXISTS(
      SELECT 1 FROM users WHERE username = ${username}
    ) AS exists;
  `;

  return data[0].exists;
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const visibility = formData.get("public") === "true";
  const author = formData.get("author") as string;
  const redirectUrl = formData.get("redirect") as string;

  try {
    await sql`INSERT INTO posts (title, content, "public", author) VALUES (${title}, ${content}, ${visibility}, ${author});`;
    revalidatePath("/account/posts");
    revalidatePath("/posts");
    revalidatePath("/in-review");
  } catch (err) {
    console.log("Database error:", err);
    throw new Error("Failed to create post.");
  }
  redirect(redirectUrl);
}
