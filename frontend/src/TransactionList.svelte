<script lang="ts">
  type Transaction = {
    id: number;
    amount: number;
    type: "income" | "expense";
    category_id: number | null;
    date: string;
  };

  let transactions = $state<Transaction[]>([]);
  let loading = $state(true);

  async function loadTransactions() {
    loading = true;
    const response = await fetch("http://localhost:3000/transactions");
    transactions = await response.json();
    loading = false;
  }

  $effect(() => {
    loadTransactions();
  });
</script>

<div>
  <h2>Riwayat Transaksi</h2>

  {#if loading}
    <p>Memuat...</p>
  {:else if transactions.length === 0}
    <p>Belum ada transaksi.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Tipe</th>
          <th>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {#each transactions as t (t.id)}
          <tr>
            <td>{t.date}</td>
            <td>{t.type}</td>
            <td>{t.amount.toLocaleString("id-ID")}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>