# Client Manager

Aplicación Angular 15 + Firebase para el alta, listado y análisis estadístico
de clientes. Desarrollada como parte de un challenge técnico.

**App en producción:** https://client-manager-82a35.web.app

## Stack

- **Angular 15** (Standalone Components, Reactive Forms)
- **Angular Material** para la UI
- **Firebase Firestore** para persistencia de clientes
- **Firebase Authentication** (Email/Password) para proteger rutas y acciones
- **Firebase Hosting** + **GitHub Actions** para el deploy (automático en cada
  push a `main`)

## Funcionalidad

- Registro/login de usuarios (Firebase Auth). Las rutas `/clientes` y
  `/clientes/nuevo` están protegidas por `AuthGuard` y las Firestore
  Security Rules exigen `request.auth != null`.
- Alta de clientes (nombre, apellido, edad, fecha de nacimiento) con
  validaciones avanzadas:
  - Nombre/apellido: solo letras (con acentos/ñ).
  - Edad: entre 0 y 120.
  - Fecha de nacimiento: no puede ser futura.
  - Validador cruzado: la edad ingresada debe coincidir con los años
    cumplidos según la fecha de nacimiento.
- Listado de clientes con filtro por texto, orden por columna
  (`mat-sort`) y paginación.
- Pipes personalizados: `fechaFormato` (fecha en español, ej. "15 de marzo
  de 1990") y `capitalizar` (normaliza nombre/apellido al mostrarlos).
- Estadísticas de edad (promedio y desvío estándar **muestral**, es decir
  dividiendo por `n-1`: se trata a los clientes registrados como una
  muestra, no como la población completa) — se recalculan en tiempo real
  con la lista de clientes y se muestran arriba del listado.

## Desarrollo local

```bash
npm install
ng serve
```

Abrir `http://localhost:4200/`. La app usa el proyecto de Firebase real
(`client-manager-82a35`) tanto en desarrollo como en producción — no hay un
proyecto de Firebase separado para dev.

## Tests

```bash
ng test --watch=false --browsers=ChromeHeadless
```

Cubre los validadores custom del formulario de alta, el cálculo de
estadísticas, y los componentes de auth/listado.

## Build y deploy

```bash
ng build                              # build de producción (configuración default)
firebase deploy --only hosting,firestore:rules
```

El deploy también corre automáticamente vía GitHub Actions
(`.github/workflows/firebase-hosting-merge.yml`) en cada push a `main`, y
genera un preview channel en cada Pull Request.

## Decisiones de diseño

- **Desvío estándar muestral (n-1)**, no poblacional: los clientes
  registrados son una muestra, no la población completa de clientes
  posibles.
- **AngularFire pineado a 7.6.1** (con `firebase@^9.23.0`): es la última
  versión de AngularFire compatible con Angular 15/16 — las versiones más
  nuevas requieren Angular 20+.
- **API `compat` de AngularFire** (no la API modular v9): coherente con esa
  versión de AngularFire. Como trade-off, el bundle inicial pesa ~1.4MB
  (todo el SDK de Firebase incluido), por eso el budget de `angular.json`
  está en 1MB warning / 2MB error en vez del default de Angular.
- **Estadísticas embebidas en `/clientes`** en vez de una ruta separada: son
  dos requisitos chicos y relacionados del challenge (listado + análisis de
  datos), separarlos hubiera fragmentado la navegación sin agregar valor.
- **`skipLibCheck: true`** en `tsconfig.json`: workaround necesario para un
  bug de tipos conocido en los `.d.ts` de `@angular/fire@7.6.1/compat/firestore`
  contra TypeScript 4.9 (no es un problema del código de este proyecto).
