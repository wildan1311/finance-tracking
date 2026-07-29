import LoginUseCase from "../../applications/LoginUseCase";

const loginAction = async (
    _prevState: any,
    formData: FormData
) => {
    const name = formData.get("name") as string;
    const password = formData.get("pin") as string;

    const loginUseCase = new LoginUseCase();
    return await loginUseCase.execute(name, password);
}

export default loginAction