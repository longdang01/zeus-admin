import { Injectable, NgZone } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(
        protected router: Router,
        protected authService: AuthService,
        private ngZone: NgZone)
    { }

    canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
        // state.url !== '/login' && 
        if (!this.authService.isAuthenticated()) {
            this.ngZone.run(() => this.router.navigateByUrl('/login'))
            // this.router.navigateByUrl('/login')
            return false;
        }

        return true;
    }
}