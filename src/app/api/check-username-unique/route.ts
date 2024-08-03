import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validation with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 400 }
    );
  } catch (error) {
    console.log("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
