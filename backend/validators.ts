// Kumpulan fungsi validasi kecil, dipakai berulang di berbagai endpoint

export function validateAmount(amount: unknown): string | null {
  if (typeof amount !== "number" || amount <= 0) {
    return "amount harus berupa angka lebih dari 0";
  }
  return null; // null artinya valid, nggak ada error
}

export function validateTransactionType(type: unknown): string | null {
  if (type !== "income" && type !== "expense") {
    return "type harus 'income' atau 'expense'";
  }
  return null;
}

export function validateDate(date: unknown): string | null {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "date harus dalam format YYYY-MM-DD";
  }
  return null;
}