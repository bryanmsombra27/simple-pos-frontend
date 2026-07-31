import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class BlockChain {
  static currency(total: number) {
    return Intl.NumberFormat("es-MX", {
      currency: "MXN",
      style: "currency",
      minimumFractionDigits: 2,
    }).format(total);
  }

  static date(date: string) {
    const dateFormat = new Date(date);
    return Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(dateFormat);
  }
}
