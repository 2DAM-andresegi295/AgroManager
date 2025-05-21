interface ParcelaValidaciones {
  nombreParcela: boolean;
  tipoExplotacion: boolean;
  vertices: boolean;
  // Campos específicos por tipo
  ganadera: {
    especie: boolean;
    cabezasGanado: boolean;
    hidratacion: boolean;
    alimentacion: boolean;
  };
  agricola: {
    especie: boolean;
    frecuenciaRiego: boolean;
  };
}
