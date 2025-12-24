import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard'; // New Guard
import { Books } from './books/books';
import { Take } from './take/take';
import { Return } from './return/return';
import { MainLayout } from './layout/main-layout/main-layout';
import { EditBookComponent } from './pages/edit-book/edit-book';

export const routes: Routes = [

  // PUBLIC (NO HEADER)
  { path: 'auth/login', component: LoginComponent },

  // PROTECTED (WITH HEADER)
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'books', component: Books },
      { path: 'take', component: Take },
      { path: 'return', component: Return },
      
      // Only Admins can access this route
      { 
        path: 'edit-book/:id', 
        component: EditBookComponent,
        canActivate: [adminGuard] 
      }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];