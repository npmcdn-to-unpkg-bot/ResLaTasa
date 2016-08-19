export class RFC{
  private nombres: string;
  private apellido_paterno: string;
  private apellido_materno: string;
  private fechaNacimiento: Date;
  private nombresOriginal: string;
  private apellido_paternoOriginal: string;
  private apellido_maternoOriginal: string;
  constructor(
    nombres: string,
    apellido_paterno: string,
    apellido_materno: string,
    fechaNacimiento: Date
  ){

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

  public calcularRFCCompleta():string{
    let rfc:string = '';
    rfc = this.cambiarInconvenientes(this.calcularLetras());
    rfc += this.calcularNumeros();
    rfc += this.calcularHomoclave();
    rfc += this.calcularDigitoVerificador(rfc);
    return  rfc;
  }
  public calcularRFC():string{
    let rfc:string = '';
    rfc = this.cambiarInconvenientes(this.calcularLetras());
    rfc += this.calcularNumeros();
    return  rfc;
  }

  private normalizarCampo(valor:string): string{
    let resultado = valor.toUpperCase().trim();
    //Eliminar Acentos
    resultado = this.eliminarAcentos(resultado);
    resultado = this.eliminarPalabras(resultado);
    

    return resultado;
  }

  //Solo Mayusculas
  private eliminarAcentos(valor:string): string{
    let resultado = valor;
    resultado = resultado.replace(new RegExp('Á', 'g'), 'A');
    resultado = resultado.replace(new RegExp('É', 'g'), 'E');
    resultado = resultado.replace(new RegExp('Í', 'g'), 'I');
    resultado = resultado.replace(new RegExp('Ó', 'g'), 'O');
    resultado = resultado.replace(new RegExp('Ú', 'g'), 'U');
    return resultado;
  }

  //Solo Mayusculas
  private eliminarPalabras(valor:string): string{
    let palabrasNoPermitidas = [" PARA ", " AND ", " CON ", " DEL ",
      " LAS ", " LOS ", " MAC ", " POR ", " SUS ", " THE ", " VAN ",
      " VON ", " AL ", " DA ", " DE ", " EL ", " EN ", " LA ", " MC ",
      " MI "," OF ", " A ", " E ", " Y ", " DI ", " DEGLI ", " DALL ",
      " DELLA ", " D ", " DES ", " DU ", " VAM ", " VAMDEN ", " VANDER "];
    let resultado = " " + valor;
    
    palabrasNoPermitidas.forEach(palabra =>{
      resultado = resultado.replace(new RegExp(palabra, 'g'), '');
    });

    return resultado.trim();
  }
  
  /*Solo Mayusculas
  Omitir los nombress María y José siempre y cuando la persona tenga un segundo nombre
  */
  private eliminarNombresComunes(valor: string): string{
    let nombresComunesEliminar = [" MARIA ", " JOSE ", " MA. ", " MA ", " J. ", " J "];
    let resultado = valor;
    if(resultado.split(' ').length > 1 ) {
      nombresComunesEliminar.forEach((nombre =>{
        resultado = resultado.replace(new RegExp(nombre, 'g'), '');
      }))
    }

    return resultado.trim();
  }

  //Despues de normalizar los campos
  private calcularLetras(): string{
    let vocales = 'AEIOU';
    let letras: string;
    let vocal: string;
    if(this.apellido_materno.length === 0){
      letras = this.apellido_paterno.substr(0,2) + this.nombres.substr(0,2);
    } else if (this.apellido_paterno.length < 3){
      letras = this.apellido_paterno.substr(0,1) + this.apellido_materno.substr(0,1) + this.nombres.substr(0,2);
    } else{
      for (let indice = 1; this.apellido_paterno.length; indice++){
        if(vocales.indexOf(this.apellido_paterno.charAt(indice)) >= 0){
          vocal = this.apellido_paterno.charAt(indice)
          break;
        }
      }
      letras = this.apellido_paterno.substr(0,1)  + vocal + this.apellido_materno.substr(0,1) + this.nombres.substr(0,1);
    }
    return letras;
  }

  private cambiarInconvenientes(valor: string): string{
    let inconvenientes = ["BUEI", "BUEY", "CACA", "CACO", "CAGA", "CAGO",
      "CAKA", "CAKO", "COGE", "COJA", "COJE", "COJI", "COJO", "CULO", "FETO",
      "GUEY", "JOTO", "KACA", "KACO", "KAGA", "KAGO", "KAKA", "KOGE", "KOJO",
      "KULO", "MAME", "MAMO", "MEAR", "MEAS", "MEON", "MION", "MOCO", "MULA", 
      "PEDA", "PEDO", "PENE", "PUTA", "PUTO","QULO", "RATA", "RUIN"];
    let resultado = valor;
    inconvenientes.forEach(palabra => {
      if(palabra == resultado){
        resultado = resultado.substr(0,3) + 'X';
        return;
      }
    });
    return resultado;
  }

  private calcularNumeros(): string{
    let anio: string = this.fechaNacimiento.getFullYear().toString().substr(2,2);
    let mes = (this.fechaNacimiento.getMonth()+ 1) < 10 ? ('0' +  (this.fechaNacimiento.getMonth() + 1)) : (this.fechaNacimiento.getMonth() + 1);
    let dia = (this.fechaNacimiento.getDate()) < 10 ? ('0' +  (this.fechaNacimiento.getDate())) : (this.fechaNacimiento.getDate());
    return anio + mes + dia;
  }

  /*
  A cada letra del nombre y apellidos de la persona se les da una equivalencia numérica y entonces
  se multiplica digito por dígito para sumar el resultado a los anteriores. La suma acumulada final
  será truncada para obtener los últimos 3 dígitos y ser divididos por 34 y obtener tanto el cociente
  como el residuo que tendrán una equivalencia en letras que formarán las posiciones 11 y 12 del RFC.
  */
  private calcularHomoclave(): string{
    let numeros = '0';
    let suma =0;
    let alfabeto = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    let nom = this.eliminarAcentos(this.nombresOriginal.toUpperCase().trim());
    let ap =  this.eliminarAcentos(this.apellido_paternoOriginal.toUpperCase().trim());
    let am = this.eliminarAcentos(this.apellido_maternoOriginal.toUpperCase().trim());
    let nombre_completo = nom + ' ' + ap + ' ' + am;
    
    for(let i = 0; i < nombre_completo.length; i++){
        let letra = nombre_completo.charAt(i);
        if(letra == ' '){
          numeros += "00";
        } else if(letra == '&'){
          numeros += "10";
        } else if(letra == 'Ñ'){
          numeros += "40";
        } else if(letra >= 'A' && letra <= 'I'){
          numeros += nombre_completo.charCodeAt(i) - 54;
        }else if(letra >= 'J' && letra <= 'R'){
          numeros +=  nombre_completo.charCodeAt(i) - 53;
        }else if(letra >= 'S' && letra <= 'Z'){
          numeros +=  nombre_completo.charCodeAt(i) - 51;
        }
    }
    for(let i = 0; i < numeros.length -1 ; i++){
      let num1 = parseInt(numeros.substr(i,2));
      let num2 = parseInt(numeros.substr(i+1, 1));
      suma += num1 * num2;
    }
    let sumaStr = suma.toString();
    let cociente = Math.floor(parseInt(sumaStr.substr(sumaStr.length -3)) / 34);
    let residuo = Math.floor(parseInt(sumaStr.substr(sumaStr.length -3)) % 34);
    return alfabeto.charAt(cociente) + alfabeto.charAt(residuo);
  }

  /*
  Para obtener la última posición del RFC se utilizará un método similar a la función anterior solo que en
  lugar de tomar como base el nombre y apellidos, se tomará en cuenta la cadena de texto de las 12 posiciones
  del RFC generadas hasta el momento. Se sustituirá cada una de las posiciones por un número equivalente y se
  realizará una multiplicación y suma de cada uno de ellos para obtener una suma total de la cual obtendremos
  el residuo de la división entre 11
  */
  private calcularDigitoVerificador(rfc12Caracteres: string): string{
    let numeros= '';
    let suma =0;
    let resultado: string;
    for(let i = 0; i < rfc12Caracteres.length; i++){
        let letra = rfc12Caracteres.charAt(i);
        if(letra == ' '){
          numeros += "37";
        } else if(letra == '&'){
          numeros += "24";
        } else if(letra == 'Ñ'){
          numeros += "38";
        } else if(letra >= 'A' && letra <= 'N'){
          numeros += rfc12Caracteres.charCodeAt(i) - 55;
        }else if(letra >= 'O' && letra <= 'Z'){
          numeros +=  rfc12Caracteres.charCodeAt(i) - 54;
        }else if(letra >= '0' && letra <= '9'){
          numeros +=  '0' + letra;
        }
    }

    let sumador = 0;
    for(let i = 0; i < numeros.length; i+= 2){
      let num = parseInt(numeros.substr(i,2));
      suma += num *(13 - sumador);
      sumador++;
    }

    let residuo = suma % 11;

    if(residuo == 0){
      resultado = '0';
    }else if(residuo == 10){
      resultado = 'A';
    }else{
      resultado = (11 - residuo).toString();
    }
    return resultado;
  }
}