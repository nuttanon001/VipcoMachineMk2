import { BaseRestService } from "./base-rest.service";
import { OnInit, Output, Input, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BaseModel } from "./base-model.model";

export abstract class BaseInfoDialogComponent<Model extends BaseModel>
  implements OnInit{

  constructor(
  ) { }

  //Parameter
  @Input() InfoValue: Model;
  @Output() SubmitOrCancel: EventEmitter<{ data: Model | undefined, force: boolean }> = new EventEmitter<{ data: Model | undefined, force: boolean }>();
  denySave: boolean = false;
  InfoValueForm: FormGroup;
  step = 0;
  /*
   * Methods
   */
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }

  endStep() {
    if (this.InfoValueForm.valid) {
      this.InfoValue = this.InfoValueForm.getRawValue();
      this.SubmitOrCancel.emit({ data: this.InfoValue, force: true });
    }
  }

  ngOnInit(): void {
    if (this.InfoValue) {
      if (this.InfoValue) {
        this.denySave = this.InfoValue.ReadOnly;
      }
      this.buildForm();
    }
  }

  // build form
  abstract buildForm(): void;

  // On submit
  onSubmit(): void {
    if (this.InfoValueForm) {
      if (this.InfoValueForm.valid) {
        this.InfoValue = this.InfoValueForm.getRawValue();
        this.SubmitOrCancel.emit({ data: this.InfoValue, force: false });
      }
    }
  }

  // On cancel
  onCancel(): void {
    this.SubmitOrCancel.emit(undefined);
  }
}
