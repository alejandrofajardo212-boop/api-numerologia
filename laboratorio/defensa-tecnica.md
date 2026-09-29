```markdown
# Defensa Técnica — Respuestas Individuales

### 1. Pega una regla de tu validator y dime cuál de los 14 ataques bloquea. Si no bloquea ninguno, ¿para qué la escribiste?

```javascript
// Archivo: src/validators/readingValidator.js
check('tipoSistema', 'El tipo de sistema numerológico no es válido')
  .exists()
  .isIn(['PITAGORICO', 'CALDEO', 'CABALISTICO'])