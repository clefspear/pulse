import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, fullName);
      toast("Account created successfully", {
        description: "Please check your email to verify your account.",
      });
      navigate("/login");
    } catch (error) {
      setError("Error creating account");
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full bg-[#1A1D29] border-[#3A3D4A]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-[#F5F5F7]">
            <UserPlus className="h-5 w-5 text-[#FF6B6B]" /> Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#F5F5F7]">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-[#0D0F1A] border-[#3A3D4A] text-[#F5F5F7] placeholder:text-[#6B6E7B]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F5F5F7]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0D0F1A] border-[#3A3D4A] text-[#F5F5F7] placeholder:text-[#6B6E7B]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F5F5F7]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0D0F1A] border-[#3A3D4A] text-[#F5F5F7] placeholder:text-[#6B6E7B]"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white">
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-[#A0A3B1]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FF6B6B] hover:text-[#ff5252] hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
