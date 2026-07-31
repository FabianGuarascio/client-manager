/**
 * Cliente registrado en Firestore (colección `clientes`).
 * `fechaNacimiento` se guarda como timestamp ISO (string) para poder
 * ordenarla/filtrarla de forma simple sin depender del tipo Timestamp de
 * Firestore en el resto de la app.
 */
export interface Cliente {
  id?: string;
  nombre: string;
  apellido: string;
  edad: number;
  fechaNacimiento: string;
}
