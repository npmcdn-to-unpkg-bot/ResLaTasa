"use strict";
var PrestatarioDomicile = (function () {
    function PrestatarioDomicile(calle, numeroext, numeroint, codigo_postal, estado, id_estado, ciudad, delegacion_municipio, colonia) {
        this.calle = calle;
        this.numeroext = numeroext;
        this.numeroint = numeroint;
        this.codigo_postal = codigo_postal;
        this.estado = estado;
        this.id_estado = id_estado;
        this.ciudad = ciudad;
        this.delegacion_municipio = delegacion_municipio;
        this.colonia = colonia;
    }
    return PrestatarioDomicile;
}());
exports.PrestatarioDomicile = PrestatarioDomicile;
//# sourceMappingURL=prestatario_domicilio.js.map