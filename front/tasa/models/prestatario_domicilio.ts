export class PrestatarioDomicile {
    constructor(
        public calle: string,
        public numeroext: string,
        public numeroint: string,
        public codigo_postal: string,
        public estado: string,
        public id_estado: string,
        public ciudad: string,
        public delegacion_municipio: string,
        public colonia: string
    ) { }
}
