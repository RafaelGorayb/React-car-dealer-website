import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Car = {
  id: number;
  marca: string;
  modelo: string;
  versao: string;
  preco: number;
  ano_modelo: number;
  ano_fabricacao: number;
  km: number;
  cor: string;
  motorizacao: string;
  potencia: string;
  torque: string;
  cambio: string;
  tracao: string;
  direcao: string;
  freios: string;
  rodas: string;
  bancos: string;
  airbags: string;
  ar_condicionado: string;
  farol: string;
  multimidia: string;
  final_placa: string;
  carroceria: string;
  blindado: boolean;
  opcionais: string[];
  fotos: string[];
};

export interface FiltrosPesquisa {
  marca: string;
  modelo: string;
  versao: string;
  precoMin: number;
  precoMax: number;
  anoMin: number;
  anoMax: number;
  kmMin: number;
  kmMax: number;
  cor: string;
  carroceria: string;
  blindado: boolean;
}