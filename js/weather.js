import { OPENWEATHER_API_KEY, DEFAULT_CITY } from "./config.js";

const formCuaca = document.getElementById("form-cuaca");
const inputKota = document.getElementById("input-kota");
const infoCuaca = document.getElementById("info-cuaca");
const statusCuaca = document.getElementById("status-cuaca");
const weatherLocation = document.getElementById("weather-location");
const refreshCuaca = document.getElementById("refresh-cuaca");

async function ambilCuaca(kota = DEFAULT_CITY) {
  try {
    // Tampilkan status loading sebelum request.
    infoCuaca.textContent = "Mengambil data cuaca...";
    statusCuaca.textContent = "";

    // Susun endpoint berdasarkan kota dan API key.
    const url =
      "https://api.openweathermap.org/data/2.5/weather" +
      `?q=${encodeURIComponent(kota)}` +
      `&appid=${encodeURIComponent(OPENWEATHER_API_KEY)}` +
      "&units=metric" +
      "&lang=id";

    // Kirim request asynchronous.
    const response = await fetch(url);

    // Periksa status HTTP sebelum membaca data.
    if (!response.ok) {
      throw new Error(
        "Gagal mengambil cuaca. Periksa nama kota atau API key."
      );
    }

    // Parse response dan ambil bagian weather yang diperlukan.
    const data = await response.json();
    const cuaca = data.weather[0];

    weatherLocation.textContent =
      `${data.name}, ${data.sys.country}`;

    const iconUrl =
      `https://openweathermap.org/img/wn/${cuaca.icon}@2x.png`;

    // Tampilkan data API ke DOM.
    infoCuaca.innerHTML = `
      <div class="weather-main">
        <img
          class="weather-icon"
          src="${iconUrl}"
          alt="${cuaca.description}"
        >
        <div>
          <p class="weather-temp">${Math.round(data.main.temp)}°C</p>
          <p class="weather-description">${cuaca.description}</p>
        </div>
      </div>

      <div class="weather-details">
        <div class="weather-detail">
          <strong>Terasa</strong>
          ${Math.round(data.main.feels_like)}°C
        </div>
        <div class="weather-detail">
          <strong>Kelembapan</strong>
          ${data.main.humidity}%
        </div>
        <div class="weather-detail">
          <strong>Angin</strong>
          ${data.wind.speed} m/s
        </div>
      </div>
    `;

    // Tampilkan waktu request berhasil.
    statusCuaca.textContent =
      `Terakhir diperbarui: ${new Date().toLocaleTimeString("id-ID")}`;
  } catch (error) {
    // Tampilkan fallback tanpa menghentikan modul lain.
    weatherLocation.textContent = "Cuaca tidak tersedia";
    infoCuaca.textContent = error.message;
    statusCuaca.textContent = "";
  }
}

function initCuaca() {
  // Ambil kota terakhir, atau gunakan kota default.
  const kotaTersimpan =
    localStorage.getItem("kotaCuaca") || DEFAULT_CITY;

  inputKota.value = kotaTersimpan;
  ambilCuaca(kotaTersimpan);

  // FLOW SUBMIT: input kota -> simpan -> request cuaca baru.
  formCuaca.addEventListener("submit", event => {
    event.preventDefault();

    const kota = inputKota.value.trim() || DEFAULT_CITY;
    localStorage.setItem("kotaCuaca", kota);
    ambilCuaca(kota);
  });

  // FLOW REFRESH: ambil kota tersimpan -> request ulang.
  refreshCuaca.addEventListener("click", () => {
    const kota =
      localStorage.getItem("kotaCuaca") || DEFAULT_CITY;

    ambilCuaca(kota);
  });
}

export { initCuaca };
