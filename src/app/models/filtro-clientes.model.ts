/**
 * Criterios de filtro combinados. MatTableDataSource solo soporta un
 * `filter` de tipo string, así que se serializan acá y se parsean de
 * vuelta en el `filterPredicate`.
 */
export interface FiltroClientes {
  texto: string;
  edadDesde: number | null;
  edadHasta: number | null;
}
