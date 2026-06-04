import { prisma } from '@/lib/prisma'

function pct(value: number, total: number) {
  const safeTotal = Math.max(total, 1)
  return Math.min(100, Math.round((value / safeTotal) * 100))
}

export default async function DashboardPage() {
  const [totalSocios, sociosConPlan, pagosPagados, pagosPendientes, pagosVencidos] =
    await Promise.all([
      prisma.socio.count(), 
      prisma.socio.count({ where: { planId: { not: null }, estado: 'activo' } }), 
      prisma.pago.count({ where: { estado: 'pagado' } }),
      prisma.pago.count({ where: { estado: 'pendiente' } }),
      prisma.pago.count({ where: { estado: 'vencido' } }),
    ])

  const totalPagos = pagosPagados + pagosPendientes + pagosVencidos

  const pagosPorSocio = await prisma.pago.groupBy({
    by: ['socioId', 'estado'],
    _count: { _all: true },
  })

  const vencidosMap = new Map<number, number>()
  pagosPorSocio.forEach(row => {
    if (row.estado === 'vencido') {
      vencidosMap.set(row.socioId, (vencidosMap.get(row.socioId) ?? 0) + row._count._all)
    }
  })

  const todosLosSocios = await prisma.socio.findMany({
    select: { id: true },
  })

  let alDia = 0
  let conDeudas = 0

  todosLosSocios.forEach(s => {
    const v = vencidosMap.get(s.id) ?? 0
    if (v > 0) conDeudas++
    else alDia++
  })

  const cards = [
    { title: 'Socios con Plan', value: `${sociosConPlan} de ${totalSocios}`, percent: pct(sociosConPlan, totalSocios) },
    { title: 'Pagos realizados', value: `${pagosPagados} de ${totalPagos}`, percent: pct(pagosPagados, totalPagos) },
    { title: 'Socios al día', value: `${alDia} de ${totalSocios}`, percent: pct(alDia, totalSocios) },
    { title: 'Socios con Deudas', value: `${conDeudas} de ${totalSocios}`, percent: pct(conDeudas, totalSocios) },
  ]

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-neutral-900 tracking-tight">
        Inicio
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {cards.map((c, i) => (
          <CardKPI key={i} title={c.title} value={c.value} percent={c.percent} />
        ))}
      </section>
    </main>
  )
}

function CardKPI({ title, value, percent }: { title: string; value: string; percent: number }) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 p-6 shadow-[0_6px_18px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-transform duration-300">
      <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-3 tracking-tight">
        {title}
      </h2>

      <div className="text-2xl font-semibold text-white mb-4">{value}</div>

      <div className="w-full h-3 rounded-full bg-white/80 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-black transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 text-sm font-semibold text-black/70">{percent}%</div>
    </div>
  )
}


