export type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
};

export const categoryStore = $state<{ items: Category[] }>({ items: [] });

export async function loadCategories() {
  const response = await fetch("http://localhost:3000/categories");
  categoryStore.items = await response.json();
}