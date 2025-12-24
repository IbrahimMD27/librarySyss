import { Injectable, NgZone, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userRole$ = new BehaviorSubject<string | null>(null);
  private injector = inject(EnvironmentInjector);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    // Optional: Keep the role in sync if page refreshes
    authState(this.auth).subscribe(async (user) => {
      if (user) {
        this.fetchUserRole(user.uid);
      } else {
        this.userRole$.next(null);
      }
    });
  }

  async login(email: string, password: string) {
    // Wrapping the entire block silences the "Outside Injection Context" warning
    return runInInjectionContext(this.injector, async () => {
      try {
        const cred = await signInWithEmailAndPassword(this.auth, email, password);
        
        // Fetch role and navigate
        await this.fetchUserRole(cred.user.uid);
        
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      } catch (err: any) {
        alert(err.message);
        throw err;
      }
    });
  }

  private async fetchUserRole(uid: string) {
    return runInInjectionContext(this.injector, async () => {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const role = userDoc.data()?.['role'] || 'student';
        this.userRole$.next(role);
      } else {
        // Fallback: If no document exists in Firestore for this UID
        console.warn('No Firestore document for user. Defaulting to student.');
        this.userRole$.next('student');
      }
    });
  }

  async logout() {
    await signOut(this.auth);
    this.userRole$.next(null);
    this.ngZone.run(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}