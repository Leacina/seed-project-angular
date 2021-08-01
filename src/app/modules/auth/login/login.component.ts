import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Unsubscrable } from 'src/app/shared/common';
import { FormGroup, FormControl } from '@angular/forms';
import { FormHelper } from 'src/app/shared/form-helper';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Unsubscrable implements OnInit {

  authGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    private poNotification: PoNotificationService
  ) {
    super();

    // Logout user
    if (route.snapshot.routeConfig.path === 'logout') {
      authService.logout();

      this.router.navigate(['/auth/login']);
    }

    if(this.authService.getToken()){
      this.router.navigate(['/admin']);
    }
  }

  ngOnInit(): void {
    this.authGroup = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  /**
   * LOGIN
   */
  onLogin() {
    //Se possuir algum erro
    if (FormHelper.hasError(this.authGroup)) {
      FormHelper.markAllTouched(this.authGroup);

      return;
    }

    this.authService.login({
        email: this.authGroup.controls.email.value,
        password: this.authGroup.controls.password.value
      }
    )
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.router.navigate(['/admin']);
    }, error => {
      this.poNotification.error(error);
    });
  }

  onRecovery() {

    if(!this.authGroup.controls.email){
      this.poNotification.error('Digite um e-mail válido para recuperação de senha.');
      return;
    }

    this.authService.sendForgotPassword(this.authGroup.controls.email.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.poNotification.success('Um e-mail foi enviado a você para redefinir sua senha!');
      }, error => {
        this.poNotification.error('Houve um problema. Tente mais tarde!');
    });
  }
}
