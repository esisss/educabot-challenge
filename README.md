# Challenge Técnico Node.js - Educabot

# Challenge Técnico Node.js - Educabot
¡Bienvenido a este coding challenge de Node! Recomendamos leer este archivo completo antes de empezar.

## Condiciones
- El tiempo de resolución es de 2 horas.
- Podés usar cualquier IDE (cursor, windsurf, VS Code, etc).
- Podés modificar cualquier archivo dentro del proyecto.
- Podés ayudarte con cualquier recurso externo (google, código propio, AI, etc).
- La aplicación debe poder ejecutarse con `npm install` y `npm start`.
- Los tests deben poder ejecutarse con `npm test` y pasar todos.
- Todas las conversaciones con la IA deben ser documentadas en este repositorio o en un link aparte.

## Consejos
- No sobrepensar las soluciones, el challenge es simple a propósito.
- Priorizar la calidad del código y las buenas prácticas.
- Un buen uso de IA es algo que se ve con buenos ojos.

## Instrucciones
En este proyecto encontrarás una pequeña API perfectamente funcional, pero con algunos problemas de arquitectura y pocas
buenas prácticas. Pensando en que este proyecto crezca a futuro, tu misión es mejorar la calidad del código y la
estructura del proyecto mediante los siguientes objetivos.

1. Implementá un **BooksProvider** que obtenga información de libros desde un servicio externo. Debe realizar la solicitud HTTP, procesar la respuesta y manejar correctamente los posibles errores. Luego, integrá esta implementación en el flujo principal del programa. Los datos están disponibles en: https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books.

2. Separá la lógica de negocio de la lógica de presentación, aplicando principios de separación por capas. Hoy ambas están mezcladas dentro del archivo `src/handlers/metrics.ts`, y el objetivo es desacoplarlas.

3. Reemplazá los usos de `any` por tipos más precisos y apropiados. Entre ellos, asegurate de definir el tipo `MetricsResponse`, que corresponde a la respuesta del handler.

4. Garantizá una buena cobertura de tests. Actualizá las pruebas existentes para reflejar los cambios en la lógica de negocio e incorporá nuevos casos que validen el manejo de errores. Alcanzá la mayor cobertura posible.




## Resumen de cambios

### Separación de responsabilidades

La lógica de negocio que vivía en `src/handlers/metrics.ts` se extrajo a una capa de servicio (`src/services/metricsService.ts`). El handler quedó limitado a extraer parámetros del request, delegar al servicio y devolver la respuesta HTTP. Las funciones de cálculo (`getMeanUnitsSold`, `getCheapestBook`, `getBooksWrittenByAuthor`) ahora son internas al servicio.

El flujo de dependencias quedó: `handler → service → provider`, compuesto en `index.ts`. Además, se estandarizó el manejo de errores en el handler con un try/catch que captura fallos del servicio y responde con status 500 y un body tipado (`ErrorResponse`).

### Implementación del BooksProvider real

Se creó `src/repositories/booksProvider.ts`, un provider que consume la API externa usando axios y mantiene el contrato existente (`getBooks(): Promise<Book[]>`). El manejo de errores distingue entre fallas de red y respuestas HTTP no exitosas, devolviendo mensajes descriptivos en cada caso. El mock original se conserva en `src/repositories/mocks/` como referencia.

### Mejora del tipado

Se eliminaron todos los usos de `any` (en los return types de las funciones de cálculo y en `Response<any>` del handler). Se definieron los tipos `MetricsResponse` y `ErrorResponse` en `src/models/metrics.ts` como contratos del endpoint. Se corrigió `Book.id` de `string` a `number` para alinearlo con los datos reales de la API.

### Ajustes en los tests

Los tests del handler se adaptaron para mockear el servicio en lugar del provider, reflejando la nueva estructura. Se agregaron tests del servicio (`src/services/metricsService.test.ts`) cubriendo: happy path con y sin filtro de autor, lista vacía, búsqueda case-insensitive y propagación de errores del provider. Se agregaron tests del provider HTTP (`src/repositories/booksProvider.test.ts`) cubriendo respuesta exitosa, error de red y status HTTP inesperado. Se agregó un test de error path en el handler para validar la respuesta 500.

### Decisiones de alcance

Prioricé una solución simple dentro del límite de tiempo. Evité agregar capas, abstracciones o patrones que no fueran estrictamente necesarios. La estructura se mantuvo lo más cercana posible al proyecto original, extendiendo solo donde el challenge lo requería (capa de servicio, provider real, tipos).

## Uso de IA

Se utilizó IA como herramienta de apoyo para análisis, validación de decisiones y estructuración del enfoque.

El detalle de la sesión se encuentra en:
`sesion_opencode.md`
