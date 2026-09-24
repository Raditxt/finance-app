<script lang="ts">
  import TransactionForm from "./TransactionForm.svelte";
  import TransactionList from "./TransactionList.svelte";
</script>

<main>
  <h1>Finance Tracker</h1>
  <TransactionForm />
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