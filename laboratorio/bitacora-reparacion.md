```markdown
# Bitácora de Reparación

## Bloque 2: Clasificación y Priorización de Fallas

Clasificación de los 12 hallazgos según su impacto:

### 🔴 CRÍTICO (Inconsistencia y corrupción de base de datos)
1. **Ataque 07 (Mass Assignment POST):** Permite elevación de privilegios.
2. **Ataque 08 (Mass Assignment PUT):** Modificación no autorizada de campos sensibles.
3. **Ataque 12 (Referencia a la nada):** Creación de documentos con relaciones fantasma.
4. **Ataque 13 (Borrado sin integridad):** Registros huérfanos tras eliminación de padres.

### 🟡 GRAVE (Errores 500 y fuga de información técnica / stack traces)
5. **Ataque 01 (Falta obligatorio):** Exposición de errores crudos de Mongoose.
6. **Ataque 02 (Body vacío):** Falla no controlada en servidor.
7. **Ataque 03 (Tipos cambiados):** `CastError` no atrapado.
8. **Ataque 05 (Enum inválido):** Falla de validación en BD expuesta al cliente.
9. **Ataque 09 (MongoID inválido):** Crasheo de consulta por formato de ID.

### 🔵 MENOR (Problemas de formato, UX y límites de entrada)
10. **Ataque 04 (Espacios en blanco):** Guardado de strings vacíos.
11. **Ataque 06 (Texto gigante):** Falta de límites superiores.
12. **Ataque 10 (ID no encontrado):** Retornar 200 con `null` en lugar de 404.

---

### Orden de Reparación Planificado
1. **Fase 1 (Validación de entrada y Middlewares):** Atacar Ataques 01, 02, 03, 04, 05, 06, 09.
2. **Fase 2 (Seguridad y Mass Assignment):** Atacar Ataques 07 y 08.
3. **Fase 3 (Manejo de Respuestas HTTP):** Atacar Ataque 10.
4. **Fase 4 (Lógica de Negocio e Integridad Referencial):** Atacar Ataques 12 y 13.

---

## Bloque 3: Registro de Reparaciones Realizadas

### REPARACIÓN del ATAQUE #01, #02, #03, #04, #05, #06
* **Por qué falló:** La API no contaba con un middleware centralizado que procesara los errores de `express-validator` ni reglas rigurosas de sanidad en las rutas.
* **Dónde lo arreglé:** `src/validators/userValidator.js` y `src/middlewares/validarCampos.js`
* **Qué cambié:**
  ```javascript
  // DESPUÉS (src/validators/userValidator.js)
  import { check } from 'express-validator';
  import { validarCampos } from '../middlewares/validarCampos.js';

  export const validarUsuario = [
    check('nombre', 'El nombre es obligatorio').trim().notEmpty().isLength({ max: 100 }),
    check('email', 'Email inválido').isEmail().normalizeEmail(),
    check('fechaNacimiento', 'Fecha inválida').isISO8601(),
    validarCampos
  ];