<script lang="ts">
  import { categoryStore } from "./categories.svelte";

  let amount = $state(""); // nilai mentah, cuma digit, misal "50000"
  let type = $state("expense");
  let categoryId = $state("");
  let date = $state("");
  let errorMessage = $state("");
  let successMessage = $state("");

  function handleAmountInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const digitsOnly = target.value.replace(/\D/g, "");
    amount = digitsOnly;

    // Paksa update tampilan langsung ke elemen DOM,
    // supaya nggak bergantung ke Svelte mendeteksi "perubahan"
    target.value =
      digitsOnly === ""
        ? ""
        : Number(digitsOnly).toLocaleString("id-ID");
  }

  // Dropdown cuma nampilin kategori yang tipenya sama dengan tipe transaksi
  let filteredCategories = $derived(
    categoryStore.items.filter((c) => c.type === type)
  );

  let isFormValid = $derived(Number(amount) > 0 && date !== "");

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

    const response = await fetch("http://localhost:3000/transactions", {
      method: "POST",
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

    successMessage = `Transaksi tersimpan (id: ${data.id})`;
    amount = "";
    date = "";
    categoryId = "";
  }
</script>

<form onsubmit={handleSubmit}>
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

  <button type="submit" disabled={!isFormValid}>Simpan</button>

  {#if errorMessage}
    <p style="color: red">{errorMessage}</p>
  {/if}

  {#if successMessage}
    <p style="color: green">{successMessage}</p>
  {/if}
</form>