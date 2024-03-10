import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleGuard implements CanActivate {

  constructor(private router: Router) {}
// ====================================ผมไม่รู้เรื่องครับ gtp มันให้ผมมาว่ะ===================================
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
    if (addUserLoginSessions.length == 0) { // ถ้าไม่มี user login  
        if (
          state.url.includes('/main') || 
          state.url.includes('/main/profile') || 
          state.url.includes('/main/changepassword') //ถ้า user พิมพ์ url เข้าโดยตรง
        ) {
          this.router.navigate(['/signin']); // ให้ไปlogin อย่างเดียวคับ
          return false;
        }
    }
    return true;
  }
}
