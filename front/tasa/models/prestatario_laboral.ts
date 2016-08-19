import {ComprobantesIngreso} from './comprobantes_ingresos'

export abstract class PrestatarioLaboral{
  public ocupacion: string;
  public nivelestudios: string;
  public ingreso_mensual_libre: string;
  public clave_ciec: string;
  public comprobante : Array<ComprobantesIngreso>;
  public subir_despues:boolean;
}