//seleksi & manipulasi DOM (minggu 2)
const app = document.getElementById("app");

const status = document.createElement("p");
status.id = "status";
status.textContent = "Memuat data...";
app.appendChild(status);

const judul = document.createElement("h2");
judul.textContent = "Selamat datang di DailyBoard! ";
app.appendChild(judul);

//3 section (Tugas mingguan (minggu 2))
const tugasSection = document.createElement("section");
tugasSection.id = "tugas";
tugasSection.className = "surface-container-low large-round large-padding";

const catatanSection = document.createElement("section");
catatanSection.id = "catatan";
catatanSection.className = "surface-container-low large-round large-padding";

const cuacaSection = document.createElement("section");
cuacaSection.id = "cuaca";
cuacaSection.className = "surface-container-low large-round large-padding";

app.append(tugasSection, catatanSection, cuacaSection);

//Event input (Tugas mingguan (minggu 3))
const titleTugas = document.createElement("h3");
titleTugas.textContent = "Daftar Tugas";
tugasSection.appendChild(titleTugas);

const inputTugas = document.createElement("input");
inputTugas.type = "text";
inputTugas.placeholder = "Masukkan nama tugas...";

const tombolTambah = document.createElement("button");
tombolTambah.textContent = "Tambah Tugas";

tugasSection.append(inputTugas, tombolTambah);

//pencarian (Minggu 14)
const inputCari = document.createElement("input");
inputCari.type = "search";
inputCari.id = "cari-tugas";
inputCari.placeholder = "Cari tugas...";
tugasSection.appendChild(inputCari);

//Filter (Minggu 6)
const filterContainer = document.createElement("div");
filterContainer.id = "filter-container";

const btnSemua = document.createElement("button");
btnSemua.textContent = "Semua";

const btnSelesai = document.createElement("button");
btnSelesai.textContent = "Selesai";

const btnBelum = document.createElement("button");
btnBelum.textContent = "Belum Selesai";

filterContainer.append(btnSemua, btnSelesai, btnBelum);

const daftar_tugas = document.createElement("ul");
daftar_tugas.id = "daftar-tugas";
daftar_tugas.className = "list border";

tugasSection.append(filterContainer, daftar_tugas);

//menampilkan data (minggu 4)
let daftarTugas = [];
let daftarCatatan = [];
let filterAktif = "semua";

  // fungsi-fungsi buat ngatur data tugas
function muatDariStorage() {
  const data = localStorage.getItem("daftarTugas");
  daftarTugas = data
    ? JSON.parse(data)
    : [
        { id: 1, nama: "Belajar JavaScript", selesai: false },
        { id: 2, nama: "Olahraga Pagi", selesai: false },
      ];
  if (!data) simpanKeStorage();
}

//menyimpan data (minggu 7)
function simpanKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

//validasi input (minggu 9)
function validasiInput(nilai) {
  if (nilai.trim() === "") {
    alert("Input tidak boleh kosong!");
    return false;
  }
  if (nilai.length > 100) {
    alert("Input maksimal 100 karakter!");
    return false;
  }
  return true;
}

//tambah/hapus tugas (minggu 5)
function tambahTugas(nama) {
  daftarTugas.push({ id: Date.now(), nama: nama, selesai: false });
  simpanKeStorage();
  renderTugas(filterAktif);
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter((t) => Number(t.id) !== Number(id));
  simpanKeStorage();
  renderTugas(filterAktif);
}

function editTugas(id, namaBaru) {
  daftarTugas = daftarTugas.map((t) =>
    Number(t.id) === Number(id) ? { ...t, nama: namaBaru } : t
  );
  simpanKeStorage();
  renderTugas(filterAktif);
}

function toggleSelesai(id) {
  daftarTugas = daftarTugas.map((t) =>
    Number(t.id) === Number(id) ? { ...t, selesai: !t.selesai } : t
  );
  simpanKeStorage();
  renderTugas(filterAktif);
}

function filterTugas() {
  if (filterAktif === "selesai") return daftarTugas.filter((t) => t.selesai);
  if (filterAktif === "belum") return daftarTugas.filter((t) => !t.selesai);
  return daftarTugas.slice();
}

function cariTugas(kata) {
  return filterTugas().filter((t) => t.nama.toLowerCase().includes(kata));
}

function urutkanTugas(idPindah, idTujuan) {
  const a = daftarTugas.findIndex((t) => Number(t.id) === Number(idPindah));
  const b = daftarTugas.findIndex((t) => Number(t.id) === Number(idTujuan));
  if (a === -1 || b === -1 || a === b) return;
  const item = daftarTugas.splice(a, 1)[0];
  daftarTugas.splice(b, 0, item);
  simpanKeStorage();
  renderTugas(filterAktif);
}

function renderTugas(filter, listOverride) {
  filterAktif = filter || "semua";
  const list = document.getElementById("daftar-tugas");
  if (!list) return;
  list.innerHTML = "";

  let hasil = listOverride || filterTugas();

  hasil.forEach((tugas) => {
    const li = document.createElement("li");
    li.className = "tugas-item";
    li.dataset.id = tugas.id;
    li.draggable = true;

    const grip = document.createElement("span");
    grip.className = "drag-handle";
    grip.textContent = "≡";

    const span = document.createElement("span");
    span.className = "max";
    span.textContent = tugas.nama;
    span.style.textDecoration = tugas.selesai ? "line-through" : "none";

    span.addEventListener("click", function () {
      toggleSelesai(tugas.id);
    });

    span.addEventListener("dblclick", function () {
      const inp = document.createElement("input");
      inp.type = "text";
      inp.value = tugas.nama;
      span.replaceWith(inp);
      inp.focus();
      inp.addEventListener("blur", function () {
        if (!validasiInput(inp.value)) return renderTugas(filterAktif);
        editTugas(tugas.id, inp.value);
      });
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") inp.blur();
      });
    });

    const hapus = document.createElement("button");
    hapus.textContent = "Hapus";
    hapus.addEventListener("click", function (e) {
      e.stopPropagation();
      hapusTugas(tugas.id);
    });

    li.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", String(tugas.id));
      li.classList.add("menyeret");
    });

    li.addEventListener("dragend", function () {
      li.classList.remove("menyeret");
    });

    li.append(grip, span, hapus);
    list.appendChild(li);
  });
}

tombolTambah.addEventListener("click", function () {
  if (!validasiInput(inputTugas.value)) return;
  tambahTugas(inputTugas.value);
  inputTugas.value = "";
});

function tampilFilterAktif() {
  btnSemua.className = "";
  btnSelesai.className = "";
  btnBelum.className = "";
  if (filterAktif === "semua") btnSemua.className = "active";
  else if (filterAktif === "selesai") btnSelesai.className = "active";
  else if (filterAktif === "belum") btnBelum.className = "active";
}

btnSemua.addEventListener("click", function () {
  filterAktif = "semua";
  tampilFilterAktif();
  renderTugas(filterAktif);
});

btnSelesai.addEventListener("click", function () {
  filterAktif = "selesai";
  tampilFilterAktif();
  renderTugas(filterAktif);
});

btnBelum.addEventListener("click", function () {
  filterAktif = "belum";
  tampilFilterAktif();
  renderTugas(filterAktif);
});

// debounce biar pencariannya nggak kejalan tiap ketik
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn(...args);
    }, delay);
  };
}

const cari = debounce(function (kata) {
  renderTugas(filterAktif, cariTugas(kata));
}, 300);

inputCari.addEventListener("input", function (e) {
  cari(e.target.value.trim().toLowerCase());
});

// drag and drop buat ngubah urutan tugas
daftar_tugas.addEventListener("dragover", function (e) {
  e.preventDefault();
  const item = e.target.closest(".tugas-item");
  if (!item) return;
  document
    .querySelectorAll(".tujuan-drop")
    .forEach((el) => el.classList.remove("tujuan-drop"));
  item.classList.add("tujuan-drop");
});

daftar_tugas.addEventListener("drop", function (e) {
  e.preventDefault();
  const id = e.dataTransfer.getData("text/plain");
  const item = e.target.closest(".tugas-item");
  document
    .querySelectorAll(".tujuan-drop")
    .forEach((el) => el.classList.remove("tujuan-drop"));
  if (item) urutkanTugas(id, item.dataset.id);
});

// bagian catatan cepat
const titleCatatan = document.createElement("h3");
titleCatatan.textContent = "Catatan Cepat";
catatanSection.appendChild(titleCatatan);

const formCatatan = document.createElement("form");
formCatatan.id = "form-catatan";

const inputCatatan = document.createElement("textarea");
inputCatatan.id = "input-catatan";
inputCatatan.placeholder = "Tulis catatan...";

const btnSimpanCatatan = document.createElement("button");
btnSimpanCatatan.type = "submit";
btnSimpanCatatan.textContent = "Simpan Catatan";

formCatatan.append(inputCatatan, btnSimpanCatatan);

const daftarCatatanContainer = document.createElement("div");
daftarCatatanContainer.id = "daftar-catatan";

catatanSection.append(formCatatan, daftarCatatanContainer);

formCatatan.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validasiInput(inputCatatan.value)) return;
  daftarCatatan.push({
    id: Date.now(),
    isi: inputCatatan.value,
    tanggal: new Date().toLocaleDateString("id-ID"),
  });
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
  renderCatatan();
  inputCatatan.value = "";
});

function renderCatatan() {
  const container = document.getElementById("daftar-catatan");
  container.innerHTML = "";
  daftarCatatan.forEach(function (catatan) {
    const div = document.createElement("div");
    div.className = "catatan-item";

    const p = document.createElement("p");
    p.textContent = catatan.isi;

    const kecil = document.createElement("small");
    kecil.textContent = catatan.tanggal;

    const hapus = document.createElement("button");
    hapus.textContent = "Hapus";
    hapus.addEventListener("click", function (e) {
      e.stopPropagation();
      daftarCatatan = daftarCatatan.filter(
        (c) => Number(c.id) !== Number(catatan.id)
      );
      localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
      renderCatatan();
    });

    p.addEventListener("dblclick", function () {
      const ta = document.createElement("textarea");
      ta.value = catatan.isi;
      p.replaceWith(ta);
      ta.focus();
      ta.addEventListener("blur", function () {
        if (ta.value.trim() === "") return renderCatatan();
        daftarCatatan = daftarCatatan.map((c) =>
          Number(c.id) === Number(catatan.id) ? { ...c, isi: ta.value } : c
        );
        localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
        renderCatatan();
      });
      ta.addEventListener("keydown", function (e) {
        if (e.key === "Enter") ta.blur();
      });
    });

    div.append(p, kecil, hapus);
    container.appendChild(div);
  });
}

// widget kutipan dengan API (Tugas mingguan (Minggu 10))
const kutipanContainer = document.createElement("div");
kutipanContainer.id = "kutipan-container";
kutipanContainer.className = "surface-container-low large-round large-padding";

const titleKutipan = document.createElement("h3");
titleKutipan.textContent = "Kutipan Hari Ini";

const textKutipan = document.createElement("blockquote");
textKutipan.id = "kutipan-harian";
textKutipan.textContent = "Sedang mengambil kutipan...";

kutipanContainer.append(titleKutipan, textKutipan);
app.insertBefore(kutipanContainer, tugasSection);

async function ambilKutipan() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("gagal");
    const data = await res.json();
    document.getElementById("kutipan-harian").textContent =
      '"' + data.quote + '" — ' + data.author;
  } catch (e) {
    console.log("gagal ambil kutipan", e);
    document.getElementById("kutipan-harian").textContent =
      "Gagal memuat kutipan harian.";
  }
}

// widget cuaca dengan API (Minggu 11)
const titleCuaca = document.createElement("h3");
titleCuaca.textContent = "Informasi Cuaca";

const inputKota = document.createElement("input");
inputKota.type = "text";
inputKota.id = "input-kota";
inputKota.placeholder = "Masukkan nama kota (misal: Jakarta)...";

const btnCariCuaca = document.createElement("button");
btnCariCuaca.textContent = "Cari Cuaca";

const infoCuaca = document.createElement("div");
infoCuaca.id = "info-cuaca";

cuacaSection.append(titleCuaca, inputKota, btnCariCuaca, infoCuaca);

async function ambilCuaca(kota) {
  const apiKey = "353cc72ee917646ce84e30e9c54a356a";
  const display = document.getElementById("info-cuaca");
  display.textContent = "Memuat data cuaca...";
  try {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      kota +
      "&units=metric&appid=" +
      apiKey;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Kota tidak ditemukan atau API Key belum valid.");
    const data = await res.json();
    display.innerHTML = "";
    const nama = document.createElement("p");
    nama.innerHTML = "<strong>" + data.name + "</strong>: " + data.main.temp + "°C";
    const desk = document.createElement("p");
    desk.textContent = data.weather[0].description;
    display.append(nama, desk);
  }catch (error) {
    display.textContent = error.message;
  }
}

btnCariCuaca.addEventListener("click", function () {
  const kota = inputKota.value.trim();
  if (kota !== "") ambilCuaca(kota);
});

async function muatSemuaWidget() {
  const status = document.getElementById("status");
  status.textContent = "Memuat data widget...";
  try {
    await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);
    status.textContent = "Data berhasil dimuat sepenuhnya!";
  } catch (e) {
    status.textContent = "Beberapa data widget gagal dimuat.";
  }
}

// dark mode (minggu 14)
function terapkanTema(tema) {
  document.body.classList.toggle("dark", tema === "gelap");
  const btn = document.getElementById("toggle-tema");
  if (btn) btn.textContent = tema === "gelap" ? "Mode Terang" : "Mode Gelap";
}

document.getElementById("toggle-tema").addEventListener("click", function () {
  const gelap = document.body.classList.contains("dark");
  localStorage.setItem("tema", gelap ? "terang" : "gelap");
  terapkanTema(gelap ? "terang" : "gelap");
});

window.addEventListener("DOMContentLoaded", function () {
  muatDariStorage();
  const dataCatatan = localStorage.getItem("daftarCatatan");
  daftarCatatan = dataCatatan ? JSON.parse(dataCatatan) : [];
  tampilFilterAktif();
  renderTugas(filterAktif);
  renderCatatan();
  muatSemuaWidget();
  terapkanTema(localStorage.getItem("tema") === "gelap" ? "gelap" : "terang");
});
