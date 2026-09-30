import type { Transaction } from "./transactions.svelte";

// null = mode tambah baru, ada isinya = mode edit
export const editState = $state<{ current: Transaction | null }>({ current: null });