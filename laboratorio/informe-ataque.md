# Informe de Ataque y Defensa — Ronda 1 y 2
**Proyecto:** API de Numerología  
**Fecha:** 14 de Septiembre, 2026  
**Auditor:** Diego Fajardo  

---

## Bloque 1: Ejecución de los 14 Ataques (Ronda 1)

### ATAQUE #01: Falta lo obligatorio
* **Petición:** `POST /api/v1/lecturas`
* **Body:**
  ```json
  {
    "notas": "Lectura express sin fecha ni usuario"
  }