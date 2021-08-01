import { Subject } from 'rxjs';
import { OnDestroy, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PoNotificationService } from '@po-ui/ng-components';
import { FormHelper } from './form-helper';
import { GridState } from './table';
import { HttpParams } from '@angular/common/http';

/**
 * Set of commom messages into the application
 */
export enum Message {
  INVALID_FORM = 'Falta informar campos obrigatórios',

  SUCCESSFUL_REGISTRY_INSERTION = 'Registro salvo com sucesso!',
  UNSUCCESSFUL_REGISTRY_INSERTION = 'Houve um erro ao salvar o registro',

  SUCCESSFUL_REGISTRY_EDITION = 'Registro editado com sucesso!',
  UNSUCCESSFUL_REGISTRY_EDITION = 'Houve um erro ao editar o registro',

  SUCCESSFUL_REGISTRY_DELETION = 'Registro excluído com sucesso!',
  UNSUCCESSFUL_REGISTRY_DELETION = 'Houve um erro ao excluir o registro',

}

@Directive()
export abstract class Unsubscrable implements OnDestroy {
  protected ngUnsubscribe = new Subject();

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

/**
 * Abstract class to easily implements Form behaviors
 */
export abstract class FormComponent extends Unsubscrable {
  constructor(
    private alertService: PoNotificationService,
  ) {
    super();
  }

  /**
   * Validate form
   *
   * @param formGroup FormGroup
   */
  validateForm(formGroup: FormGroup) {
    if (FormHelper.hasError(formGroup)) {
      FormHelper.markAllTouched(formGroup);
      this.alertService.error(Message.INVALID_FORM);

      return false;
    }

    return true;
  }

  /**
   * Emits a success message
   *
   * @param message Message to be showed
   */
  emitSuccessMessage(message: string) {
    this.alertService.success(message);
  }

  /**
   * Emits a error message
   *
   * @param message Message to be showed
   */
  emitErrorMessage(message: string) {
    this.alertService.error(message);
  }
}
