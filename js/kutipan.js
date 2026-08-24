const kutipanElement = document.getElementById("kutipan-harian");
const statusKutipan = document.getElementById("status-kutipan");
const refreshKutipan = document.getElementById("refresh-kutipan");

async function ambilKutipan() {
  try {
    // Beri feedback bahwa request sedang berlangsung.
    statusKutipan.textContent = "Mengambil kutipan...";

    // Kirim request asynchronous ke endpoint API.
    const response = await fetch(
      "https://dummyjson.com/quotes/random"
    );

    // Hentikan alur normal jika HTTP response gagal.
    if (!response.ok) {
      throw new Error("Gagal mengambil kutipan.");
    }

    // Ubah response JSON menjadi object JavaScript.
    const data = await response.json();

    // Gunakan property yang sesuai dengan struktur response API.
    kutipanElement.textContent =
      `"${data.quote}" — ${data.author}`;

    statusKutipan.textContent = "";
  } catch (error) {
    // Tampilkan fallback agar kegagalan API tidak merusak UI.
    kutipanElement.textContent = "Kutipan tidak dapat dimuat.";
    statusKutipan.textContent = error.message;
  }
}
refreshKutipan.addEventListener("click", ambilKutipan);

export { ambilKutipan };
