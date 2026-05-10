import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, calculateEMI, checkLoanEligibility } from "@/lib/banking-utils";
import { Landmark, Calculator, AlertCircle } from "lucide-react";

export default function Loans() {
  const { user, loans, applyLoan } = useAuth();
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("12");
  const [error, setError] = useState("");

  if (!user) return null;

  const userLoans = loans.filter(l => l.userId === user.id);
  const rate = 10.5;
  const emi = amount && duration ? calculateEMI(parseInt(amount), rate, parseInt(duration)) : 0;
  const totalPayable = emi * parseInt(duration || "0");
  const totalInterest = totalPayable - parseInt(amount || "0");

  const handleApply = () => {
    const val = parseInt(amount);
    if (!val || val <= 0) { setError("Enter a valid amount"); return; }
    const eligibility = checkLoanEligibility(user.salary, val);
    if (!eligibility.eligible) { setError(eligibility.reason); return; }
    applyLoan(val, parseInt(duration));
    setAmount("");
    setDuration("12");
    setError("");
  };

  const statusColor = (s: string) => s === "approved" ? "bg-success/10 text-success" : s === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning";

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Loans</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base">Apply for Loan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}
              <div className="space-y-2">
                <Label>Loan Amount (₹)</Label>
                <Input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }} placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label>Duration (months)</Label>
                <div className="flex gap-2">
                  {["6", "12", "24", "36", "48", "60"].map(d => (
                    <Button key={d} variant={duration === d ? "default" : "outline"} size="sm" onClick={() => setDuration(d)} className="flex-1 text-xs">{d}</Button>
                  ))}
                </div>
              </div>
              {amount && parseInt(amount) > 0 && (
                <div className="p-4 rounded-xl bg-muted space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Rate</span><span className="font-medium">{rate}% p.a.</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Monthly EMI</span><span className="font-semibold text-primary">{formatCurrency(Math.round(emi))}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Interest</span><span>{formatCurrency(Math.round(totalInterest))}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Payable</span><span className="font-semibold">{formatCurrency(Math.round(totalPayable))}</span></div>
                </div>
              )}
              <Button onClick={handleApply} className="w-full"><Landmark className="h-4 w-4 mr-2" />Apply for Loan</Button>
              <p className="text-[11px] text-muted-foreground text-center">Max eligible: {formatCurrency(user.salary * 60)} (based on salary)</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base">Your Loans</CardTitle></CardHeader>
            <CardContent>
              {userLoans.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No loan applications yet</p>
              ) : (
                <div className="space-y-3">
                  {userLoans.map(l => (
                    <div key={l.id} className="p-4 rounded-xl border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{formatCurrency(l.amount)}</span>
                        <Badge className={statusColor(l.status)}>{l.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div><p>Duration</p><p className="font-medium text-foreground">{l.duration} mo</p></div>
                        <div><p>EMI</p><p className="font-medium text-foreground">{formatCurrency(l.emi)}</p></div>
                        <div><p>Rate</p><p className="font-medium text-foreground">{l.interestRate}%</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
