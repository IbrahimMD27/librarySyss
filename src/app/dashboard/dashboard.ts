import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection, doc, deleteDoc } from '@angular/fire/firestore';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth';

export interface Book {
  id: string;
  name: string;
  description: string;
  stock: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private firestore = inject(Firestore);
  private router = inject(Router);
  public authService = inject(AuthService);

  private booksCol = collection(this.firestore, 'books');
  
  books$ = (collectionData(this.booksCol, { idField: 'id' }) as Observable<Book[]>).pipe(
    shareReplay(1)
  );

  totalBooks$ = this.books$.pipe(map(b => b.length));
  availableBooks$ = this.books$.pipe(map(b => b.filter(book => book.stock > 0).length));
  takenBooks$ = this.books$.pipe(map(b => b.filter(book => book.stock <= 0).length));

  async deleteBook(id: string) {
    if (confirm('Delete this book permanently?')) {
      await deleteDoc(doc(this.firestore, `books/${id}`));
    }
  }

  editBook(id: string) {
    this.router.navigate(['/edit-book', id]);
  }

  borrow(book: Book) {
    alert(`Borrowing ${book.name}`);
  }
}