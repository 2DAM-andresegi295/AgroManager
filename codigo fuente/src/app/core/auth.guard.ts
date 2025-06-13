import { authState } from '@angular/fire/auth';
import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { AuthStateService } from '../shared/data-access/auth-state.service';
import { map } from 'rxjs';

export const privateGuard=(): CanActivateFn=>{
  return ()=>{
    const router=inject(Router);
    const authState=inject(AuthStateService);

    return authState.authState$.pipe(
      map(state=>{
        if(!state){
          router.navigateByUrl('/login');
          return false;
        }

        return true;
      })
    )
  };
};
