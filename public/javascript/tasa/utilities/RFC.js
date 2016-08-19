"use strict";
var RFC = (function () {
    function RFC(nombres, apellido_paterno, apellido_materno, fechaNacimiento) {
        this.nombres = this.normalizarCampo(nombres);
        this.nombres = this.eliminarNombresComunes(this.nombres);
        this.apellido_paterno = this.normalizarCampo(apellido_paterno);
        this.apellido_materno = this.normalizarCampo(apellido_materno);
        this.apellido_materno = this.normalizarCampo(apellido_materno);
        this.fechaNacimiento = fechaNacimiento;
        this.nombresOriginal = nombres;
        this.apellido_paternoOriginal = apellido_paterno;
        this.apellido_maternoOriginal = apellido_materno;
    }
    RFC.prototype.calcularRFCCompleta = function () {
        var rfc = '';
        rfc = this.cambiarInconvenientes(this.calcularLetras());
        rfc += this.calcularNumeros();
        rfc += this.calcularHomoclave();
        rfc += this.calcularDigitoVerificador(rfc);
        return rfc;
    };
    RFC.prototype.calcularRFC = function () {
        var rfc = '';
        rfc = this.cambiarInconvenientes(this.calcularLetras());
        rfc += this.calcularNumeros();
        return rfc;
    };
    RFC.prototype.normalizarCampo = function (valor) {
        var resultado = valor.toUpperCase().trim();
        //Eliminar Acentos
        resultado = this.eliminarAcentos(resultado);
        resultado = this.eliminarPalabras(resultado);
        return resultado;
    };
    //Solo Mayusculas
    RFC.prototype.eliminarAcentos = function (valor) {
        var resultado = valor;
        resultado = resultado.replace(new RegExp('Á', 'g'), 'A');
        resultado = resultado.replace(new RegExp('É', 'g'), 'E');
        resultado = resultado.replace(new RegExp('Í', 'g'), 'I');
        resultado = resultado.replace(new RegExp('Ó', 'g'), 'O');
        resultado = resultado.replace(new RegExp('Ú', 'g'), 'U');
        return resultado;
    };
    //Solo Mayusculas
    RFC.prototype.eliminarPalabras = function (valor) {
        var palabrasNoPermitidas = [" PARA ", " AND ", " CON ", " DEL ",
            " LAS ", " LOS ", " MAC ", " POR ", " SUS ", " THE ", " VAN ",
            " VON ", " AL ", " DA ", " DE ", " EL ", " EN ", " LA ", " MC ",
            " MI ", " OF ", " A ", " E ", " Y ", " DI ", " DEGLI ", " DALL ",
            " DELLA ", " D ", " DES ", " DU ", " VAM ", " VAMDEN ", " VANDER "];
        var resultado = " " + valor;
        palabrasNoPermitidas.forEach(function (palabra) {
            resultado = resultado.replace(new RegExp(palabra, 'g'), '');
        });
        return resultado.trim();
    };
    /*Solo Mayusculas
    Omitir los nombress María y José siempre y cuando la persona tenga un segundo nombre
    */
    RFC.prototype.eliminarNombresComunes = function (valor) {
        var nombresComunesEliminar = [" MARIA ", " JOSE ", " MA. ", " MA ", " J. ", " J "];
        var resultado = valor;
        if (resultado.split(' ').length > 1) {
            nombresComunesEliminar.forEach((function (nombre) {
                resultado = resultado.replace(new RegExp(nombre, 'g'), '');
            }));
        }
        return resultado.trim();
    };
    //Despues de normalizar los campos
    RFC.prototype.calcularLetras = function () {
        var vocales = 'AEIOU';
        var letras;
        var vocal;
        if (this.apellido_materno.length === 0) {
            letras = this.apellido_paterno.substr(0, 2) + this.nombres.substr(0, 2);
        }
        else if (this.apellido_paterno.length < 3) {
            letras = this.apellido_paterno.substr(0, 1) + this.apellido_materno.substr(0, 1) + this.nombres.substr(0, 2);
        }
        else {
            for (var indice = 1; this.apellido_paterno.length; indice++) {
                if (vocales.indexOf(this.apellido_paterno.charAt(indice)) >= 0) {
                    vocal = this.apellido_paterno.charAt(indice);
                    break;
                }
            }
            letras = this.apellido_paterno.substr(0, 1) + vocal + this.apellido_materno.substr(0, 1) + this.nombres.substr(0, 1);
        }
        return letras;
    };
    RFC.prototype.cambiarInconvenientes = function (valor) {
        var inconvenientes = ["BUEI", "BUEY", "CACA", "CACO", "CAGA", "CAGO",
            "CAKA", "CAKO", "COGE", "COJA", "COJE", "COJI", "COJO", "CULO", "FETO",
            "GUEY", "JOTO", "KACA", "KACO", "KAGA", "KAGO", "KAKA", "KOGE", "KOJO",
            "KULO", "MAME", "MAMO", "MEAR", "MEAS", "MEON", "MION", "MOCO", "MULA",
            "PEDA", "PEDO", "PENE", "PUTA", "PUTO", "QULO", "RATA", "RUIN"];
        var resultado = valor;
        inconvenientes.forEach(function (palabra) {
            if (palabra == resultado) {
                resultado = resultado.substr(0, 3) + 'X';
                return;
            }
        });
        return resultado;
    };
    RFC.prototype.calcularNumeros = function () {
        var anio = this.fechaNacimiento.getFullYear().toString().substr(2, 2);
        var mes = (this.fechaNacimiento.getMonth() + 1) < 10 ? ('0' + (this.fechaNacimiento.getMonth() + 1)) : (this.fechaNacimiento.getMonth() + 1);
        var dia = (this.fechaNacimiento.getDate()) < 10 ? ('0' + (this.fechaNacimiento.getDate())) : (this.fechaNacimiento.getDate());
        return anio + mes + dia;
    };
    /*
    A cada letra del nombre y apellidos de la persona se les da una equivalencia numérica y entonces
    se multiplica digito por dígito para sumar el resultado a los anteriores. La suma acumulada final
    será truncada para obtener los últimos 3 dígitos y ser divididos por 34 y obtener tanto el cociente
    como el residuo que tendrán una equivalencia en letras que formarán las posiciones 11 y 12 del RFC.
    */
    RFC.prototype.calcularHomoclave = function () {
        var numeros = '0';
        var suma = 0;
        var alfabeto = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
        var nom = this.eliminarAcentos(this.nombresOriginal.toUpperCase().trim());
        var ap = this.eliminarAcentos(this.apellido_paternoOriginal.toUpperCase().trim());
        var am = this.eliminarAcentos(this.apellido_maternoOriginal.toUpperCase().trim());
        var nombre_completo = nom + ' ' + ap + ' ' + am;
        for (var i = 0; i < nombre_completo.length; i++) {
            var letra = nombre_completo.charAt(i);
            if (letra == ' ') {
                numeros += "00";
            }
            else if (letra == '&') {
                numeros += "10";
            }
            else if (letra == 'Ñ') {
                numeros += "40";
            }
            else if (letra >= 'A' && letra <= 'I') {
                numeros += nombre_completo.charCodeAt(i) - 54;
            }
            else if (letra >= 'J' && letra <= 'R') {
                numeros += nombre_completo.charCodeAt(i) - 53;
            }
            else if (letra >= 'S' && letra <= 'Z') {
                numeros += nombre_completo.charCodeAt(i) - 51;
            }
        }
        for (var i = 0; i < numeros.length - 1; i++) {
            var num1 = parseInt(numeros.substr(i, 2));
            var num2 = parseInt(numeros.substr(i + 1, 1));
            suma += num1 * num2;
        }
        var sumaStr = suma.toString();
        var cociente = Math.floor(parseInt(sumaStr.substr(sumaStr.length - 3)) / 34);
        var residuo = Math.floor(parseInt(sumaStr.substr(sumaStr.length - 3)) % 34);
        return alfabeto.charAt(cociente) + alfabeto.charAt(residuo);
    };
    /*
    Para obtener la última posición del RFC se utilizará un método similar a la función anterior solo que en
    lugar de tomar como base el nombre y apellidos, se tomará en cuenta la cadena de texto de las 12 posiciones
    del RFC generadas hasta el momento. Se sustituirá cada una de las posiciones por un número equivalente y se
    realizará una multiplicación y suma de cada uno de ellos para obtener una suma total de la cual obtendremos
    el residuo de la división entre 11
    */
    RFC.prototype.calcularDigitoVerificador = function (rfc12Caracteres) {
        var numeros = '';
        var suma = 0;
        var resultado;
        for (var i = 0; i < rfc12Caracteres.length; i++) {
            var letra = rfc12Caracteres.charAt(i);
            if (letra == ' ') {
                numeros += "37";
            }
            else if (letra == '&') {
                numeros += "24";
            }
            else if (letra == 'Ñ') {
                numeros += "38";
            }
            else if (letra >= 'A' && letra <= 'N') {
                numeros += rfc12Caracteres.charCodeAt(i) - 55;
            }
            else if (letra >= 'O' && letra <= 'Z') {
                numeros += rfc12Caracteres.charCodeAt(i) - 54;
            }
            else if (letra >= '0' && letra <= '9') {
                numeros += '0' + letra;
            }
        }
        var sumador = 0;
        for (var i = 0; i < numeros.length; i += 2) {
            var num = parseInt(numeros.substr(i, 2));
            suma += num * (13 - sumador);
            sumador++;
        }
        var residuo = suma % 11;
        if (residuo == 0) {
            resultado = '0';
        }
        else if (residuo == 10) {
            resultado = 'A';
        }
        else {
            resultado = (11 - residuo).toString();
        }
        return resultado;
    };
    return RFC;
}());
exports.RFC = RFC;
//# sourceMappingURL=RFC.js.map