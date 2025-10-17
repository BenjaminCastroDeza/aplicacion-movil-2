import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform, ToastController } from '@ionic/angular';
import { Usuario } from '../clases/usuario';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Dbusuario {
  public database!: SQLiteObject;  // objeto de la BD
  tblUsuarios: string = `CREATE TABLE IF NOT EXISTS usuario(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre VARCHAR(50) NOT NULL, 
    correo VARCHAR(50) NOT NULL, 
    contrasena VARCHAR(50) NOT NULL, 
    telefono VARCHAR(20) NOT NULL
  );`;

  listaUsuarios = new BehaviorSubject<Usuario[]>([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, public toastController: ToastController) {
    this.crearBD();
  }

  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'usuarios.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.presentToast('Base de datos creada');
        this.crearTabla();
      }).catch(e => {
        this.presentToast('Error al crear la base de datos: ' + e);
      });
    });
  }

  async crearTabla() {
    try {
      await this.database.executeSql(this.tblUsuarios, []);
      this.presentToast('Tabla de usuarios creada');
      this.cargarUsuarios();
      this.isDbReady.next(true);
    } catch (e) {
      this.presentToast('Error al crear la tabla de usuarios: ' + e);
    }
  }

  cargarUsuarios() {
    let items: Usuario[] = [];
    this.database.executeSql('SELECT * FROM usuario', []).then((res) => {
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            correo: res.rows.item(i).correo,
            contrasena: res.rows.item(i).contrasena,
            telefono: res.rows.item(i).telefono
          });
        }
      }
      console.log('Usuarios en DB',items);
      this.listaUsuarios.next(items);
    }).catch(err => console.log('Error al cargar usuarios', err));
  }

  async agregarUsuario(nombre: string, correo: string, contrasena: string, telefono: string) {
    let data = [nombre, correo, contrasena, telefono];
    await this.database.executeSql('INSERT INTO usuario (nombre, correo, contrasena, telefono) VALUES (?, ?, ?, ?)', data);
    this.cargarUsuarios();
    this.presentToast('Usuario agregado');
  }

  async validarUsuario(nombre: string, contrasena: string): Promise<boolean> {
    const res = await this.database.executeSql('SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?', [nombre, contrasena]);
    return res.rows.length > 0;
  }
dbReady(): Promise<void> {
  return new Promise((resolve) => {
    if (this.database) {
      resolve();
    } else {
      this.isDbReady.pipe(take(1)).subscribe(() => resolve());
    }
  });
}

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchUsuarios(): Observable<Usuario[]> {
    return this.listaUsuarios.asObservable();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}