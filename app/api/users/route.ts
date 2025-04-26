import { createUser, getUserByAuth0Id, getUserById } from '@/lib/query/users';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const auth0Id = url.searchParams.get('auth0Id');

    if (!userId && !auth0Id) {
      return Response.json({ error: 'Missing userId or auth0Id' }, { status: 400 });
    }

    const data = auth0Id ? await getUserByAuth0Id(String(auth0Id)) : userId ? await getUserById(Number(userId)) : null;

    return Response.json({ data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
  }
}
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { first_name, last_name, name, email, auth0_id } = body;
    const data = await createUser({
      first_name,
      last_name,
      name,
      email,
      auth0_id,
    });
    return Response.json({ data: data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
  }
}
