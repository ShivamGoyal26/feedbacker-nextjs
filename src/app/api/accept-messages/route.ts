import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update status to accept the messages",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message status updated successfully",
          data: updatedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("failed to update status to accept the messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update status to accept the messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message status found",
          isAcceptingMessage: foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("failed to get the accepting message status", error);
    return Response.json(
      {
        success: false,
        message: "failed to get the accepting message status",
      },
      { status: 500 }
    );
  }
}
