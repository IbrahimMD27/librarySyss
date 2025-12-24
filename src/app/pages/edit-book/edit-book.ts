import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  // Changed from templateUrl to template
  template: `
    <div class="min-h-screen bg-[#f8fafc] p-6 flex items-center justify-center">
      <div class="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
        
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
            <span class="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-800 tracking-tight">Edit Book</h2>
            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Update library records</p>
          </div>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest">Book Title</label>
            <input [(ngModel)]="book.name" name="name"
              class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 font-medium" />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest">Description</label>
            <textarea [(ngModel)]="book.description" name="description" rows="3"
              class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm leading-relaxed"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest">Stock</label>
              <input [(ngModel)]="book.stock" name="stock" type="number"
                class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-800 font-bold" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest">Cover Image URL</label>
              <input [(ngModel)]="book.imageUrl" name="imageUrl"
                class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-800 text-xs" />
            </div>
          </div>

          <div class="flex gap-3 pt-6">
            <button (click)="update()" 
              class="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
              Save Changes
            </button>
            <button routerLink="/dashboard" 
              class="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditBookComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private firestore = inject(Firestore);

  bookId: string = '';
  // Initializing with empty values prevents binding errors before data loads
  book: any = { name: '', description: '', stock: 0, imageUrl: '' };

  async ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    
    try {
      const bookRef = doc(this.firestore, `books/${this.bookId}`);
      const bookSnap = await getDoc(bookRef);
      
      if (bookSnap.exists()) {
        this.book = bookSnap.data();
      } else {
        alert('Book not found');
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      console.error('Error fetching book:', err);
    }
  }

  async update() {
    try {
      const bookRef = doc(this.firestore, `books/${this.bookId}`);
      await updateDoc(bookRef, { ...this.book });
      this.router.navigate(['/dashboard']);
    } catch (err) {
      alert('Update failed. Check your Admin permissions.');
    }
  }
}