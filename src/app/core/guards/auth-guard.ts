import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.userRole$.pipe(
    map(role => {
      if (role) return true;
      router.navigate(['/auth/login']);
      return false;
    })
  );
};
