import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified succesfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired, please signup again",
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error verify code", error);
    return Response.json(
      {
        success: false,
        message: "Error verify user",
      },
      { status: 500 }
    );
  }
}
