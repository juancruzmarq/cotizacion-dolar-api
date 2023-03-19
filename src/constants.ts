// Pages urls
export const DOLAR_HOY = "https://dolarhoy.com/";
export const BANCO_NACION = "https://www.bna.com.ar/Personas";
export const LA_NACION = "https://www.lanacion.com.ar/dolar-hoy/";
export const AMBITO = "https://www.ambito.com/contenidos/dolar.html";
export const INFOBAE = "https://www.infobae.com/economia/divisas/dolar-hoy/";
export const BANCO_MACRO =
  "https://tiempofinanciero.com.ar/cotizaciones/macro/";
export const TIEMPO_FINANCIERO =
  "https://tiempofinanciero.com.ar/cotizaciones/";

export enum TIPOS {
  OFICIAL = "Oficial",
  BLUE = "Blue",
  CONTADO_CON_LIQUIDACION = "Contado con Liquidacion",
  BOLSA = "Bolsa",
  CRIPTO = "Cripto",
  SOLIDARIO = "Solidario",
  MAYORISTA = "Mayorista",
  MEP_CONTADO = "MEP Contado",
  MEP = "MEP",
  TURISTA = "Turista",
  TARJETA = "Tarjeta",
  CCL = "CCL",
}

export type Cotizacion = {
  moneda: string;
  tipo: TIPOS;
  fecha: Date;
  compra?: number;
  venta: number;
  EntidadId: number;
};
