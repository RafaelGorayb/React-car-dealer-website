import { CarObjectComplete } from "@/types";

export function formatCars(Car: CarObjectComplete | CarObjectComplete[]) {
  if (Array.isArray(Car)) {
    return Car.map((car) => {
      return {
        ...car,
        opcionais: car.opcionais_carro
          ? car.opcionais_carro.map((opcional: any) => opcional.nome)
          : [],
        fotos: car.fotos_urls
          ? car.fotos_urls.map((foto: any) => foto.url)
          : [],
      };
    });
  }
  return {
    ...Car,
    opcionais: Car.opcionais_carro
      ? Car.opcionais_carro.map((opcional: any) => opcional.nome)
      : [],
    fotos: Car.fotos_urls ? Car.fotos_urls.map((foto: any) => foto.url) : [],
  };
}

export function formatCarPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
