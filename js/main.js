import { initTugas } from "./tugas.js";
import { initCatatan } from "./note.js";
import { initTema } from "./theme.js";
import { initCuaca } from "./weather.js";
import { ambilKutipan } from "./kutipan.js";

function mulaiAplikasi() {
  initTugas();

  initCatatan();

  initTema();

  initCuaca();

  ambilKutipan();
}

mulaiAplikasi();
