import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/banking-utils";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine, ArrowUpFromLine, History, Landmark, PiggyBank, FileText,
  TrendingUp, TrendingDown, Wallet, IndianRupee,
} from "lucide-react";

export default function Dashboard() {
  const { user, transactions, loans, fixedDeposits } = useAuth();
  if (!user) return null;

  const userTxns = transactions.filter(t => t.userId === user.id).slice(0, 5);
  const activeLoans = loans.filter(l => l.userId === user.id && l.status === "approved");
  const activeFDs = fixedDeposits.filter(fd => fd.userId === user.id && fd.status === "active");
  const totalDeposited = transactions.filter(t => t.userId === user.id && t.type === "deposit").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter(t => t.userId === user.id && t.type === "withdrawal").reduce((s, t) => s + t.amount, 0);

  const quickActions = [
    { label: "Deposit", icon: ArrowDownToLine, to: "/deposit", color: "text-success" },
    { label: "Withdraw", icon: ArrowUpFromLine, to: "/withdraw", color: "text-warning" },
    { label: "History", icon: History, to: "/transactions", color: "text-primary" },
    { label: "Loans", icon: Landmark, to: "/loans", color: "text-primary" },
    { label: "Fixed Deposit", icon: PiggyBank, to: "/fixed-deposits", color: "text-success" },
    { label: "Statement", icon: FileText, to: "/statement", color: "text-muted-foreground" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Account overview & quick actions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: "0.1s" }}>
          <Card className="animate-fade-in shadow-md border-0 bg-primary text-primary-foreground">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-80">Available Balance</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(user.balance)}</p>
                  <p className="text-[11px] opacity-60 mt-1">A/C: {user.accountNumber}</p>
                </div>
                <Wallet className="h-8 w-8 opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in shadow-sm" style={{ animationDelay: "0.15s" }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Deposited</p>
                  <p className="text-xl font-bold mt-1 text-success">{formatCurrency(totalDeposited)}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-success/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in shadow-sm" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-5">
              <div>
                <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                <p className="text-xl font-bold mt-1 text-destructive">{formatCurrency(totalWithdrawn)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in shadow-sm" style={{ animationDelay: "0.25s" }}>
            <CardContent className="p-5">
              <div>
                <p className="text-xs text-muted-foreground">Active Loans</p>
                <p className="text-xl font-bold mt-1">{activeLoans.length}</p>
                <p className="text-xs text-muted-foreground mt-1">FDs: {activeFDs.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in shadow-sm" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {quickActions.map(a => (
                <Link key={a.label} to={a.to}>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                      <a.icon className={`h-5 w-5 ${a.color}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="animate-fade-in shadow-sm" style={{ animationDelay: "0.35s" }}>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <Link to="/transactions"><Button variant="ghost" size="sm" className="text-xs">View All</Button></Link>
          </CardHeader>
          <CardContent>
            {userTxns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No transactions yet. Make a deposit to get started.</p>
            ) : (
              <div className="space-y-2">
                {userTxns.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === "deposit" || t.type === "loan_disbursement" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {t.type === "deposit" || t.type === "loan_disbursement" ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.description}</p>
                        <p className="text-[11px] text-muted-foreground">{formatDate(t.date)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold tabular-nums ${t.type === "deposit" || t.type === "loan_disbursement" ? "text-success" : "text-destructive"}`}>
                      {t.type === "deposit" || t.type === "loan_disbursement" ? "+" : "-"}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
