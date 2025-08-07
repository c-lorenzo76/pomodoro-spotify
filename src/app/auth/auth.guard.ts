import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

    const router = inject(Router);

    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');

    if (token && expiresAt){
      const time_rn = new Date().getTime();
      if(parseInt(expiresAt) >  time_rn){
        return true;
      }
    }

    router.navigate(['/']).then(() => false);
    return false;
  }
;
