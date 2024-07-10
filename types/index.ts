import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Car {
  Especificacoes: Especificacoes;
  Imagens: string[];
  Link: string;
  Marca: string;
  Modelo: string;
  Opcionais: string[];
  Preco: number;
  Titulo: string;
  Versao: string;
}

export interface Especificacoes {
  marca: string;
  km: number;
  ano_de_fabricacao: number;
  ano_do_modelo: number;
  blindado: boolean;
  carroceria: string;
  cor: string;
  motor: string;
  potencia: number;
  cambio: string;
  tracao: string;
  direcao: string;
  freios: string;
  rodas: string;
  bancos: string;
  airbags: string;
  ar_condicionado: string;
  farois: string;
  conectividade_e_multimidia: string;
  final_da_placa: string;
  torque: number;
}