import { useNavigate } from "react-router-dom";
import { Shield, Users, ArrowRight } from "lucide-react";
import finovaLogo from "@/assets/finova-logo.png";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl animate-fade-in text-center">
        <img src={finovaLogo} alt="Finova Bank" className="h-24 w-auto mx-auto mb-5" />
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2" style={{ lineHeight: "1.1" }}>
          Finova Bank
        </h1>
        <p className="text-muted-foreground mb-10">
          Select your role to continue
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto">
          <button
            onClick={() => navigate("/login/customer")}
            className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Customer</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access your account, deposits, loans & more
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </button>

          <button
            onClick={() => navigate("/login/admin")}
            className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/80 text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Administrator</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage users, approve loans & monitor activity
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Secure • Reliable • Trusted Banking
        </p>
      </div>
    </div>
  );
}