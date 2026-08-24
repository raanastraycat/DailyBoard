import { validasiInput, debounce } from "./utils.js";

// DATA & STATE

let daftarTugas = [
  { id: 1, nama: "Belajar JavaScript", selesai: false },
  { id: 2, nama: "Olahraga pagi", selesai: false }
];

let nextId = 3;
let filterAktif = "semua";
let kataKunciPencarian = "";
let tugasYangSedangDiDrag = null;
let clickTimer = null;

// DOM ELEMENT

const formTugas = document.getElementById("form-tugas");
const inputTugas = document.getElementById("input-tugas");
const daftarTugasElement = document.getElementById("daftar-tugas");
const tombolFilter = document.querySelectorAll("[data-filter]");
const inputPencarian = document.getElementById("cari-tugas");

// STORAGE

// FLOW SIMPAN: array tugas -> JSON string -> localStorage.
function simpanTugasKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

// FLOW MUAT: localStorage -> JSON -> array tugas.
function muatTugasDariStorage() {
  const data = localStorage.getItem("daftarTugas");

  if (!data) return;

  try {
    daftarTugas = JSON.parse(data);

    // Setelah data dimuat, cari ID terbesar agar ID baru tidak bentrok.
    if (daftarTugas.length > 0) {
      nextId = Math.max(...daftarTugas.map(tugas => tugas.id)) + 1;
    }
  } catch {
    // Jika data storage rusak, gunakan array kosong.
    daftarTugas = [];
  }
}

// RENDER

// FLOW RENDER:
// kosongkan list -> filter status & pencarian -> buat element -> pasang event.
function renderTugas() {
  daftarTugasElement.innerHTML = "";

  const tugasTersaring = daftarTugas.filter(tugas => {
    // FLOW FILTER: tentukan apakah status tugas sesuai filter aktif.
    const cocokStatus =
      filterAktif === "semua" ||
      (filterAktif === "selesai" && tugas.selesai) ||
      (filterAktif === "belum" && !tugas.selesai);

    // FLOW SEARCH: cocokkan nama tugas dengan kata kunci.
    const cocokPencarian =
      tugas.nama.toLowerCase().includes(kataKunciPencarian);

    return cocokStatus && cocokPencarian;
  });

  tugasTersaring.forEach(tugas => {
    const li = document.createElement("li");
    li.className = "tugas-item";
    li.dataset.id = tugas.id;
    li.draggable = true;

    const nama = document.createElement("span");
    nama.className = "tugas-nama";
    nama.textContent = tugas.nama;
    nama.title = "Klik untuk selesai, double click untuk edit";

    if (tugas.selesai) {
      nama.classList.add("tugas-selesai");
    }

    // FLOW KLIK: tunggu sebentar untuk membedakan click dan double click.
    nama.addEventListener("click", () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        return;
      }

      clickTimer = setTimeout(() => {
        toggleSelesai(tugas.id);
        clickTimer = null;
      }, 250);
    });

    // FLOW DOUBLE CLICK: batalkan click tertunda -> edit tugas.
    nama.addEventListener("dblclick", () => {
      clearTimeout(clickTimer);
      clickTimer = null;
      editTugas(tugas.id);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.className = "btn-hapus";
    tombolHapus.textContent = "Hapus";

    tombolHapus.addEventListener("click", () => hapusTugas(tugas.id));

    // FLOW DRAG START: simpan ID tugas yang sedang dipindahkan.
    li.addEventListener("dragstart", () => {
      tugasYangSedangDiDrag = tugas.id;
      li.classList.add("dragging");
    });

    // FLOW DRAG END: bersihkan state drag.
    li.addEventListener("dragend", () => {
      tugasYangSedangDiDrag = null;
      li.classList.remove("dragging");
    });

    // FLOW DRAG OVER: izinkan element menerima drop.
    li.addEventListener("dragover", event => event.preventDefault());

    // FLOW DROP: ambil ID target -> validasi -> pindahkan tugas.
    li.addEventListener("drop", event => {
      event.preventDefault();

      const targetId = Number(li.dataset.id);

      if (
        tugasYangSedangDiDrag === null ||
        tugasYangSedangDiDrag === targetId
      ) {
        return;
      }

      pindahkanTugas(tugasYangSedangDiDrag, targetId);
    });

    li.append(nama, tombolHapus);
    daftarTugasElement.appendChild(li);
  });
}

// CRUD TUGAS

// FLOW TAMBAH: validasi -> push -> simpan -> render.
function tambahTugas(nama) {
  if (!validasiInput(nama)) return;

  daftarTugas.push({
    id: nextId++,
    nama: nama.trim(),
    selesai: false
  });

  simpanTugasKeStorage();
  renderTugas();
}

// FLOW HAPUS: filter keluar ID target -> simpan -> render.
function hapusTugas(id) {
  daftarTugas = daftarTugas.filter(tugas => tugas.id !== id);

  simpanTugasKeStorage();
  renderTugas();
}

// FLOW SELESAI: map semua tugas -> balik boolean pada ID target -> simpan -> render.
function toggleSelesai(id) {
  daftarTugas = daftarTugas.map(tugas =>
    tugas.id === id
      ? { ...tugas, selesai: !tugas.selesai }
      : tugas
  );

  simpanTugasKeStorage();
  renderTugas();
}

// FLOW EDIT: find ID -> prompt -> validasi -> map -> simpan -> render.
function editTugas(id) {
  const tugas = daftarTugas.find(tugas => tugas.id === id);
  if (!tugas) return;

  const namaBaru = prompt("Ubah nama tugas:", tugas.nama);

  if (namaBaru === null || !validasiInput(namaBaru)) return;

  daftarTugas = daftarTugas.map(tugas =>
    tugas.id === id
      ? { ...tugas, nama: namaBaru.trim() }
      : tugas
  );

  simpanTugasKeStorage();
  renderTugas();
}

// DRAG & DROP

// FLOW PINDAH: cari index awal & tujuan -> keluarkan tugas -> masukkan di posisi baru.
function pindahkanTugas(idYangDipindah, idTujuan) {
  const indexAwal = daftarTugas.findIndex(t => t.id === idYangDipindah);
  const indexTujuan = daftarTugas.findIndex(t => t.id === idTujuan);

  if (indexAwal === -1 || indexTujuan === -1) return;

  const [tugasDipindah] = daftarTugas.splice(indexAwal, 1);
  daftarTugas.splice(indexTujuan, 0, tugasDipindah);

  simpanTugasKeStorage();
  renderTugas();
}

// INISIALISASI

function initTugas() {
  // FLOW FORM: submit -> cegah reload -> tambah -> reset input.
  formTugas.addEventListener("submit", event => {
    event.preventDefault();
    tambahTugas(inputTugas.value);
    inputTugas.value = "";
    inputTugas.focus();
  });

  // FLOW FILTER: klik tombol -> ubah filterAktif -> render ulang.
  tombolFilter.forEach(tombol => {
    tombol.addEventListener("click", () => {
      filterAktif = tombol.dataset.filter;
      renderTugas();
    });
  });

  const cariTugasDebounced = debounce(keyword => {
    kataKunciPencarian = keyword.toLowerCase().trim();
    renderTugas();
  }, 300);

  // FLOW SEARCH: input -> debounce -> ubah keyword -> render.
  inputPencarian.addEventListener("input", event => {
    cariTugasDebounced(event.target.value);
  });

  // FLOW AWAL: muat data -> tampilkan data.
  muatTugasDariStorage();
  renderTugas();
}

export { initTugas };
