export class HeaderParameters {
    constructor(
        public title: string,
        public isLogged: boolean,
        public showButton: boolean,
        public isLanding: boolean = false
    ) {}
}