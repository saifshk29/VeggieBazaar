import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format a date to readable format
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate a random ID for local operations
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Format status from backend to frontend display format
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    delivered: "Delivered",
  };
  
  return statusMap[status] || status;
}

// Get CSS class for status pill
export function getStatusPillClass(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "status-pill-pending",
    in_progress: "status-pill-progress",
    delivered: "status-pill-delivered",
  };
  
  return statusMap[status] || "status-pill-pending";
}
