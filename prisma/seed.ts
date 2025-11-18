import { PrismaClient, EstadoPago, MetodoPago, EstadoSocio, ObjetivoRutina } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function d(y: number, m: number, day: number) {
  return new Date(Date.UTC(y, m - 1, day, 12, 0, 0))
}

let paidCounter = 0


function getFechaReal(fechaEsperada: Date): Date {
  paidCounter++

  const newDate = new Date(fechaEsperada) 

  if (paidCounter % 2 === 1) {

  } else {
    const daysBefore = (paidCounter % 3) + 1
    newDate.setDate(newDate.getDate() - daysBefore)
  }
  return newDate
}

async function findOrCreatePlan(tipo: string, costo: number) {
  let plan = await prisma.plan.findFirst({ where: { tipo } })
  if (!plan) {
    plan = await prisma.plan.create({
      data: { tipo, costo, estado: 'activo' },
    })
  }
  return plan
}

async function crearPago(params: {
  socioId: number
  fechaEsperada: Date
  fechaReal?: Date | null
  monto: number
  metodo?: MetodoPago | null
}) {
  const { socioId, fechaEsperada, fechaReal, monto, metodo } = params

  const fechaPagoValida =
    fechaReal && new Date(fechaReal) <= new Date() ? fechaReal : null

  let estado: EstadoPago
  if (!fechaPagoValida) {
    estado = new Date() > fechaEsperada ? EstadoPago.vencido : EstadoPago.pendiente
  } else {
    
    estado = fechaPagoValida > fechaEsperada ? EstadoPago.vencido : EstadoPago.pagado
  }

  return prisma.pago.create({
    data: {
      socioId,
      fechaEsperada,
      fechaReal: fechaPagoValida,
      monto,
      metodo: metodo ?? null,
      estado,
    },
  })
}

async function asistenciasConRutina(socioId: number, rutinaId: number, dias = 7) {
  const hoy = new Date()
  for (let i = 0; i < dias; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() - i) 
    await prisma.asistencia.create({
      data: {
        socioId,
        rutinaId,
        fecha,
      },
    })
  }
}

async function main() {
  console.log('🔄 Iniciando seed...')

  const mensual = await findOrCreatePlan('Mensual', 20000)
  const trimestral = await findOrCreatePlan('Trimestral', 52000)
  const anual = await findOrCreatePlan('Anual', 220000)

  const rFuerza = await prisma.rutina.create({
    data: { nombre: 'Fuerza Total', nivel: 'Intermedio', duracion: 8, objetivo: ObjetivoRutina.fuerza },
  })
  const rVolumen = await prisma.rutina.create({
    data: { nombre: 'Volumen Máximo', nivel: 'Avanzado', duracion: 12, objetivo: ObjetivoRutina.volumen },
  })
  const rCardio = await prisma.rutina.create({
    data: { nombre: 'Cardio Intenso', nivel: 'Inicial', duracion: 6, objetivo: ObjetivoRutina.cardio },
  })
  const rMixta = await prisma.rutina.create({
    data: { nombre: 'Funcional Mixto', nivel: 'Intermedio', duracion: 10, objetivo: ObjetivoRutina.mixto },
  })
  const rHipertrofia = await prisma.rutina.create({
    data: { nombre: 'Hipertrofia Pro', nivel: 'Avanzado', duracion: 16, objetivo: ObjetivoRutina.volumen },
  })

  const socios = await prisma.$transaction([
    prisma.socio.create({
      data: { nombre: 'Juan', apellido: 'Pérez', edad: 28, email: 'juan@example.com', estado: EstadoSocio.inactivo, fechaAlta: d(2024, 5, 11), planId: mensual.id, rutinaId: rFuerza.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Teo', apellido: 'Fassardi', edad: 21, email: 'teo@example.com', estado: EstadoSocio.activo, fechaAlta: d(2023, 8, 11), planId: mensual.id, rutinaId: rCardio.id },
    }),
    prisma.socio.create({
      data: { nombre: 'María', apellido: 'Gómez', edad: 32, email: 'maria@example.com', estado: EstadoSocio.activo, planId: anual.id, rutinaId: rVolumen.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Lucas', apellido: 'Rodríguez', edad: 25, email: 'lucas@example.com', estado: EstadoSocio.activo, planId: mensual.id, rutinaId: rCardio.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Laura', apellido: 'Fernández', edad: 30, email: 'laura@example.com', estado: EstadoSocio.activo, planId: trimestral.id, rutinaId: rVolumen.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Martín', apellido: 'Sosa', edad: 27, email: 'martin@example.com', estado: EstadoSocio.activo, planId: mensual.id, rutinaId: rFuerza.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Sofía', apellido: 'López', edad: 29, email: 'sofia@example.com', estado: EstadoSocio.activo, planId: trimestral.id, rutinaId: rCardio.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Diego', apellido: 'Ramírez', edad: 31, email: 'diego@example.com', estado: EstadoSocio.activo, planId: anual.id, rutinaId: rFuerza.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Valentina', apellido: 'Mendoza', edad: 26, email: 'valentina@example.com', estado: EstadoSocio.activo, planId: mensual.id, rutinaId: rVolumen.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Carlos', apellido: 'Moreno', edad: 40, email: 'carlos@example.com', estado: EstadoSocio.activo, planId: mensual.id, rutinaId: rFuerza.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Ana', apellido: 'Suárez', edad: 24, email: 'ana@example.com', estado: EstadoSocio.activo, planId: mensual.id, rutinaId: rMixta.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Bruno', apellido: 'Castro', edad: 35, email: 'bruno@example.com', estado: EstadoSocio.activo, planId: trimestral.id, rutinaId: rHipertrofia.id },
    }),
    prisma.socio.create({
      data: { nombre: 'Pedro', apellido: 'Linares', edad: 33, email: 'pedro@example.com', estado: EstadoSocio.activo, planId: mensual.id, rutinaId: rMixta.id },
    }),
  ])

  const [sJuan, sTeo, sMaria, sLucas, sLaura, sMartin, sSofia, sDiego, sValentina, sCarlos, sAna, sBruno, sPedro] = socios

  await crearPago({ socioId: sJuan.id, fechaEsperada: d(2024, 7, 1), monto: 20000 })
  await crearPago({ socioId: sJuan.id, fechaEsperada: d(2024, 8, 1), monto: 20000 })
  await crearPago({ socioId: sJuan.id, fechaEsperada: d(2024, 9, 1), monto: 20000 })

  await crearPago({ socioId: sTeo.id, fechaEsperada: d(2024, 7, 27), monto: 20000 })
  await crearPago({ socioId: sTeo.id, fechaEsperada: d(2024, 8, 27), monto: 20000 })

  await crearPago({ socioId: sMaria.id, fechaEsperada: d(2024, 1, 10), fechaReal: getFechaReal(d(2024, 1, 10)), monto: 220000, metodo: MetodoPago.transferencia })
  await crearPago({ socioId: sMaria.id, fechaEsperada: d(2025, 1, 10), fechaReal: null, monto: 220000, metodo: null })

  await crearPago({ socioId: sLucas.id, fechaEsperada: d(2024, 7, 1), fechaReal: getFechaReal(d(2024, 7, 2)), monto: 20000, metodo: MetodoPago.efectivo})
  await crearPago({ socioId: sLucas.id, fechaEsperada: d(2024, 8, 1), monto: 20000 })

  await crearPago({ socioId: sLaura.id, fechaEsperada: d(2024, 6, 10), fechaReal: getFechaReal(d(2024, 6, 10)), monto: 52000, metodo: MetodoPago.efectivo })
  await crearPago({ socioId: sLaura.id, fechaEsperada: d(2024, 9, 10), monto: 52000 })

  await crearPago({ socioId: sMartin.id, fechaEsperada: d(2024, 7, 1), fechaReal: getFechaReal(d(2024, 7, 1)), monto: 20000, metodo: MetodoPago.tarjeta })
  await crearPago({ socioId: sMartin.id, fechaEsperada: d(2024, 8, 1), fechaReal: getFechaReal(d(2024, 8, 1)), monto: 20000, metodo: MetodoPago.debito })
  await crearPago({ socioId: sMartin.id, fechaEsperada: d(2024, 9, 1), fechaReal: getFechaReal(d(2024, 9, 1)), monto: 20000, metodo: MetodoPago.efectivo })

  await crearPago({ socioId: sSofia.id, fechaEsperada: d(2024, 5, 5), fechaReal: getFechaReal(d(2024, 5, 5)), monto: 52000, metodo: MetodoPago.transferencia })

  await crearPago({ socioId: sDiego.id, fechaEsperada: d(2024, 2, 15), fechaReal: getFechaReal(d(2024, 2, 15)), monto: 220000, metodo: MetodoPago.tarjeta })

  await crearPago({ socioId: sValentina.id, fechaEsperada: d(2024, 7, 1), fechaReal: getFechaReal(d(2024, 7, 1)), monto: 20000, metodo: MetodoPago.efectivo })
  await crearPago({ socioId: sValentina.id, fechaEsperada: d(2024, 8, 1), monto: 20000 })

  await crearPago({ socioId: sCarlos.id, fechaEsperada: d(2024, 6, 1), monto: 20000 })
  await crearPago({ socioId: sCarlos.id, fechaEsperada: d(2024, 7, 1), monto: 20000 })
  await crearPago({ socioId: sCarlos.id, fechaEsperada: d(2024, 8, 1), monto: 20000 })

  await crearPago({ socioId: sAna.id, fechaEsperada: d(2024, 7, 15), monto: 20000 })

  await crearPago({ socioId: sBruno.id, fechaEsperada: d(2025, 6, 11), fechaReal: getFechaReal(d(2025, 6, 11)), monto: 52000, metodo: MetodoPago.efectivo })

  await crearPago({ socioId: sPedro.id, fechaEsperada: d(2024, 8, 1), fechaReal: getFechaReal(d(2024, 8, 1)), monto: 20000, metodo: MetodoPago.transferencia })
  await crearPago({ socioId: sPedro.id, fechaEsperada: d(2024, 9, 1), fechaReal: getFechaReal(d(2024, 9, 1)), monto: 20000, metodo: MetodoPago.tarjeta })

  for (const s of socios) {
    if (s.estado === 'activo' && s.rutinaId) {
      await asistenciasConRutina(s.id, s.rutinaId, 7)
    }
  }

  const extraSocios = await prisma.$transaction([
    prisma.socio.create({ data: { nombre: 'Nicolás', apellido: 'Vega', edad: 22, email: 'nicolas.vega@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 2, 10), planId: mensual.id, rutinaId: rCardio.id } }),
    prisma.socio.create({ data: { nombre: 'Camila', apellido: 'Ortiz', edad: 29, email: 'camila.ortiz@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 3, 15), planId: mensual.id, rutinaId: rMixta.id } }),
    prisma.socio.create({ data: { nombre: 'Tomás', apellido: 'Aguilar', edad: 23, email: 'tomas.aguilar@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 5, 1), planId: mensual.id, rutinaId: rFuerza.id } }),
    prisma.socio.create({ data: { nombre: 'Micaela', apellido: 'Juárez', edad: 28, email: 'micaela.juarez@example.com', estado: EstadoSocio.inactivo, fechaAlta: d(2024, 3, 4), planId: mensual.id, rutinaId: rCardio.id } }),
    prisma.socio.create({ data: { nombre: 'Rocío', apellido: 'Varela', edad: 31, email: 'rocio.varela@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 6, 18), planId: mensual.id, rutinaId: rMixta.id } }),
    prisma.socio.create({ data: { nombre: 'Ezequiel', apellido: 'Silva', edad: 27, email: 'ezequiel.silva@example.com', estado: EstadoSocio.activo, fechaAlta: d(2023, 12, 28), planId: mensual.id, rutinaId: rFuerza.id } }),

    prisma.socio.create({ data: { nombre: 'Franco', apellido: 'Ruiz', edad: 25, email: 'franco.ruiz@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 4, 9), planId: trimestral.id, rutinaId: rCardio.id } }),
    prisma.socio.create({ data: { nombre: 'Carolina', apellido: 'Benítez', edad: 34, email: 'carolina.benitez@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 7, 6), planId: trimestral.id, rutinaId: rVolumen.id } }),
    prisma.socio.create({ data: { nombre: 'Julián', apellido: 'Maidana', edad: 27, email: 'julian.maidana@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 1, 8), planId: trimestral.id, rutinaId: rFuerza.id } }),
    prisma.socio.create({ data: { nombre: 'Paula', apellido: 'Acosta', edad: 33, email: 'paula.acosta@example.com', estado: EstadoSocio.activo, fechaAlta: d(2023, 11, 12), planId: trimestral.id, rutinaId: rHipertrofia.id } }),

    prisma.socio.create({ data: { nombre: 'Lucía', apellido: 'Torres', edad: 24, email: 'lucia.torres@example.com', estado: EstadoSocio.activo, fechaAlta: d(2024, 6, 2), planId: anual.id, rutinaId: rVolumen.id } }),
    prisma.socio.create({ data: { nombre: 'Agustina', apellido: 'Bravo', edad: 26, email: 'agustina.bravo@example.com', estado: EstadoSocio.activo, fechaAlta: d(2023, 9, 3), planId: anual.id, rutinaId: rMixta.id } }),
    prisma.socio.create({ data: { nombre: 'Leandro', apellido: 'Prieto', edad: 28, email: 'leandro.prieto@example.com', estado: EstadoSocio.inactivo, fechaAlta: d(2023, 8, 23), planId: anual.id, rutinaId: rCardio.id } }),
  ])

  for (const s of extraSocios) {
    const isMensual = s.planId === mensual.id
    const isTrimestral = s.planId === trimestral.id
    const isAnual = s.planId === anual.id

    const monto = isAnual ? 220000 : isTrimestral ? 52000 : 20000

    const bucket = s.id % 8 

    if (isMensual) {
      const e1 = d(2025, 7, 1)
      const e2 = d(2025, 8, 1)
      const e3 = d(2025, 9, 1)
      const e4 = d(2025, 10, 1) 
      if (bucket <= 4) {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.tarjeta })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: getFechaReal(e2), monto, metodo: MetodoPago.efectivo })
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: getFechaReal(e3), monto, metodo: MetodoPago.transferencia })
        await crearPago({ socioId: s.id, fechaEsperada: e4, fechaReal: null, monto, metodo: null }) // pendiente
      } else if (bucket <= 6) {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.debito })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: getFechaReal(e2), monto, metodo: MetodoPago.efectivo })
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: null, monto, metodo: null }) // vencido (sin pago)
        await crearPago({ socioId: s.id, fechaEsperada: e4, fechaReal: null, monto, metodo: null }) // pendiente
      } else {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.tarjeta })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: null, monto, metodo: null }) // vencido
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: null, monto, metodo: null }) // vencido
        await crearPago({ socioId: s.id, fechaEsperada: e4, fechaReal: null, monto, metodo: null }) // pendiente
      }
    }

    if (isTrimestral) {
      const e1 = d(2025, 3, 10)
      const e2 = d(2025, 6, 10)
      const e3 = d(2025, 9, 10)
      const e4 = d(2025, 12, 10) 

      if (bucket <= 4) {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.transferencia })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: getFechaReal(e2), monto, metodo: MetodoPago.tarjeta })
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: getFechaReal(e3), monto, metodo: MetodoPago.efectivo })
        await crearPago({ socioId: s.id, fechaEsperada: e4, fechaReal: null, monto, metodo: null }) // pendiente
      } else if (bucket <= 6) {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.efectivo })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: getFechaReal(e2), monto, metodo: MetodoPago.debito })
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: null, monto, metodo: null }) // vencido
        await crearPago({ socioId: s.id, fechaEsperada: e4, fechaReal: null, monto, metodo: null }) // pendiente
      } else {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.tarjeta })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: null, monto, metodo: null }) // vencido
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: null, monto, metodo: null }) // vencido
        await crearPago({ socioId: s.id, fechaEsperada: e4, fechaReal: null, monto, metodo: null }) // pendiente
      }
    }

    if (isAnual) {
      const e1 = d(2024, 2, 15)
      const e2 = d(2025, 2, 15)
      const e3 = d(2026, 2, 15) 

      if (bucket <= 4) {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.tarjeta })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: getFechaReal(e2), monto, metodo: MetodoPago.transferencia })
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: null, monto, metodo: null }) // pendiente
      } else if (bucket <= 6) {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.efectivo })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: null, monto, metodo: null }) // vencido
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: null, monto, metodo: null }) // pendiente
      } else {
        await crearPago({ socioId: s.id, fechaEsperada: e1, fechaReal: getFechaReal(e1), monto, metodo: MetodoPago.debito })
        await crearPago({ socioId: s.id, fechaEsperada: e2, fechaReal: null, monto, metodo: null }) // vencido
        await crearPago({ socioId: s.id, fechaEsperada: e3, fechaReal: null, monto, metodo: null }) // pendiente
      }
    }
  }

  for (const s of extraSocios) {
    if (s.estado === EstadoSocio.activo && s.rutinaId) {
      await asistenciasConRutina(s.id, s.rutinaId, 7 + (s.id % 6))
    }
  }

  const hashedPassAdmin = await bcrypt.hash('teo123', 10)
  await prisma.usuario.upsert({
    where: { email: 'admin@gimnasio.com' },
    update: {},
    create: { email: 'admin@gimnasio.com', password: hashedPassAdmin, role: 'admin' },
  })

  console.log('✅ Seed completado correctamente.')
}

main()
  .then(() => console.log('🌱 Datos cargados con éxito'))
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })