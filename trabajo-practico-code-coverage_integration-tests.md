
# 📋 TRABAJO PRÁCTICO Nº 7

## ⚠️ Este es el TP que debés entregar y defender

## 🎯 Objetivo

Implementar **code coverage completo**, **análisis estático de código** y **pruebas de integración** para una aplicación **frontend y backend** utilizando herramientas profesionales (SonarCloud, Cypress, herramientas de coverage), integrando todo en un **pipeline de CI/CD robusto** con **quality gates**.

Este trabajo se aprueba **solo si podés explicar qué hiciste, por qué lo hiciste y cómo lo resolviste**.

---

## 🧩 Escenario

Como desarrollador senior, debés:

### ⚠️ **Restricción importante sobre la aplicación a usar:**
- **SI en el TP05 usaste la aplicación de la guía del TP04**: Tenés que usar **otra aplicación diferente** para este TP.
- **NO podés usar la aplicación de ejemplo de la guía del TP04** para el trabajo real.
- Podés usar **CUALQUIER stack tecnológico**: React + Node.js, Vue + Java, Python + Django, Ruby on Rails, etc.

### **Tecnologías sugeridas:**

**Frontend**: Angular, React, Vue, Svelte, Next.js, Nuxt.js, etc.
**Backend**: .NET Core, Node.js, Java Spring Boot, Python Django/FastAPI, Ruby on Rails, Go, etc.
**Base de Datos**: SQL Server, PostgreSQL, MySQL, MongoDB, SQLite, etc.
**Análisis Estático**: SonarCloud, SonarQube, CodeClimate, Codacy, ESLint + Prettier, etc.
**Pruebas E2E**: Cypress, Playwright, Selenium, Puppeteer, etc.
**CI/CD**: Azure DevOps Pipelines, GitHub Actions, GitLab CI, Jenkins, etc.

### **Tareas a realizar:**
1. Usar **aplicación con Front + Back + BD** (del TP06 o crear nueva, **NO la de la guía del TP04**).
2. Implementar **herramientas de code coverage** y analizar la cobertura actual de tu código.
3. Configurar **análisis estático** (SonarCloud u otra herramienta) y detectar **vulnerabilidades**, **bugs** y **code smells**.
4. Desarrollar **pruebas de integración end-to-end** que validen flujos completos.
5. Integrar **todas las herramientas en CI/CD** con **quality gates** que bloqueen deploys defectuosos.
6. Alcanzar **70% de code coverage mínimo** y **resolver issues críticos** del análisis estático.

---

### Objetivos de Aprendizaje
Al finalizar este trabajo práctico, deberás ser capaz de:

1. **Evaluar la cobertura de pruebas (Code Coverage)**:
   - Implementar y configurar herramientas de medición de cobertura de código
   - Analizar reportes de coverage e identificar áreas críticas sin cobertura
   - Mejorar la cobertura de pruebas existentes

2. **Implementar análisis estático de código**:
   - Configurar y utilizar SonarCloud para análisis estático
   - Interpretar reportes de calidad de código y vulnerabilidades
   - Integrar análisis estático en pipelines de CI/CD

3. **Desarrollar pruebas de integración**:
   - Implementar pruebas de integración con Cypress
   - Validar la interacción entre componentes de aplicación
   - Automatizar pruebas de integración en el pipeline

---

## 📋 Tareas que debés cumplir

**🔧 Nota sobre tecnologías**: Podés usar el stack tecnológico de tu preferencia. Los ejemplos mencionan herramientas sugeridas, pero podés usar cualquier alternativa equivalente.

### 1. Code Coverage y métricas de calidad
- Configurar **herramientas de coverage** para frontend y backend (Jest, Karma, dotnet test, pytest, etc.).
- Generar **reportes detallados** de cobertura de código.
- Identificar **áreas críticas sin cobertura** y mejorarlas.
- Integrar **reportes de coverage en CI/CD**.

### 2. Análisis estático de código
- Crear y configurar **proyecto de análisis estático** (SonarCloud, SonarQube, CodeClimate, etc.).
- Integrar **análisis estático en pipeline** (Azure DevOps, GitHub Actions, etc.).
- Analizar y **resolver issues críticos** detectados.
- Configurar **quality gates** basados en métricas de calidad.

### 3. Pruebas de integración end-to-end
- Instalar y configurar **herramienta de pruebas E2E** (Cypress, Playwright, Selenium, etc.).
- Desarrollar **casos de prueba end-to-end** para flujos críticos.
- Implementar **tests de integración frontend-backend**.
- Automatizar **ejecución en pipeline**.

### 4. Integración completa en CI/CD
- Integrar **todas las herramientas** en pipeline único.
- Configurar **quality gates** que bloqueen deploys defectuosos.
- Implementar **reportes consolidados** de calidad.
- Documentar **criterios de aceptación** del pipeline.

### 5. Evidencias y documentación
- Capturas de **reportes de coverage, SonarCloud y Cypress**.
- Documentar en `decisiones.md` la **estrategia de calidad** implementada.
- **Demo funcional** de todas las herramientas integradas.

---

## 🔧 Pasos sugeridos (checklist)

1. **Setup de Code Coverage**
   - Configurar herramientas de coverage para frontend y backend.
2. **Configuración SonarCloud**
   - Crear proyecto y configurar análisis estático.
3. **Implementación Cypress**
   - Desarrollar pruebas de integración end-to-end.
4. **Integración Pipeline**
   - Agregar todas las herramientas al pipeline CI/CD.
5. **Quality Gates**
   - Configurar criterios de bloqueo para deploys.
6. **Documentación y Demo**
   - Preparar evidencias y demostración funcional.

---

### Consignas del Trabajo Práctico

**IMPORTANTE**: Este trabajo práctico se basa en los conocimientos adquiridos en el TP anterior sobre pruebas unitarias. Debes aplicar los conceptos de testing en un contexto más amplio.

#### 1. Implementación de Code Coverage (25 puntos)
- Configuar herramientas de code coverage para tu proyecto (frontend y backend)
- Ejecutar análisis de cobertura y generar reportes
- Identificar y documentar áreas de código sin cobertura adecuada
- Implementar pruebas adicionales para mejorar la cobertura en módulos críticos

#### 2. Configuración de Análisis Estático con SonarCloud (25 puntos)
- Crear y configurar proyecto en SonarCloud
- Integrar SonarCloud en tu pipeline de Azure DevOps
- Analizar y documentar issues de código detectados por SonarCloud
- Implementar correcciones para al menos 3 issues críticos identificados

#### 3. Implementación de Pruebas de Integración con Cypress (25 puntos)
- Instalar y configurar Cypress en tu proyecto
- Desarrollar al menos 3 casos de prueba de integración que cubran:
  - Flujo completo de creación de un registro
  - Flujo completo de actualización de un registro
  - Validación de integración frontend-backend para manejo de errores
- Documentar los escenarios de prueba implementados

#### 4. Integración en Pipeline CI/CD (25 puntos)
- Integrar todas las herramientas (coverage, SonarCloud, Cypress) en tu pipeline
- Configurar quality gates que bloqueen el deploy si:
  - La cobertura de código es menor al 70%
  - SonarCloud detecta issues críticos sin resolver
  - Las pruebas de integración fallan
- Documentar la configuración del pipeline y los criterios de quality gate

### Entregables

**⚠️ Recordatorio**: NO usar la aplicación de la guía del TP04. Usar una aplicación diferente con el stack tecnológico de tu elección.

1. **Repositorio actualizado** con:
   - Configuración de herramientas de coverage (para tu stack elegido)
   - Configuración de análisis estático (SonarCloud, CodeClimate, etc.)
   - Pruebas de integración E2E (Cypress, Playwright, Selenium, etc.)
   - Pipeline CI/CD modificado con todas las integraciones

2. **Documento técnico** (formato PDF o Markdown) que incluya:
   - **Justificación tecnológica**: Stack elegido y por qué
   - Análisis de cobertura inicial vs. final
   - Capturas de pantalla de reportes de análisis estático
   - Descripción de los casos de prueba de integración implementados
   - Documentación de la configuración del pipeline
   - Reflexión personal sobre la importancia de estas herramientas en el desarrollo

3. **Demo funcional** donde puedas mostrar:
   - Ejecución de pruebas con reporte de coverage
   - Análisis en SonarCloud
   - Ejecución de pruebas de integración
   - Pipeline completo funcionando

### Criterios de Evaluación

- **Implementación técnica (20%)**: Correcta configuración e integración de todas las herramientas
- **Calidad del código (20%)**: Mejoras implementadas basadas en análisis estático y coverage
- **Documentación (20%)**: Claridad y completitud de la documentación técnica
- **Defensa oral (40%)**: Capacidad de explicar decisiones técnicas y conceptos implementados


### Notas Adicionales
- La defensa oral es **obligatoria** para aprobar
- Cualquier evidencia de copia resultará en desaprobación automática




