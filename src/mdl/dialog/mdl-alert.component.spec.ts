import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdlDialogOutletModule } from '@angular/mdl/dialog-outlet';
import { MdlDialogModule } from './index';
import { MdlAlertComponent } from './mdl-alert.component';

describe('MdlAlert', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdlDialogModule, MdlDialogOutletModule],
      declarations: [MdlTestComponent]
    });
  }));

  it('should create, show and close the dialog', async(() => {

    let fixture = TestBed.createComponent(MdlTestComponent);
    fixture.detectChanges();

    let mdlAlert = fixture.debugElement.query(By.directive(MdlAlertComponent)).componentInstance;

    mdlAlert.show();
    fixture.detectChanges();

    spyOn(fixture.componentInstance, 'alertConfirmed');

    // close the dialog by clicking the ok button
    let buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonEl.click();

    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(fixture.componentInstance.alertConfirmed).toHaveBeenCalled();
    });

  }));



});


@Component({
  selector: 'test-component',
  template: `
      <mdl-alert
        #alert="mdlAlert"
        title="Title (optional)"
        message="This is a <em class='mdl-color-text--primary'>simple</em> Alert"
        okText="Got it!"
        (confirmed)="alertConfirmed()"></mdl-alert>
    <dialog-outlet></dialog-outlet>
  `
})
class MdlTestComponent {

  public alertConfirmed() {}
}
