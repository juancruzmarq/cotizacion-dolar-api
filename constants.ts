// Pages urls
export const DOLAR_HOY = "https://dolarhoy.com/";
export const BANCO_NACION = "https://www.bna.com.ar/Personas";
export const LA_NACION = "https://www.lanacion.com.ar/dolar-hoy/";
export const AMBITO = "https://www.ambito.com/contenidos/dolar.html";
export const INFOBAE = "https://www.infobae.com/economia/divisas/dolar-hoy/";

export enum TIPOS {
  OFICIAL = "Oficial",
  BLUE = "Blue",
  CONTADO_CON_LIQUIDACION = "Contado con Liquidacion",
  BOLSA = "Bolsa",
  CRIPTO = "Cripto",
  SOLIDARIO = "Solidario",
  MAYORISTA = "Mayorista",
  MEP_CONTADO = "MEP Contado",
  TURISTA = "Turista",
}

export type Cotizacion = {
  moneda: string;
  tipo: TIPOS;
  fecha: Date;
  compra: number;
  venta: number;
  EntidadId: string | number;
};
