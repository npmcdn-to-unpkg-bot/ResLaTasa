export class ServiceResponse {

    public err: number;
    public message: string;
    public p_data: any;

    constructor(
    ) { }

    public isError(): boolean {
        return this.err != 0 ? true : false;
    }
    
    public fromJson(json: any){
        try {
            this.err = json.err;
            this.message = json.message;
            this.p_data = json.p_data;
        } catch (Error) {
            throw Error;
        }
    }
}