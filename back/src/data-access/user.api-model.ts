import { Role } from "../user-session.js";

// Esta inerfaz marca qué formato tiene que tener el objeto User cuando lo mandamos del back hacia el front
export interface ApiUser { // nunca se pasa la password a la api
	id: string;
	name: string;
	email: string;
	role: Role;
}