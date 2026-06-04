import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PagosDelSocio({
  params,
}: {
  params: { planId: string; socioId: string };
}) {
  const socioId = Number(params.socioId);
  const planId = Number(params.planId);

  const socio = await prisma.socio.findUnique({
    where: { id: socioId },
    include: { pagos: { orderBy: { fechaEsperada: "asc" } } },
  });

  if (!socio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-xl text-gray-600">Socio no encontrado.</p>
        <Link
          href={`/dashboard/planes/${planId}`}
          className="mt-6 bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded font-semibold transition-all"
        >
          Volver a Socios del plan
        </Link>
      </div>
    );
  }

  const totalAdeudado = socio.pagos
    .filter((p) => p.estado === "vencido")
    .reduce((acc, p) => acc + p.monto, 0);

  const formatoFecha = (fecha?: Date | null) =>
    fecha ? new Date(fecha).toLocaleDateString("es-AR") : "—";

  const estadoColor = (estado: string) => {
    switch (estado) {
      case "pagado":
        return { texto: "Pagado", color: "text-green-600", icono: "🟢" };
      case "vencido":
        return { texto: "Vencido", color: "text-red-600", icono: "🔴" };
      case "pendiente":
      default:
        return { texto: "Pendiente", color: "text-yellow-500", icono: "🟡" };
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh] px-6 pt-20 pb-10 bg-white">
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-12 text-center">
        Pagos de {socio.nombre} {socio.apellido}
      </h1>

      <div className="rounded-xl overflow-hidden shadow-xl w-full max-w-4xl border border-gray-200">
        <div className="grid grid-cols-5 bg-gradient-to-r from-orange-400 to-orange-500 font-semibold text-black p-4 text-center text-lg">
          <div>Fecha esperada</div>
          <div>Fecha real</div>
          <div>Monto</div>
          <div>Método</div>
          <div>Estado</div>
        </div>

        {socio.pagos.length > 0 ? (
          socio.pagos.map((pago) => {
            const { texto, color, icono } = estadoColor(pago.estado);
            return (
              <div
                key={pago.id}
                className="grid grid-cols-5 items-center p-4 text-center text-base font-medium border-b border-white/20 bg-orange-100 hover:bg-orange-200/80 transition-all"
              >
                <div>{formatoFecha(pago.fechaEsperada)}</div>
                <div>{formatoFecha(pago.fechaReal)}</div>
                <div>${pago.monto.toLocaleString("es-AR")}</div>
                <div>{pago.metodo ?? "—"}</div>
                <div className={`${color} font-semibold`}>
                  {icono} {texto}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600 py-8 bg-orange-50">
            No hay pagos registrados para este socio.
          </div>
        )}
      </div>

      <div className="flex justify-between items-center w-full max-w-4xl mt-8">
        <Link
          href={`/dashboard/planes/${planId}`}
          className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-md font-semibold text-sm shadow-md transition-all"
        >
          Volver a Socios del plan
        </Link>

        <div className="font-semibold text-lg text-neutral-900">
          Total adeudado:{" "}
          <span className="text-red-600">
            ${totalAdeudado.toLocaleString("es-AR")}
          </span>
        </div>
      </div>
    </main>
  );
}
