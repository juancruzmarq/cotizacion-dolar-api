import { BANCO_MACRO, TIEMPO_FINANCIERO } from "../src/constants";
import {
  BANCO_NACION,
  DOLAR_HOY,
  AMBITO,
  INFOBAE,
  LA_NACION,
} from "../src/constants";

export const entidades = [
  {
    nombre: "Banco Nacion",
    es_banco: true,
    url: BANCO_NACION,
  },
  {
    nombre: "Dolar Hoy",
    es_banco: false,
    url: DOLAR_HOY,
  },
  {
    nombre: "Ambito",
    es_banco: false,
    url: AMBITO,
  },
  {
    nombre: "Infobae",
    es_banco: false,
    url: INFOBAE,
  },
  {
    nombre: "La Nacion",
    es_banco: false,
    url: LA_NACION,
  },
  {
    nombre: "Banco Macro",
    es_banco: true,
    url: BANCO_MACRO,
  },
  {
    nombre: "Tiempo Financiero",
    es_banco: false,
    url: TIEMPO_FINANCIERO,
  },
];
