import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/banking-utils";
import { Users, Landmark, History, ShieldCheck, ShieldOff, Check, X, TrendingUp, TrendingDown } from "lucide-react";

export default function AdminDashboard() {
  const { users, transactions, loans, approveLoan, rejectLoan, blockUser, unblockUser } = useAuth();

  const customers = users.filter(u => u.role === "customer");
  const pendingLoans = loans.filter(l => l.status === "pending");
  const totalBalance = customers.reduce((s, u) => s + u.balance, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Customers</p><p className="text-2xl font-bold mt-1">{customers.length}</p></CardContent></Card>
          <Card className="shadow-sm"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Pending Loans</p><p className="text-2xl font-bold mt-1 text-warning">{pendingLoans.length}</p></CardContent></Card>
          <Card className="shadow-sm"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Deposits</p><p className="text-2xl font-bold mt-1">{formatCurrency(totalBalance)}</p></CardContent></Card>
          <Card className="shadow-sm"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Transactions</p><p className="text-2xl font-bold mt-1">{transactions.length}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users"><Users className="h-3.5 w-3.5 mr-1.5" />Users</TabsTrigger>
            <TabsTrigger value="loans"><Landmark className="h-3.5 w-3.5 mr-1.5" />Loans</TabsTrigger>
            <TabsTrigger value="transactions"><History className="h-3.5 w-3.5 mr-1.5" />Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {customers.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{u.fullName}</p>
                          {u.isBlocked && <Badge variant="destructive" className="text-[10px]">Blocked</Badge>}
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>A/C: {u.accountNumber}</span>
                          <span>Balance: {formatCurrency(u.balance)}</span>
                          <span>{u.email}</span>
                        </div>
                      </div>
                      <div>
                        {u.isBlocked ? (
                          <Button size="sm" variant="outline" onClick={() => unblockUser(u.id)}><ShieldCheck className="h-3.5 w-3.5 mr-1" />Unblock</Button>
                        ) : (
                          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => blockUser(u.id)}><ShieldOff className="h-3.5 w-3.5 mr-1" />Block</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="pt-4">
                {loans.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No loan applications</p>
                ) : (
                  <div className="space-y-3">
                    {loans.map(l => (
                      <div key={l.id} className="flex items-center justify-between p-4 rounded-xl border">
                        <div className="space-y-1">
                          <p className="font-medium">{l.userName}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{formatCurrency(l.amount)}</span>
                            <span>{l.duration} months</span>
                            <span>EMI: {formatCurrency(l.emi)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {l.status === "pending" ? (
                            <>
                              <Button size="sm" onClick={() => approveLoan(l.id)} className="bg-success hover:bg-success/90"><Check className="h-3.5 w-3.5 mr-1" />Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => rejectLoan(l.id)}><X className="h-3.5 w-3.5 mr-1" />Reject</Button>
                            </>
                          ) : (
                            <Badge className={l.status === "approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>{l.status}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="pt-4">
                <div className="space-y-1">
                  {transactions.slice(0, 20).map(t => {
                    const txUser = users.find(u => u.id === t.userId);
                    return (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`h-7 w-7 rounded-md flex items-center justify-center ${t.type === "deposit" || t.type === "loan_disbursement" ? "bg-success/10" : "bg-destructive/10"}`}>
                            {t.type === "deposit" || t.type === "loan_disbursement" ? <TrendingUp className="h-3.5 w-3.5 text-success" /> : <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{txUser?.fullName} — {t.description}</p>
                            <p className="text-[10px] text-muted-foreground">{formatDate(t.date)}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold tabular-nums ${t.type === "deposit" || t.type === "loan_disbursement" ? "text-success" : "text-destructive"}`}>
                          {t.type === "deposit" || t.type === "loan_disbursement" ? "+" : "-"}{formatCurrency(t.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
