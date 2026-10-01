export type Transaction = {
  id: number;
  amount: number;
  type: "income" | "expense";
  category_id: number | null;
  date: string;
};

// Payload untuk create/update (tanpa id, karena id di-generate backend)
export type TransactionInput = Omit<Transaction, "id">;

export const transactionStore = $state<{ items: Transaction[] }>({ items: [] });

export async function loadTransactions() {
  const response = await fetch("http://localhost:3000/transactions");
  transactionStore.items = await response.json();
}

export async function createTransaction(input: TransactionInput) {
  const response = await fetch("http://localhost:3000/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  await loadTransactions();
  return await response.json();
}

export async function updateTransaction(id: number, input: TransactionInput) {
  const response = await fetch(`http://localhost:3000/transactions/${id}`, {
    method: "PUT", // atau "PATCH" tergantung backend kamu
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  await loadTransactions();
  return await response.json();
}

export async function deleteTransaction(id: number) {
  const response = await fetch(`http://localhost:3000/transactions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  await loadTransactions();
}