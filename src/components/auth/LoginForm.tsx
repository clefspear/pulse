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
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full bg-[#1A1D29] border-[#3A3D4A]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-[#F5F5F7]">
            <LogIn className="h-5 w-5 text-[#FF6B6B]" /> Studio Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0D0F1A] border-[#3A3D4A] text-[#F5F5F7] placeholder:text-[#6B6E7B]"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white">
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-[#A0A3B1]">
            Don't have an account?{" "}
            <Link to="/#waitlist" className="text-[#FF6B6B] hover:text-[#ff5252] hover:underline">
              Join the waitlist
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
