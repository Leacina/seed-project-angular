import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { Unsubscrable } from 'src/app/shared/common';
import { FormHelper } from 'src/app/shared/form-helper';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent extends Unsubscrable implements OnInit  {
  authGroup: FormGroup;
  token: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    private poNotification: PoNotificationService
  ) {
    super();

    if(!route.snapshot.queryParams.token){
      this.poNotification.error('Você não tem acesso a essa opção.')
      this.router.navigate(['/auth/login']);
    }

    this.token = route.snapshot.queryParams.token;
  }

  ngOnInit(): void {
    this.authGroup = new FormGroup({
      password_confirm: new FormControl(),
      password: new FormControl()
    });
  }

  onRecovery() {
    //Se possuir algum erro
    if (FormHelper.hasError(this.authGroup)) {
      FormHelper.markAllTouched(this.authGroup);

      return;
    }

    if(!this.authGroup.controls.password.value || !this.authGroup.controls.password_confirm.value){
      this.poNotification.error('Preencha a senha no campo destinado.');
      return;
    }

    if(this.authGroup.controls.password.value !== this.authGroup.controls.password_confirm.value){
      this.poNotification.error('As senhas digitadas não são iguais.');
      return;
    }

    this.authService.recovery(this.authGroup.controls.password.value, this.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.poNotification.success('Senha alterada com sucesso!');
        this.router.navigate(['/auth/login']);
      }, error => {
        this.poNotification.error(error);
    });
  }

}
