import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente.model';

/**
 * CRUD de clientes contra la colección `clientes` de Firestore.
 */
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly collection: AngularFirestoreCollection<Cliente> =
    this.firestore.collection<Cliente>('clientes');

  constructor(private firestore: AngularFirestore) {}

  /** Observable con todos los clientes, incluyendo el id del documento. */
  getAll(): Observable<Cliente[]> {
    return this.collection.valueChanges({ idField: 'id' });
  }

  create(cliente: Omit<Cliente, 'id'>): Promise<void> {
    const id = this.firestore.createId();
    return this.collection.doc(id).set({ ...cliente, id });
  }

  update(id: string, cambios: Partial<Cliente>): Promise<void> {
    return this.collection.doc(id).update(cambios);
  }

  delete(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }
}
