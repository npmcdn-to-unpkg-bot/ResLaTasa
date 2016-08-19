import {PrestatarioPerfilModel} from './prestatario_perfil'
import {PrestatarioCotizadorModel} from './prestatario_cotizador'
import {PrestatarioDomicile} from './prestatario_domicilio'
import {PrestatarioIdentificacionModel} from './prestatario_identificacion'
import {PrestatarioLaboral} from './prestatario_laboral'

export class PrestatarioAltaModel{
    public cotizador: PrestatarioCotizadorModel;
    public perfil : PrestatarioPerfilModel;
    public identificacion: PrestatarioIdentificacionModel;
    public domicilio: PrestatarioDomicile;
    public laboral: PrestatarioLaboral;
}