"use server";

import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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

export async function signUp() {
  return;
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
