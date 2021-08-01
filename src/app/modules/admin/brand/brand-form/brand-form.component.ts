import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormComponent, Message } from 'src/app/shared/common';
import { BrandService } from 'src/app/core/services/brand.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { takeUntil } from 'rxjs/operators';
import { FormHelper } from 'src/app/shared/form-helper';
import { Observable } from 'rxjs';
import { Brand } from 'src/app/core/models/Brand.model';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss']
})
export class BrandFormComponent extends FormComponent implements OnInit {

  modelId: number;

  // Dados do Form para gravar
  formGroup: FormGroup = new FormGroup({
    marca: new FormControl(),
    pais: new FormControl(),
  });

  constructor(
    private brandService: BrandService,
    private router: Router,
    route: ActivatedRoute,
    alertService: PoNotificationService,
  ) {
    super(alertService);

    this.modelId = route.snapshot.params.id;
  }

  ngOnInit(): void {
    if (this.modelId) {
      this.brandService.get(this.modelId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => FormHelper.setFormGroupValues(this.formGroup, res));
    }
  }

  onSave(){
    if (!this.validateForm(this.formGroup)) {
      return;
    }

    const brand = new Brand();

    brand.deserialize(FormHelper.getValuesFromFormGroup(this.formGroup));

    let action$: Observable<any>;
    if (this.modelId) {
      action$ = this.brandService.put(this.modelId, brand);
    } else {
      action$ = this.brandService.post(brand);
    }

    action$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          this.emitSuccessMessage(
            this.modelId
            ? Message.SUCCESSFUL_REGISTRY_EDITION
            : Message.SUCCESSFUL_REGISTRY_INSERTION);

            this.router.navigate([`/admin/brand`]);
        },
        error => this.emitErrorMessage(error)
      );
  }
}
