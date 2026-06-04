import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function PlanesPage() {
  const planes = await prisma.plan.findMany({
    include: { _count: { select: { socios: true } } },
    orderBy: { costo: 'asc' },
  })

  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh] px-6 pt-20 pb-10 bg-white">
      
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-16 text-center">
        Tipos de planes
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10 w-full max-w-6xl">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className="rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-3xl font-bold text-black mb-3">{plan.tipo}</h2>

            <div className="space-y-1 mb-6">
              <p className="text-black/80 font-medium text-lg">
                Costo:{' '}
                <span className="font-semibold">
                  ${plan.costo.toLocaleString('es-AR')}
                </span>
              </p>
              <p className="text-black/80 font-medium text-lg">
                Socios:{' '}
                <span className="font-semibold">{plan._count.socios}</span>
              </p>
            </div>

            <Link
              href={`/dashboard/planes/${plan.id}`}
              className="inline-block bg-black text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-md"
            >
              Ver socios
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
