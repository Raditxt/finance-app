<script lang="ts">
  import { categoryStore } from "./categories.svelte";
  import { loadTransactions } from "./transactions.svelte";
  import { editState } from "./editState.svelte";

  let amount = $state("");
  let type = $state("expense");
  let categoryId = $state("");
  let date = $state("");
  let errorMessage = $state("");
  let successMessage = $state("");

  // Setiap kali editState.current berubah (user klik baris di list),
  // isi ulang form dengan data transaksi itu
  $effect(() => {
    const editing = editState.current;
    if (editing) {
      amount = String(editing.amount);
      type = editing.type;
      categoryId = editing.category_id === null ? "" : String(editing.category_id);
      date = editing.date;
    }
  });

  function handleAmountInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const digitsOnly = target.value.replace(/\D/g, "");
    amount = digitsOnly;
    target.value = digitsOnly === "" ? "" : Number(digitsOnly).toLocaleString("id-ID");
  }

  let filteredCategories = $derived(
    categoryStore.items.filter((c) => c.type === type)
  );

  let isFormValid = $derived(Number(amount) > 0 && date !== "");

  function resetForm() {
    amount = "";
    date = "";
    categoryId = "";
    type = "expense";
    editState.current = null;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = "";
    successMessage = "";

    if (Number(amount) <= 0) {
      errorMessage = "Jumlah harus lebih dari 0";
      return;
    }
    if (date === "") {
      errorMessage = "Tanggal wajib diisi";
      return;
    }

    const isEditing = editState.current !== null;
    const url = isEditing
      ? `http://localhost:3000/transactions/${editState.current!.id}`
      : "http://localhost:3000/transactions";
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        type,
        category_id: categoryId === "" ? null : Number(categoryId),
        date,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage = data.error;
      return;
    }

    successMessage = isEditing
      ? `Transaksi diperbarui (id: ${data.id})`
      : `Transaksi tersimpan (id: ${data.id})`;

    resetForm();
    await loadTransactions(); // refresh list supaya perubahan langsung kelihatan
  }
</script>

<form onsubmit={handleSubmit}>
  <h2>{editState.current ? "Edit Transaksi" : "Tambah Transaksi"}</h2>

  <div>
    <label for="amount">Jumlah</label>
    <input
      id="amount"
      type="text"
      inputmode="numeric"
      value={amount === "" ? "" : Number(amount).toLocaleString("id-ID")}
      oninput={handleAmountInput}
      placeholder="0"
      required
    />
  </div>

  <div>
    <label for="type">Tipe</label>
    <select id="type" bind:value={type} onchange={() => (categoryId = "")}>
      <option value="expense">Pengeluaran</option>
      <option value="income">Pemasukan</option>
    </select>
  </div>

  <div>
    <label for="category">Kategori</label>
    <select id="category" bind:value={categoryId}>
      <option value="">Tanpa kategori</option>
      {#each filteredCategories as c (c.id)}
        <option value={c.id}>{c.name}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="date">Tanggal</label>
    <input id="date" type="date" bind:value={date} required />
  </div>

  <button type="submit" disabled={!isFormValid}>
    {editState.current ? "Perbarui" : "Simpan"}
  </button>

  {#if editState.current}
    <button type="button" onclick={resetForm}>Batal Edit</button>
  {/if}

  {#if errorMessage}
    <p style="color: red">{errorMessage}</p>
  {/if}

  {#if successMessage}
    <p style="color: green">{successMessage}</p>
  {/if}
</form>