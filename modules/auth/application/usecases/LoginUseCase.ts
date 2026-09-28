import { env } from "@/config/env";
import ResponseMaker from "@/modules/shared/application/ResponseMaker";

class LoginUseCase {
  async execute(name: string, password: string) {
    if (password !== env.pin) {
      return ResponseMaker.makeErrorResponse("Invalid pin.");
    }

    return ResponseMaker.makeSuccessResponse("Signed in successfully.", { name });
  }
}

export default LoginUseCase;