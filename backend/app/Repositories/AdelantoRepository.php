<?php

namespace App\Repositories;

use App\Models\Adelanto;
use Illuminate\Database\Eloquent\Collection;

class AdelantoRepository
{
    public function create(array $datos): Adelanto
    {
        return Adelanto::create($datos);
    }

    /**
     * Adelantos de un socio que aun no han sido pagados por completo,
     * con el saldo restante calculado en el atributo "saldo_restante".
     */
    public function pendientesPorSocio(string $socioId): Collection
    {
        return Adelanto::where('socio_id', $socioId)
            ->withSum('abonos', 'monto')
            ->get()
            ->map(function (Adelanto $adelanto) {
                $adelanto->saldo_restante = round($adelanto->valor - ($adelanto->abonos_sum_monto ?? 0), 2);

                return $adelanto;
            })
            ->filter(fn (Adelanto $adelanto) => $adelanto->saldo_restante > 0)
            ->values();
    }
}
