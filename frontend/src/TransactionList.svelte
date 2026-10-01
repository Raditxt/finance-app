<script lang="ts">
  import { transactionStore, loadTransactions, deleteTransaction } from "./transactions.svelte";
  import { editState } from "./editState.svelte";

  let loading = $state(true);
  let deleteError = $state("");

  $effect(() => {
    loadTransactions().then(() => {
      loading = false;
    });
  });

  function startEdit(t: (typeof transactionStore.items)[number]) {
    editState.current = t;
  }

  async function handleDelete(e: MouseEvent, id: number) {
    e.stopPropagation(); // supaya klik tombol hapus nggak ikut nge-trigger startEdit dari <tr>

    const confirmed = confirm("Yakin mau hapus transaksi ini?");
    if (!confirmed) return;

    deleteError = "";
    try {
      await deleteTransaction(id);
      if (editState.current?.id === id) {
        editState.current = null; // kalau yang dihapus lagi di-edit, batalkan mode edit
      }
    } catch (err) {
      deleteError = err instanceof Error ? err.message : "Gagal menghapus transaksi";
    }
  }
</script>

<div>
  <h2>Riwayat Transaksi</h2>

  {#if deleteError}
    <p style="color: red">{deleteError}</p>
  {/if}

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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each transactionStore.items as t (t.id)}
          <tr onclick={() => startEdit(t)} style="cursor: pointer">
            <td>{t.date}</td>
            <td>{t.type}</td>
            <td>{t.amount.toLocaleString("id-ID")}</td>
            <td>
              <button type="button" onclick={(e) => handleDelete(e, t.id)}>Hapus</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>