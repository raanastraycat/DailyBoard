export function validasiInput(nilai) {
  // rapikan input dengan menghapus spasi di awal dan akhir.
  const teks = nilai.trim();

  // tolak input kosong
  if (teks === "") {
    alert("Input tidak boleh kosong!");
    return false;
  }

  // batasi panjang input
  if (teks.length > 100) {
    alert("Input maksimal 100 karakter!");
    return false;
  }

  // lolos validasi
  return true;
}

// DEBOUNCE:
export function debounce(callback, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
