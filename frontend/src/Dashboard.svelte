<script lang="ts">
  import { summaryStore, loadSummary } from "./summary.svelte";
  import { transactionStore } from "./transactions.svelte";

  const percentFormat = new Intl.NumberFormat("id-ID", {
    style: "percent",
    maximumFractionDigits: 2,
  });

  function formatRate(rate: number | null): string {
    return rate === null ? "-" : percentFormat.format(rate);
  }

  // Bulan berjalan di zona waktu lokal (bukan UTC), format YYYY-MM
  function currentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  let month = $state(currentMonth());

  $effect(() => {
    void transactionStore.items; // dibaca supaya efek ini jalan ulang saat transaksi berubah
    loadSummary(month);
  });
</script>

<section class="dashboard">
  <h2>Ringkasan Bulanan</h2>

  <div class="month-picker">
    <label for="summary-month">Bulan</label>
    <input id="summary-month" type="month" bind:value={month} />
  </div>

  {#if summaryStore.error}
    <p style="color: red">{summaryStore.error}</p>
  {:else if summaryStore.data}
    <p>Savings rate ({summaryStore.data.month})</p>
    <p class="rate">{formatRate(summaryStore.data.savings_rate)}</p>

    {#if summaryStore.data.savings_rate === null}
      <p>Belum ada pemasukan di bulan ini, jadi savings rate belum bisa dihitung.</p>
    {/if}
  {:else}
    <p>Memuat...</p>
  {/if}
</section>