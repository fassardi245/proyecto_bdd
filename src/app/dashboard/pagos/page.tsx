import { prisma } from '@/lib/prisma'

export default async function PagosPage() {
  const pagos = await prisma.pago.findMany({
    where: { estado: 'pagado' },
    include: { socio: { include: { plan: true } } },
    orderBy: { fechaReal: 'desc' },
  })

  const formatDate = (date: Date | null) =>
    date ? new Intl.DateTimeFormat('es-AR').format(new Date(date)) : '—'

  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh] px-6 pt-20 pb-10 bg-white">
      <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight mb-12 text-center">
        Pagos Realizados
      </h1>

      <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-5xl border border-gray-200">
        {/* Encabezado */}
        <div className="grid grid-cols-5 bg-gradient-to-r from-orange-400 to-orange-500 font-semibold text-black p-3 text-center text-lg">
          <div>Nombre y Apellido</div>
          <div>Plan</div>
          <div>Fecha</div>
          <div>Método de Pago</div>
          <div>Monto</div>
        </div>

        {pagos.length > 0 ? (
          pagos.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-5 items-center text-center text-base font-medium py-3 px-2 transition-all duration-200 ${
                i % 2 === 0 ? 'bg-orange-50' : 'bg-orange-100'
              } hover:bg-orange-200/70 border-b border-gray-300`}
            >
              <div className="font-semibold text-neutral-800">
                {p.socio ? `${p.socio.nombre} ${p.socio.apellido}` : '—'}
              </div>

              <div className="capitalize text-neutral-700">
                {p.socio?.plan?.tipo.toLowerCase() ?? '—'}
              </div>

              <div className="text-neutral-700">
                {formatDate(p.fechaReal)}
              </div>

              <div className="capitalize text-neutral-700">
                {p.metodo ?? '—'}
              </div>

              <div className="font-semibold text-neutral-800">
                ${p.monto.toLocaleString('es-AR')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8 bg-orange-50 text-lg">
            No hay pagos registrados aún.
          </div>
        )}
      </div>
    </main>
  )
}
