import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { validatePAN, validateAadhaar, validatePassword } from "@/lib/banking-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import finovaLogo from "@/assets/finova-logo.png";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", age: "", gender: "", address: "", phone: "", email: "", pan: "", aadhaar: "", occupation: "", salary: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!form.fullName || !form.age || !form.gender || !form.address || !form.phone || !form.email) { setError("All fields are required"); return false; }
    if (parseInt(form.age) < 18) { setError("Age must be 18 or older"); return false; }
    if (!/^\d{10}$/.test(form.phone)) { setError("Phone must be 10 digits"); return false; }
    setError(""); return true;
  };

  const validateStep2 = () => {
    if (!validatePAN(form.pan)) { setError("Invalid PAN format (e.g., ABCDE1234F)"); return false; }
    if (!validateAadhaar(form.aadhaar)) { setError("Aadhaar must be 12 digits"); return false; }
    if (!form.occupation || !form.salary) { setError("All fields are required"); return false; }
    setError(""); return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = validatePassword(form.password);
    if (!pw.valid) { setError(pw.message); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    const result = register({ fullName: form.fullName, age: parseInt(form.age), gender: form.gender, address: form.address, phone: form.phone, email: form.email, pan: form.pan, aadhaar: form.aadhaar.replace(/\s/g, ""), occupation: form.occupation, salary: parseInt(form.salary) }, form.password);
    if (result.success) {
      // Navigate to passbook page with the new account number
      navigate(`/passbook?account=${result.accountNumber}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-6">
          <img src={finovaLogo} alt="Finova Bank" className="h-16 w-auto mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          <div className="flex gap-1 mt-3 justify-center">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 w-16 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardContent className="pt-6">
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Enter full name" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Age</Label><Input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="18+" min={18} /></div>
                  <div className="space-y-2"><Label>Gender</Label>
                    <Select value={form.gender} onValueChange={v => set("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Full address" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="10 digits" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Email" /></div>
                </div>
                <Button className="w-full" onClick={() => validateStep1() && setStep(2)}>Continue</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>PAN Card</Label><Input value={form.pan} onChange={e => set("pan", e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} /></div>
                  <div className="space-y-2"><Label>Aadhaar Number</Label><Input value={form.aadhaar} onChange={e => set("aadhaar", e.target.value)} placeholder="12 digits" maxLength={12} /></div>
                </div>
                <div className="space-y-2"><Label>Occupation</Label><Input value={form.occupation} onChange={e => set("occupation", e.target.value)} placeholder="Your occupation" /></div>
                <div className="space-y-2"><Label>Monthly Salary (₹)</Label><Input type="number" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="Monthly income" /></div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" onClick={() => validateStep2() && setStep(3)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min 8 chars, uppercase, lowercase, digit, special" /></div>
                <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="Re-enter password" /></div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)} type="button">Back</Button>
                  <Button className="flex-1" type="submit">Create Account</Button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account? <Link to="/login/customer" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
