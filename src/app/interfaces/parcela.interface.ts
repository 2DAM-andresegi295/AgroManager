export default interface Parcela{
  name: string,
  idUsuario: string,
  correo: string|null,
  vertices: google.maps.LatLngLiteral[],
  tipoExplotacion: string,
}
