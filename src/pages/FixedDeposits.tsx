import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, calculateSimpleInterest, calculateCompoundInterest } from "@/lib/banking-utils";
import { PiggyBank, AlertCircle, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FixedDeposits() {
  const { user, fixedDeposits, openFD } = useAuth();
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("12");
  const [error, setError] = useState("");
  const [calcAmount, setCalcAmount] = useState("100000");
  const [calcRate, setCalcRate] = useState("7");
  const [calcYears, setCalcYears] = useState("1");
  const { toast } = useToast();

  if (!user) return null;

  const userFDs = fixedDeposits.filter(fd => fd.userId === user.id);
  const dur = parseInt(duration);
  const rate = dur >= 36 ? 7.5 : dur >= 24 ? 7.0 : dur >= 12 ? 6.5 : 5.5;
  const maturityAmount = amount ? Math.round(parseInt(amount) * Math.pow(1 + rate / (4 * 100), 4 * (dur / 12))) : 0;
  const interest = maturityAmount - parseInt(amount || "0");

  const handleOpenFD = () => {
    const val = parseInt(amount);
    if (!val || val <= 0) { setError("Enter a valid amount"); return; }
    const result = openFD(val, dur);
    if (!result.success) { setError(result.message); return; }
    setAmount(""); setError("");
    toast({ title: "FD opened successfully!" });
  };

  const si = calculateSimpleInterest(parseInt(calcAmount) || 0, parseFloat(calcRate) || 0, parseFloat(calcYears) || 0);
  const ci = calculateCompoundInterest(parseInt(calcAmount) || 0, parseFloat(calcRate) || 0, parseFloat(calcYears) || 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Fixed Deposits</h1>

        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open FD</TabsTrigger>
            <TabsTrigger value="my-fds">My FDs ({userFDs.length})</TabsTrigger>
            <TabsTrigger value="calculator">Interest Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-4">
            <Card className="shadow-sm max-w-lg">
              <CardContent className="pt-6 space-y-4">
                {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</div>}
                <div className="space-y-2"><Label>Deposit Amount (₹)</Label><Input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }} placeholder="Minimum ₹1,000" /></div>
                <div className="space-y-2">
                  <Label>Duration (months)</Label>
                  <div className="flex gap-2 flex-wrap">
                    {["6", "12", "24", "36", "48", "60"].map(d => (
                      <Button key={d} variant={duration === d ? "default" : "outline"} size="sm" onClick={() => setDuration(d)} className="text-xs">{d} mo</Button>
                    ))}
                  </div>
                </div>
                {amount && parseInt(amount) > 0 && (
                  <div className="p-4 rounded-xl bg-muted space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Rate</span><span className="font-medium">{rate}% p.a.</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Earned</span><span className="text-success font-medium">{formatCurrency(interest)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Maturity Amount</span><span className="font-bold text-primary">{formatCurrency(maturityAmount)}</span></div>
                  </div>
                )}
                <Button onClick={handleOpenFD} className="w-full"><PiggyBank className="h-4 w-4 mr-2" />Open Fixed Deposit</Button>
                <p className="text-[11px] text-muted-foreground text-center">Available balance: {formatCurrency(user.balance)}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-fds" className="mt-4">
            {userFDs.length === 0 ? (
              <Card className="shadow-sm"><CardContent className="py-12 text-center text-sm text-muted-foreground">No fixed deposits yet</CardContent></Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {userFDs.map(fd => (
                  <Card key={fd.id} className="shadow-sm">
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{formatCurrency(fd.amount)}</span>
                        <Badge className="bg-success/10 text-success">{fd.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><p className="text-muted-foreground">Duration</p><p className="font-medium">{fd.duration} months</p></div>
                        <div><p className="text-muted-foreground">Rate</p><p className="font-medium">{fd.interestRate}% p.a.</p></div>
                        <div><p className="text-muted-foreground">Maturity</p><p className="font-medium text-success">{formatCurrency(fd.maturityAmount)}</p></div>
                        <div><p className="text-muted-foreground">Matures On</p><p className="font-medium">{formatDate(fd.maturityDate)}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calculator" className="mt-4">
            <Card className="shadow-sm max-w-lg">
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Calculator className="h-4 w-4" />Interest Calculator</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Principal (₹)</Label><Input type="number" value={calcAmount} onChange={e => setCalcAmount(e.target.value)} /></div>
                  <div className="space-y-1"><Label className="text-xs">Rate (%)</Label><Input type="number" value={calcRate} onChange={e => setCalcRate(e.target.value)} step="0.1" /></div>
                  <div className="space-y-1"><Label className="text-xs">Years</Label><Input type="number" value={calcYears} onChange={e => setCalcYears(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-muted space-y-1">
                    <p className="text-xs text-muted-foreground">Simple Interest</p>
                    <p className="text-lg font-bold text-success">{formatCurrency(Math.round(si))}</p>
                    <p className="text-xs text-muted-foreground">Total: {formatCurrency(Math.round(parseInt(calcAmount || "0") + si))}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted space-y-1">
                    <p className="text-xs text-muted-foreground">Compound Interest</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(Math.round(ci))}</p>
                    <p className="text-xs text-muted-foreground">Total: {formatCurrency(Math.round(parseInt(calcAmount || "0") + ci))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
