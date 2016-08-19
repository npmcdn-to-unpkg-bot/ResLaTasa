"use strict";
var PrestatarioCotizadorModel = (function () {
    function PrestatarioCotizadorModel(monto, plazo, aplica, tasa_min, tasa_max, factor_min_pago, factor_max_pago, pago_mensual_min, pago_mensual_max, deuda_anterior, //si -1-/no-0 
        monto_deuda, pago_mensual, aplicado_en, aplicado_otro) {
        this.monto = monto;
        this.plazo = plazo;
        this.aplica = aplica;
        this.tasa_min = tasa_min;
        this.tasa_max = tasa_max;
        this.factor_min_pago = factor_min_pago;
        this.factor_max_pago = factor_max_pago;
        this.pago_mensual_min = pago_mensual_min;
        this.pago_mensual_max = pago_mensual_max;
        this.deuda_anterior = deuda_anterior;
        this.monto_deuda = monto_deuda;
        this.pago_mensual = pago_mensual;
        this.aplicado_en = aplicado_en;
        this.aplicado_otro = aplicado_otro;
    }
    return PrestatarioCotizadorModel;
}());
exports.PrestatarioCotizadorModel = PrestatarioCotizadorModel;
//# sourceMappingURL=prestatario_cotizador.js.map