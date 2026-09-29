<script lang="ts">
  import TransactionForm from "./TransactionForm.svelte";
  import TransactionList from "./TransactionList.svelte";
  import CategoryForm from "./CategoryForm.svelte";
  import { loadCategories } from "./categories.svelte";

  $effect(() => {
    loadCategories();
  });
</script>

<main>
  <h1>Finance Tracker</h1>
  <TransactionForm />
  <CategoryForm />
  <TransactionList />
</main>

<style>
  main {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
</style>