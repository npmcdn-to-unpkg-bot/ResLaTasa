import { PrestatarioLaboral } from './prestatario_laboral'

export class PrestatarioLaboralEmpleado extends PrestatarioLaboral {
    public actividad_profesional: string;
    public tiempo_empleo_actual: string;
    public tipo_contratacion: string;
    public sector: string;
}
