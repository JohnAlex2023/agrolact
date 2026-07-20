export interface Socio {
  id: string;
  nombres: string;
  cedula: string;
  celular: string;
  activo: boolean;
  created_at?: string;
  registros_leche?: RegistroLeche[];
  liquidaciones?: Liquidacion[];
}

export interface Quincena {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  precio_litro: string | null;
  estado: 'ABIERTA' | 'CERRADA';
  creado_por: string;
  created_at?: string;
}

export interface RegistroLeche {
  id: string;
  socio_id: string;
  quincena_id: string;
  fecha: string;
  jornada: 'MANANA' | 'TARDE';
  litros: string;
  socio?: Socio;
}

export interface Liquidacion {
  id: string;
  quincena_id: string;
  socio_id: string;
  total_litros: string;
  valor_bruto: string;
  descuento_adelantos: string;
  descuento_fiados: string;
  saldo_deuda_anterior: string;
  neto_pagar: string;
  saldo_nuevo: string;
  socio?: Socio;
  quincena?: Quincena;
}

export interface Adelanto {
  id: string;
  socio_id: string;
  fecha: string;
  valor: string;
  abono_acordado: string | null;
  observacion: string | null;
  saldo_restante?: number;
  socio?: Socio;
}

export interface Producto {
  id: string;
  nombre: string;
  unidad_medida: string;
  activo: boolean;
}

export interface VentaTienda {
  id: string;
  socio_id: string;
  producto_id: string;
  tipo: 'CONTADO' | 'FIADO';
  cantidad: string;
  precio_unitario: string;
  total: string;
  descontado: boolean;
  socio?: Socio;
  producto?: Producto;
}

export interface GastoOperativo {
  id: string;
  quincena_id: string;
  concepto: string;
  valor: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}
