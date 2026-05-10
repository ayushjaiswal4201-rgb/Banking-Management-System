import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, User, AlertCircle, Eye, EyeOff, Shield, Users } from "lucide-react";
import finovaLogo from "@/assets/finova-logo.png";

export default function Login() {
  const { role } = useParams<{ role: string }>();
  const isAdmin = role === "admin";
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const result = login(accountNumber, password);
      setLoading(false);
      if (result.success) {
        navigate(isAdmin ? "/admin" : "/dashboard");
      } else {
        setError(result.message);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img src={finovaLogo} alt="Finova Bank" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Finova Bank</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            {isAdmin ? <Shield className="h-4 w-4 text-primary" /> : <Users className="h-4 w-4 text-primary" />}
            <p className="text-sm text-muted-foreground">
              {isAdmin ? "Administrator Login" : "Customer Login"}
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your account number and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="account">Account Number</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="account" placeholder="Enter account number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            {!isAdmin && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link>
              </p>
            )}
            <div className="text-center mt-3">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to role selection
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
