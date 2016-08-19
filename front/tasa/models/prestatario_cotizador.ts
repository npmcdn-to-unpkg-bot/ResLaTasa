export class PrestatarioCotizadorModel {
    constructor(
        public monto: number,
        public plazo: number,
        public aplica: string,
        public tasa_min: string,
        public tasa_max: string,
        public factor_min_pago: string,
        public factor_max_pago: string,
        public pago_mensual_min: number,
        public pago_mensual_max: number,
        public deuda_anterior: number,   //si -1-/no-0 
        public monto_deuda: number,
        public pago_mensual: number,
        public aplicado_en: string,
        public aplicado_otro: string
    ) {}
}