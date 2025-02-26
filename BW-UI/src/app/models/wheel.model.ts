import { Instrument } from "./instrument.model";

export class Wheel {
    constructor(id:string, layersJson:string, createdAt?:string, modifiedAt?:string) {
        this.id = id;
        this.layers = JSON.parse(layersJson);
        this.createdAt = this.formatDate(createdAt);
        this.modifiedAt = modifiedAt ? modifiedAt : '';
    }

    id: string = '';
    layers: Instrument[] = [];
    createdAt: string = '';
    modifiedAt: string = '';
    spin: boolean = false;

    private formatDate(dateString?:string): string {
        if (dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        return "";
    }
}




