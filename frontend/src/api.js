export const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
export const classes = ["I", "II", "III", "IV", "V", "VI"].flatMap((x) => [
  `${x} A`,
  `${x} B`,
]);
export async function api(action, payload = {}, token = "") {
  const url = import.meta.env.VITE_API_URL;
  if (!url)
    throw new Error(
      "Koneksi sekolah belum dikonfigurasi. Guru perlu memasang URL backend terlebih dahulu.",
    );
  if (action === "submitJournal" || action === "updateJournal") {
    const key = `7kaih:${payload.tanggal}:${payload.kelas}:${payload.absen}`;
    let editKey = sessionStorage.getItem(key);
    if (!editKey) {
      editKey = Array.from(crypto.getRandomValues(new Uint8Array(32)), (x) =>
        x.toString(16).padStart(2, "0"),
      ).join("");
      sessionStorage.setItem(key, editKey);
    }
    payload = { ...payload, editKey };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload, token }),
      signal: controller.signal,
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Permintaan gagal.");
    return data.data;
  } catch (e) {
    if (e.name === "AbortError")
      throw new Error(
        "Konfirmasi belum diterima. Coba kirim kembali dengan identitas yang sama; jurnal tidak akan digandakan.",
      );
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
export function readPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      return reject(new Error("Gunakan foto JPG, PNG, atau WebP."));
    if (file.size > 1.5 * 1024 * 1024)
      return reject(new Error("Ukuran foto maksimal 1,5 MB."));
    const r = new FileReader();
    r.onerror = () => reject(new Error("Foto tidak terbaca."));
    r.onload = () => resolve({ mime: file.type, data: r.result.split(",")[1] });
    r.readAsDataURL(file);
  });
}
