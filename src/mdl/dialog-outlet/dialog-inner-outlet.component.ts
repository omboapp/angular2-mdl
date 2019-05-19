import { Component, ViewContainerRef, forwardRef, Inject } from '@angular/core';
import { MdlDialogOutletService } from './mdl-dialog-outlet.service';

// the component is used inside the app-root. this is possible because this component
// is exported from the module
@Component({
	moduleId: module.id,
	selector: 'dialog-outlet',
	template: ''
})
export class MdlDialogInnerOutletComponent
{
	constructor(
		vCRef: ViewContainerRef,
		@Inject(forwardRef(() => MdlDialogOutletService)) service: MdlDialogOutletService
	) {
		service.setDefaultViewContainerRef(vCRef);
	}
}
