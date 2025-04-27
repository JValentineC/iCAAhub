import prisma from "../postgres/db";
import { users } from "@prisma/client";

export async function getUserById(
  userId: number
): Promise<users | users[] | null> {
  const dbUser = prisma.users.findUnique({
    where: { user_id: userId },
  });
  return dbUser;
}

export async function getUserByAuth0Id(auth0Id: string): Promise<users | null> {
  const dbUser = await prisma.users.findUnique({
    where: { auth0_id: auth0Id },
  });
  return dbUser;
}

export async function getUserByEmail(
  email: string
): Promise<users | users[] | null> {
  const dbUser = prisma.users.findUnique({
    where: { email: email },
  });
  return dbUser;
}

export async function createUser(data: {
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  auth0_id: string;
}): Promise<users | users[] | null> {
  const dbUser = await getUserByEmail(data.email);
  if (dbUser) {
    return dbUser;
  }
  const newUser = prisma.users.create({
    data,
  });
  return newUser;
}

export async function deleteUser(
  userId: number
): Promise<users | users[] | null> {
  const deletedUser = prisma.users.delete({
    where: { user_id: userId },
  });
  return deletedUser;
}
