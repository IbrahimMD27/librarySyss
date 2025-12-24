import { Component, inject} from '@angular/core';
import { AuthService } from '../core/services/auth';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { map } from 'rxjs';

@Component({
  selector: 'app-books',
  imports: [],
  template: `
    <h2>Books</h2>
    <ul>
      <li *ngFor="let book of books | async">
        {{ book.title }} - {{ book.status }}
        <button *ngIf="isAdmin" (click)="editBook(book)">Edit</button>
        <button *ngIf="isAdmin" (click)="deleteBook(book.id)">Delete</button>
      </li>
    </ul>
  `,
  styleUrl: './books.css',
})
export class Books {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  booksCol = collection(this.firestore, 'books');
  books = collectionData(this.booksCol, { idField: 'id' });

  isAdmin = this.auth.userRole$.value === 'admin';

  async editBook(book: any) {
    const newTitle = prompt('Edit title', book.title);
    if (newTitle) await updateDoc(doc(this.firestore, `books/${book.id}`), { title: newTitle });
  }

  async deleteBook(id: string) {
    if (confirm('Are you sure?')) await deleteDoc(doc(this.firestore, `books/${id}`));
  }
}
