import {TasaFileModel} from './tasa_file'
export class PrestatarioIdentificacionModel {
    public files: Array<TasaFileModel>;
    constructor(
        public lugar_nacimiento:string,
        public fecha_nacimiento:string,
        public rfc_homoclave:string,
        public estado_civil:string,
        public telefono_fijo:string,
        public celular:string,
        public type_id:string
 ) { }
}