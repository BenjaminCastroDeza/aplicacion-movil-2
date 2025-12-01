export class Usuario {
  static ultimoId = 0; // contador para autoincremento

  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;

  constructor(nombre: string, correo: string, contrasena: string, telefono: string, id?: number) {
    if (id != null) {
      this.id = id;
    } else {
      Usuario.ultimoId++;
      this.id = Usuario.ultimoId;
    }
    this.nombre = nombre;
    this.correo = correo;
    this.contrasena = contrasena;
    this.telefono = telefono;
  }
}
