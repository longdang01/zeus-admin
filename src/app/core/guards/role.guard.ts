import { Injectable, NgZone } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {

    constructor(
        protected router: Router,
        protected authService: AuthService,
        private ngZone: NgZone)
    { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean> | Promise<boolean> | boolean  {

        const currentRole = Number(localStorage.getItem('role'));
        let roles = route.data["roles"] as Array<Number>;
        if(roles.indexOf(currentRole) == -1) {
            this.ngZone.run(() => this.router.navigateByUrl('/not-found'))
            return false;
        }
        return true;
    }
}