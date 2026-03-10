import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const Login = () => {
    const [loginInput, setLoginInput] = useState({ email: "", password: "" });
    const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });

    const [
        registerUser, 
        { 
            data: registerData, 
            error: registerError, 
            isLoading: registerIsLoading, 
            isSuccess: registerIsSuccess 
        }] = useRegisterUserMutation();
    const [
        loginUser, 
        { 
            data: loginData, 
            error: loginError, 
            isLoading: loginIsLoading, 
            isSuccess: loginIsSuccess 
        }] = useLoginUserMutation();

        const navigate = useNavigate();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value });
        } else {
            setLoginInput({ ...loginInput, [name]: value });
        }
    };

    {/* FUNCTION FOR TAKING DATA FROM SIGNUP PAGE */ }
    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;
        await action(inputData);
    };

    useEffect(() => {
    // 1. Handle Registration Success
    if (registerIsSuccess && registerData) {
        toast.success(registerData.message || "Account created successfully.");
    }
    
    // 2. Handle Login Success
    if (loginIsSuccess && loginData) {
        toast.success(loginData.message || "Welcome to your profile.");
        navigate("/");
    }

    // 3. Handle Registration Error (FIXED)
    if (registerError) {
        // Access 'data' from the error object, not registerData
        toast.error(registerError.data?.message || "Error occurred. Failed to signup.");
    }

    // 4. Handle Login Error (FIXED)
    if (loginError) {
        // Access 'data' from the error object, not loginData
        toast.error(loginError.data?.message || "Failed to login to profile.");
    }
}, [loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError, navigate]);

    return (
        <div className="flex items-center w-full justify-center mt-20">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">SignUp</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>

                {/*SIGNUP*/}
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create anew account here. Click Sign up when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={signupInput.name}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="Your name here (e.g., David)"
                                    required={true}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={signupInput.email}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="abc@gmail.com"
                                    required={true}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={signupInput.password}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="e.g., xyzupw"
                                    required={true}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")}>
                                {
                                    registerIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                                        </>
                                    ) : "Sign up"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/*LOGIN*/}
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login to your profile from here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="username">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={loginInput.email}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    placeholder="abc@gmail.com"
                                    required={true}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={loginInput.password}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    placeholder="e.g., xyzupw"
                                    required={true}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")}>
                                {
                                    loginIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                                        </>
                                    ) : "Login"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Login;
