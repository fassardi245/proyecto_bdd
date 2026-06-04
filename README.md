# proyecto_bd - Dashboard Analítico de Gestión (Final BDD - UAI)

Este proyecto es una plataforma web de analítica y monitoreo desarrollada como trabajo final para la materia Base de Datos en la carrera de Ingeniería en Sistemas Informáticos (UAI). El sistema actúa como un panel de control centralizado para la administración de un centro de gimnasia ("GYM"), consumiendo una estructura relacional de datos para procesar y visualizar estadísticas, gráficos de estado y flujos de control financiero.

## 📊 Funcionamiento del Sistema

A diferencia de un sistema de carga manual, esta plataforma está diseñada con un enfoque puramente analítico y de auditoría:
1. **Población de Datos (Seeding):** El entorno relacional se alimenta de forma automatizada mediante un script de inicialización (`prisma/seed.ts`), que impacta los registros de prueba estructurados directamente en el motor de base de datos.
2. **Procesamiento de Lógica de Negocio:** El sistema consume esos registros e implementa la lógica necesaria para calcular métricas en tiempo real, tales como el porcentaje de socios al día, clasificaciones de deudas y estados de pagos.
3. **Visualización en Dashboard:** La interfaz gráfica procesa los datos crudos de la base y los transforma de manera automática en componentes visuales, estadísticas y reportes organizados para el administrador.

## 🧩 Módulos y Reportes del Dashboard

El panel de administración se divide en módulos clave tras superar la pantalla de autenticación segura (Login):

- **Módulo de Inicio (Métricas Generales):** Presenta de forma visual los indicadores clave del gimnasio (Total de Socios con Plan, Pagos Realizados, Socios al Día y Socios con Deudas).
- **Módulo de Planes y Finanzas:** Desglosa los tipos de planes vigentes (Mensual, Trimestral, Anual), mostrando sus costos y la cantidad de socios adheridos a cada uno.
- **Control de Deudores:** Clasifica de forma analítica el estado financiero de los clientes vinculados al plan seleccionado, separando a los socios "Al día" de aquellos con "Deuda leve" o "Deuda grave", calculando automáticamente el total adeudado.
- **Auditoría de Pagos e Historial:** Permite auditar el comportamiento de pagos de un socio específico, cruzando la fecha esperada contra la fecha real, el método utilizado y el estado del período (Pagado, Vencido, Pendiente).
- **Listados de Control de Entorno:** Tablas de reportes consolidados con la información completa de Socios (Edad, Email, Estado, Fecha de Alta) e Historial General de Transacciones.

## 🏗️ Modelo de Datos (Prisma ORM)

El backend mapea un diseño relacional estructurado que garantiza la consistencia del negocio a través de las siguientes entidades interconectadas:

- `Socio`: Entidad central que almacena los datos personales, estado del cliente y vincula de forma directa su asistencia, plan y rutina asignada.
- `Plan` y `Rutina`: Define las características y costos de las membresías junto con las especificaciones técnicas del entrenamiento.
- `Pago`: Registra las transacciones, montos, métodos de pago y estados financieros vinculados al socio.
- `Asistencia`: Almacena las marcas temporales y el presentismo de los socios a las distintas clases.

## 💻 Stack Tecnológico

- **Frontend:** Next.js 15 (App Router), React 19 y TypeScript.
- **Estilos y UI:** Tailwind CSS v4.
- **ORM:** Prisma Client & Migrations.
- **Base de Datos:** PostgreSQL (Persistencia Relacional).
- **Seguridad:** Autenticación protegida con encriptación mediante bcryptjs.
