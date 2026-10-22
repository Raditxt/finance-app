export type Summary = {
  month: string;
  total_income: number;
  total_expense: number;
  savings: number;
  savings_rate: number | null; // null = income 0, rate nggak terdefinisi
};

export const summaryStore = $state<{ data: Summary | null; error: string }>({
  data: null,
  error: "",
});

let latestRequest = 0;

export async function loadSummary(month: string) {
  const requestId = ++latestRequest;

  try {
    const response = await fetch(
      `http://localhost:3000/summary?month=${encodeURIComponent(month)}`
    );
    const data = await response.json();

    // Sudah ada request yang lebih baru? Abaikan hasil request lama ini.
    if (requestId !== latestRequest) return;

    if (!response.ok) {
      summaryStore.error = data.error ?? "Gagal memuat ringkasan";
      summaryStore.data = null;
      return;
    }

    summaryStore.error = "";
    summaryStore.data = data;
  } catch {
    if (requestId !== latestRequest) return;
    summaryStore.error = "Gagal memuat ringkasan. Pastikan server backend berjalan.";
    summaryStore.data = null;
  }
}