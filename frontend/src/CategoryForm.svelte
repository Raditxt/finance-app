<script lang="ts">
  import { loadCategories } from "./categories.svelte";

  let name = $state("");
  let type = $state("expense");
  let errorMessage = $state("");

  let isFormValid = $derived(name.trim().length > 0);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = "";

    const response = await fetch("http://localhost:3000/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), type }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage = data.error;
      return;
    }

    name = "";
    await loadCategories(); // refresh daftar kategori supaya dropdown ikut update
  }
</script>

<form onsubmit={handleSubmit}>
  <div>
    <label for="category-name">Kategori baru</label>
    <input id="category-name" type="text" bind:value={name} />
  </div>

  <div>
    <label for="category-type">Tipe</label>
    <select id="category-type" bind:value={type}>
      <option value="expense">Pengeluaran</option>
      <option value="income">Pemasukan</option>
    </select>
  </div>

  <button type="submit" disabled={!isFormValid}>Tambah Kategori</button>

  {#if errorMessage}
    <p style="color: red">{errorMessage}</p>
  {/if}
</form>