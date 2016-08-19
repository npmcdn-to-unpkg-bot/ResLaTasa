import { PrestatarioAltaModel } from './prestatario_alta'

export class PrestatarioSender{
    public username: string;
    public token: string;
    public prestatario_alta: any
    constructor(type: any){
        this.prestatario_alta = type;
    }
}