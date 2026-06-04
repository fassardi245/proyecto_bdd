import { prisma } from '@/lib/prisma'

export default async function RutinasPage() {
  const rutinas = await prisma.rutina.findMany({
    include: { _count: { select: { socios: true } } },
    orderBy: { nombre: 'asc' },
  })

  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh] px-6 pt-20 pb-10 bg-white">
      <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight mb-12 text-center">
        Rutinas del Gimnasio
      </h1>

      <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-5xl border border-gray-200">
        <div className="grid grid-cols-5 bg-gradient-to-r from-orange-400 to-orange-500 font-semibold text-black p-3 text-center text-lg">
          <div>Nombre</div>
          <div>Nivel</div>
          <div>Duración</div>
          <div>Objetivo</div>
          <div>Socios asignados</div>
        </div>

   
        {rutinas.length > 0 ? (
          rutinas.map((r, i) => (
            <div
              key={r.id}
              className={`grid grid-cols-5 items-center text-center text-base font-medium py-3 px-2 transition-all duration-200 ${
                i % 2 === 0 ? 'bg-orange-50' : 'bg-orange-100'
              } hover:bg-orange-200/70 border-b border-gray-300`}
            >
              <div className="font-semibold text-neutral-800">{r.nombre}</div>
              <div className="capitalize text-neutral-700">{r.nivel}</div>
              <div className="text-neutral-700">{r.duracion} semanas</div>
              <div className="capitalize text-neutral-700">{r.objetivo}</div>
              <div className="font-semibold text-neutral-800">{r._count.socios}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8 bg-orange-50 text-lg">
            No hay rutinas registradas.
          </div>
        )}
      </div>
    </main>
  )
}
