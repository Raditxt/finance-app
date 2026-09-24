<script lang="ts">
  let amount = $state("");
  let type = $state("expense");
  let date = $state("");
  let errorMessage = $state("");
  let successMessage = $state("");

  // Validasi turunan (derived) — otomatis recalculate tiap kali amount/date berubah
  let isFormValid = $derived(Number(amount) > 0 && date !== "");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = "";
    successMessage = "";

    // Validasi client-side dulu, sebelum kirim ke server
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
        category_id: null,
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
  }
</script>

<form onsubmit={handleSubmit}>
  <div>
    <label for="amount">Jumlah</label>
    <input
      id="amount"
      type="number"
      bind:value={amount}
      min="1"
      step="1"
      onkeydown={(e) => {
        // Blokir karakter minus (-) dan notasi ilmiah (e/E) dari keyboard
        if (e.key === "-" || e.key === "e" || e.key === "E") {
          e.preventDefault();
        }
      }}
      required
    />
  </div>

  <div>
    <label for="type">Tipe</label>
    <select id="type" bind:value={type}>
      <option value="expense">Pengeluaran</option>
      <option value="income">Pemasukan</option>
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