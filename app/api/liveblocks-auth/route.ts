import { Liveblocks } from "@liveblocks/node";

//Allow Convex and liveblocks in next route handler:
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
// CLERK:
import { auth, currentUser } from "@clerk/nextjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth(); //clerk
  const user = await currentUser(); //clerk

  if (!authorization || !user) {
    return new Response("Unauthroized", { status: 403 });
  }
  // LIVEBLOCKS SEND ROOM INFORMATION IN HERE
  //FIRE OFF FROM LIVEBLOCKS.CONFIG
  const { room } = await request.json();
  const board = await convex.query(api.board.get, { id: room });
  // CHECK IF USE IS VALID FOR THIS ORG
  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized");
  }

  const userInfo = {
    name: user.firstName || "Teammates",
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo: userInfo });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
