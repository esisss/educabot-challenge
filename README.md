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



