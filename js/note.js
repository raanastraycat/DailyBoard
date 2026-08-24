import { validasiInput } from "./utils.js";

let daftarCatatan = [];

const formCatatan = document.getElementById("form-catatan");
const inputCatatan = document.getElementById("input-catatan");
const daftarCatatanElement = document.getElementById("daftar-catatan");

// FLOW PENYIMPANAN: array -> JSON string -> localStorage.
function simpanCatatanKeStorage() {
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

// FLOW PEMUATAN: localStorage -> JSON string -> array.
function muatCatatanDariStorage() {
  const data = localStorage.getItem("daftarCatatan");

  if (!data) return;

  try {
    daftarCatatan = JSON.parse(data);
  } catch {
    // Jika data rusak/tidak valid, mulai dari array kosong.
    daftarCatatan = [];
  }
}

// FLOW RENDER: kosongkan container -> buat card -> pasang event -> tampilkan.
function renderCatatan() {
  daftarCatatanElement.innerHTML = "";

  daftarCatatan.forEach(catatan => {
    const card = document.createElement("div");
    card.className = "catatan-item";

    const isi = document.createElement("p");
    isi.className = "catatan-isi";
    isi.textContent = catatan.isi;
    isi.title = "Double click untuk edit catatan";

    // FLOW EDIT: double click -> cari catatan -> minta isi baru -> simpan -> render.
    isi.addEventListener("dblclick", () => editCatatan(catatan.id));

    const tanggal = document.createElement("small");
    tanggal.className = "catatan-tanggal";
    tanggal.textContent = catatan.tanggal;

    const actions = document.createElement("div");
    actions.className = "catatan-actions";

    const tombolHapus = document.createElement("button");
    tombolHapus.className = "btn-hapus-catatan";
    tombolHapus.textContent = "Hapus";

    // FLOW HAPUS: click -> hapus berdasarkan ID -> simpan -> render.
    tombolHapus.addEventListener("click", () => hapusCatatan(catatan.id));

    actions.appendChild(tombolHapus);
    card.append(isi, tanggal, actions);
    daftarCatatanElement.appendChild(card);
  });
}

// FLOW TAMBAH: validasi -> push object baru -> simpan -> render.
function tambahCatatan(isi) {
  if (!validasiInput(isi)) return;

  daftarCatatan.push({
    id: Date.now(),
    isi: isi.trim(),
    tanggal: new Date().toLocaleString("id-ID")
  });

  simpanCatatanKeStorage();
  renderCatatan();
}

// FLOW EDIT: cari ID -> prompt -> validasi -> map -> simpan -> render.
function editCatatan(id) {
  const catatan = daftarCatatan.find(catatan => catatan.id === id);
  if (!catatan) return;

  const isiBaru = prompt("Ubah catatan:", catatan.isi);

  if (isiBaru === null || !validasiInput(isiBaru)) return;

  daftarCatatan = daftarCatatan.map(catatan =>
    catatan.id === id
      ? { ...catatan, isi: isiBaru.trim() }
      : catatan
  );

  simpanCatatanKeStorage();
  renderCatatan();
}

// FLOW HAPUS: filter data -> simpan -> render.
function hapusCatatan(id) {
  daftarCatatan = daftarCatatan.filter(catatan => catatan.id !== id);

  simpanCatatanKeStorage();
  renderCatatan();
}

function initCatatan() {
  // FLOW FORM: submit -> cegah reload -> tambah -> kosongkan input.
  formCatatan.addEventListener("submit", event => {
    event.preventDefault();
    tambahCatatan(inputCatatan.value);
    inputCatatan.value = "";
    inputCatatan.focus();
  });

  muatCatatanDariStorage();
  renderCatatan();
}

export { initCatatan };
