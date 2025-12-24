import { Component, inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../core/services/auth';
import { map } from 'rxjs';

@Component({
  selector: 'app-take',
  imports: [],
  template: `
    <h2>Take Book</h2>
    <ul>
      <li *ngFor="let book of availableBooks | async">
        {{ book.title }}
        <button (click)="takeBook(book)">Take</button>
      </li>
    </ul>
  `,
  styleUrl: './take.css',
})
export class Take {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  booksCol = collection(this.firestore, 'books');
  availableBooks = collectionData(this.booksCol, { idField: 'id' }).pipe(
    map((books: any[]) => books.filter(b => b.status === 'available'))
  );

  async takeBook(book: any) {
    await updateDoc(doc(this.firestore, `books/${book.id}`), {
      status: 'taken',
      takenBy: this.auth.userRole$.value,
    });
  }

}
