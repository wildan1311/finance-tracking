import { Response } from "@/modules/shared/Response";
import { toast } from "sonner";

class Toaster {
    static show({title, description, type}: {title: string, description?: string, type?: "success" | "error"}) {
        toast[type || "success"](title, {
            description: description,
        })
    }

    static showFromResponse(response: Response) {
        Toaster.show({
            title: response.status ? "Success" : "Error",
            description: response.message,
            type: response.status ? "success" : "error"
        })
    }
}

export default Toaster;