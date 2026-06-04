import { prisma } from '@/lib/prisma'

export default async function SociosPage() {
  const socios = await prisma.socio.findMany({
    include: { plan: true },
    orderBy: { apellido: 'asc' },
  })

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('es-AR').format(new Date(date))

  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh] px-6 pt-20 pb-10 bg-white">
      <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight mb-12 text-center">
        Listado de Socios
      </h1>

      <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-5xl border border-gray-200"> 
         <div className="grid grid-cols-6 bg-gradient-to-r from-orange-400 to-orange-500 font-semibold text-black p-3 text-center text-lg">
          <div>Nombre y Apellido</div>
          <div>Email</div>
          <div>Edad</div>
          <div>Plan</div>
          <div>Estado</div>
          <div>Fecha de Alta</div>
        </div>

        {socios.length > 0 ? (
          socios.map((s, i) => (
            <div
              key={s.id}
              className={`grid grid-cols-6 items-center text-center text-base font-medium py-3 px-2 transition-all duration-200 ${
                i % 2 === 0 ? 'bg-orange-50' : 'bg-orange-100'
              } hover:bg-orange-200/70 border-b border-gray-300`}
            >
              <div className="font-semibold text-neutral-800">{`${s.nombre} ${s.apellido}`}</div>
              <div className="truncate text-neutral-700">{s.email}</div>
              <div className="text-neutral-700">{s.edad ?? '—'}</div>
              <div className="capitalize text-neutral-700">{s.plan?.tipo.toLowerCase() ?? '—'}</div>
              <div
                className={`font-semibold ${
                  s.estado === 'activo'
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {s.estado}
              </div>
              <div className="text-neutral-700">
                {s.fechaAlta ? formatDate(s.fechaAlta) : '—'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8 bg-orange-50 text-lg">
            No hay socios registrados.
          </div>
        )}
      </div>
    </main>
  )
}
