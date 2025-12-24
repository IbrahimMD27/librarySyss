import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="w-full bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <a routerLink="/dashboard" 
           class="flex items-center gap-2 no-underline group">
          <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <span class="text-white font-bold text-sm">L</span>
          </div>
          <span class="text-lg font-bold text-slate-800 tracking-tight">LibraryHub</span>
        </a>

        <div class="flex items-center gap-8"> <a routerLink="/return" 
             routerLinkActive="text-blue-600 font-semibold"
             [routerLinkActiveOptions]="{exact: true}"
             class="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Return
          </a>

          <button (click)="logout()" 
            class="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200">
            Logout
          </button>
        </div>

      </nav>
    </header>
  `,
})
export class Header {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}