<script lang="ts">
  import { transactionStore, loadTransactions } from "./transactions.svelte";
  import { editState } from "./editState.svelte";

  let loading = $state(true);

  $effect(() => {
    loadTransactions().then(() => {
      loading = false;
    });
  });

  function startEdit(t: (typeof transactionStore.items)[number]) {
    editState.current = t;
  }
</script>

<div>
  <h2>Riwayat Transaksi</h2>

  {#if loading}
    <p>Memuat...</p>
  {:else if transactionStore.items.length === 0}
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
        {#each transactionStore.items as t (t.id)}
          <tr onclick={() => startEdit(t)} style="cursor: pointer">
            <td>{t.date}</td>
            <td>{t.type}</td>
            <td>{t.amount.toLocaleString("id-ID")}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>