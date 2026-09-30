export type Transaction = {
  id: number;
  amount: number;
  type: "income" | "expense";
  category_id: number | null;
  date: string;
};

export const transactionStore = $state<{ items: Transaction[] }>({ items: [] });

export async function loadTransactions() {
  const response = await fetch("http://localhost:3000/transactions");
  transactionStore.items = await response.json();
}