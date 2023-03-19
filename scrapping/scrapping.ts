import { createCotizacionBancoNacion } from "./bancoNacion";
import { createCotizacionDolarHoy } from "./dolarHoy";

export const scrapping = async () => {
  const bancoNacion = await createCotizacionBancoNacion();
  const dolarHoy = await createCotizacionDolarHoy();
};
