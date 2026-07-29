import { config } from "@/config/app";
import ResponseMaker from "@/lib/ResponseMaker";

class LoginUseCase {
  constructor() {}

  async execute(name: string, password: string) {
    const pin = config.pin;

    if (password !== pin) {
      return ResponseMaker.makeErrorResponse("Invalid pin.");
    }

    return ResponseMaker.makeSuccessResponse("Signed in successfully.", { name });
  }
}

export default LoginUseCase;