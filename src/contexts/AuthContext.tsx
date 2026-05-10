import React, { createContext, useContext, useState, useCallback } from "react";
import { generateAccountNumber } from "@/lib/banking-utils";

export interface User {
  id: string;
  accountNumber: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  pan: string;
  aadhaar: string;
  occupation: string;
  salary: number;
  balance: number;
  role: "customer" | "admin";
  isBlocked: boolean;
  failedAttempts: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "loan_disbursement" | "emi_payment" | "fd_investment";
  amount: number;
  balance: number;
  description: string;
  date: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  duration: number;
  emi: number;
  interestRate: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

export interface FixedDeposit {
  id: string;
  userId: string;
  amount: number;
  duration: number;
  interestRate: number;
  maturityAmount: number;
  startDate: string;
  maturityDate: string;
  status: "active" | "matured";
}

interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
  date: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  transactions: Transaction[];
  loans: Loan[];
  fixedDeposits: FixedDeposit[];
  notifications: Notification[];
  login: (accountNumber: string, password: string) => { success: boolean; message: string };
  register: (data: Omit<User, "id" | "accountNumber" | "balance" | "role" | "isBlocked" | "failedAttempts" | "createdAt">, password: string) => { success: boolean; accountNumber: string };
  logout: () => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => { success: boolean; message: string };
  applyLoan: (amount: number, duration: number) => void;
  approveLoan: (loanId: string) => void;
  rejectLoan: (loanId: string) => void;
  openFD: (amount: number, duration: number) => { success: boolean; message: string };
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  markNotificationRead: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_PASSWORD = "Demo@1234";

const initialUsers: User[] = [
  {
    id: "1", accountNumber: "202500000001", fullName: "Arjun Mehta", email: "arjun@demo.com",
    phone: "9876543210", age: 32, gender: "Male", address: "12 MG Road, Mumbai",
    pan: "ABCDE1234F", aadhaar: "123456789012", occupation: "Software Engineer", salary: 120000,
    balance: 485000, role: "customer", isBlocked: false, failedAttempts: 0, createdAt: "2024-08-15",
  },
  {
    id: "2", accountNumber: "202500000002", fullName: "Priya Sharma", email: "priya@demo.com",
    phone: "9876543211", age: 28, gender: "Female", address: "45 Nehru Nagar, Delhi",
    pan: "FGHIJ5678K", aadhaar: "234567890123", occupation: "Doctor", salary: 180000,
    balance: 920000, role: "customer", isBlocked: false, failedAttempts: 0, createdAt: "2024-06-20",
  },
  {
    id: "admin", accountNumber: "100000000001", fullName: "Admin User", email: "admin@finovabank.com",
    phone: "9000000000", age: 40, gender: "Male", address: "HQ, Mumbai",
    pan: "ADMIN0000A", aadhaar: "000000000000", occupation: "Bank Manager", salary: 250000,
    balance: 0, role: "admin", isBlocked: false, failedAttempts: 0, createdAt: "2024-01-01",
  },
];

const initialTransactions: Transaction[] = [
  { id: "t1", userId: "1", type: "deposit", amount: 250000, balance: 250000, description: "Initial deposit", date: "2024-08-15" },
  { id: "t2", userId: "1", type: "deposit", amount: 300000, balance: 550000, description: "Salary credit — Aug", date: "2024-09-01" },
  { id: "t3", userId: "1", type: "withdrawal", amount: 45000, balance: 505000, description: "Rent payment", date: "2024-09-05" },
  { id: "t4", userId: "1", type: "withdrawal", amount: 20000, balance: 485000, description: "Shopping", date: "2024-09-12" },
  { id: "t5", userId: "2", type: "deposit", amount: 500000, balance: 500000, description: "Initial deposit", date: "2024-06-20" },
  { id: "t6", userId: "2", type: "deposit", amount: 420000, balance: 920000, description: "Salary credit — Sep", date: "2024-09-01" },
];

const initialLoans: Loan[] = [
  { id: "l1", userId: "2", userName: "Priya Sharma", amount: 500000, duration: 24, emi: 23072, interestRate: 10.5, status: "pending", appliedDate: "2025-03-10" },
];

const initialFDs: FixedDeposit[] = [];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>(initialFDs);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [passwords] = useState<Record<string, string>>({
    "202500000001": DEMO_PASSWORD,
    "202500000002": DEMO_PASSWORD,
    "100000000001": "Admin@1234",
  });

  const addNotification = useCallback((userId: string, message: string, type: "info" | "success" | "warning" = "info") => {
    setNotifications(prev => [{ id: Date.now().toString(), userId, message, type, read: false, date: new Date().toISOString() }, ...prev]);
  }, []);

  const login = useCallback((accountNumber: string, password: string) => {
    const found = users.find(u => u.accountNumber === accountNumber);
    if (!found) return { success: false, message: "Account not found" };
    if (found.isBlocked) return { success: false, message: "Account is locked. Contact admin." };
    if (passwords[accountNumber] !== password) {
      const updated = users.map(u => u.accountNumber === accountNumber ? { ...u, failedAttempts: u.failedAttempts + 1, isBlocked: u.failedAttempts + 1 >= 3 } : u);
      setUsers(updated);
      const attempts = (found.failedAttempts + 1);
      if (attempts >= 3) return { success: false, message: "Account locked after 3 failed attempts" };
      return { success: false, message: `Invalid password. ${3 - attempts} attempt(s) remaining` };
    }
    setUsers(prev => prev.map(u => u.accountNumber === accountNumber ? { ...u, failedAttempts: 0 } : u));
    setUser({ ...found, failedAttempts: 0 });
    return { success: true, message: "Login successful" };
  }, [users, passwords]);

  const register = useCallback((data: any, password: string) => {
    const accountNumber = generateAccountNumber();
    const newUser: User = {
      id: Date.now().toString(), accountNumber, ...data, balance: 0, role: "customer",
      isBlocked: false, failedAttempts: 0, createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers(prev => [...prev, newUser]);
    (passwords as any)[accountNumber] = password;
    addNotification(newUser.id, "Welcome to Finova Bank! Your account has been created.", "success");
    return { success: true, accountNumber };
  }, [passwords, addNotification]);

  const logout = useCallback(() => setUser(null), []);

  const deposit = useCallback((amount: number) => {
    if (!user) return;
    const newBalance = user.balance + amount;
    setUser(prev => prev ? { ...prev, balance: newBalance } : null);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: newBalance } : u));
    setTransactions(prev => [{ id: Date.now().toString(), userId: user.id, type: "deposit", amount, balance: newBalance, description: "Cash deposit", date: new Date().toISOString() }, ...prev]);
    addNotification(user.id, `₹${amount.toLocaleString("en-IN")} deposited successfully`, "success");
  }, [user, addNotification]);

  const withdraw = useCallback((amount: number) => {
    if (!user) return { success: false, message: "Not logged in" };
    if (amount > user.balance) return { success: false, message: "Insufficient balance" };
    const newBalance = user.balance - amount;
    setUser(prev => prev ? { ...prev, balance: newBalance } : null);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: newBalance } : u));
    setTransactions(prev => [{ id: Date.now().toString(), userId: user.id, type: "withdrawal", amount, balance: newBalance, description: "Cash withdrawal", date: new Date().toISOString() }, ...prev]);
    addNotification(user.id, `₹${amount.toLocaleString("en-IN")} withdrawn successfully`, "info");
    return { success: true, message: "Withdrawal successful" };
  }, [user, addNotification]);

  const applyLoan = useCallback((amount: number, duration: number) => {
    if (!user) return;
    const rate = 10.5;
    const r = rate / 12 / 100;
    const emi = Math.round((amount * r * Math.pow(1 + r, duration)) / (Math.pow(1 + r, duration) - 1));
    setLoans(prev => [...prev, { id: Date.now().toString(), userId: user.id, userName: user.fullName, amount, duration, emi, interestRate: rate, status: "pending", appliedDate: new Date().toISOString().split("T")[0] }]);
    addNotification(user.id, "Loan application submitted. You'll be notified once reviewed.", "info");
  }, [user, addNotification]);

  const approveLoan = useCallback((loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: "approved" } : l));
    const target = users.find(u => u.id === loan.userId);
    if (target) {
      const newBalance = target.balance + loan.amount;
      setUsers(prev => prev.map(u => u.id === loan.userId ? { ...u, balance: newBalance } : u));
      if (user?.id === loan.userId) setUser(prev => prev ? { ...prev, balance: newBalance } : null);
      setTransactions(prev => [{ id: Date.now().toString(), userId: loan.userId, type: "loan_disbursement", amount: loan.amount, balance: newBalance, description: `Loan disbursement — ${loanId}`, date: new Date().toISOString() }, ...prev]);
      addNotification(loan.userId, `Your loan of ₹${loan.amount.toLocaleString("en-IN")} has been approved!`, "success");
    }
  }, [loans, users, user, addNotification]);

  const rejectLoan = useCallback((loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: "rejected" } : l));
    if (loan) addNotification(loan.userId, "Your loan application has been rejected.", "warning");
  }, [loans, addNotification]);

  const openFD = useCallback((amount: number, duration: number) => {
    if (!user) return { success: false, message: "Not logged in" };
    if (amount > user.balance) return { success: false, message: "Insufficient balance" };
    const rate = duration >= 36 ? 7.5 : duration >= 24 ? 7.0 : duration >= 12 ? 6.5 : 5.5;
    const maturityAmount = Math.round(amount * Math.pow(1 + rate / (4 * 100), 4 * (duration / 12)));
    const start = new Date();
    const maturity = new Date(start);
    maturity.setMonth(maturity.getMonth() + duration);
    const newBalance = user.balance - amount;
    setUser(prev => prev ? { ...prev, balance: newBalance } : null);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: newBalance } : u));
    setFixedDeposits(prev => [...prev, { id: Date.now().toString(), userId: user.id, amount, duration, interestRate: rate, maturityAmount, startDate: start.toISOString().split("T")[0], maturityDate: maturity.toISOString().split("T")[0], status: "active" }]);
    setTransactions(prev => [{ id: Date.now().toString(), userId: user.id, type: "fd_investment", amount, balance: newBalance, description: `FD opened — ${duration} months`, date: new Date().toISOString() }, ...prev]);
    addNotification(user.id, `Fixed Deposit of ₹${amount.toLocaleString("en-IN")} opened for ${duration} months`, "success");
    return { success: true, message: "FD opened successfully" };
  }, [user, addNotification]);

  const blockUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: true } : u));
    addNotification(userId, "Your account has been blocked by admin.", "warning");
  }, [addNotification]);

  const unblockUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: false, failedAttempts: 0 } : u));
    addNotification(userId, "Your account has been unblocked.", "success");
  }, [addNotification]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <AuthContext.Provider value={{ user, users, transactions, loans, fixedDeposits, notifications, login, register, logout, deposit, withdraw, applyLoan, approveLoan, rejectLoan, openFD, blockUser, unblockUser, markNotificationRead }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
