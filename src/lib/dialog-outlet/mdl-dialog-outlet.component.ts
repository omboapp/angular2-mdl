import { Component, ViewContainerRef } from '@angular/core';

// the component is used outside the app-root. injecting MdlDialogService would not work
// this component is not exported - needs to be instantiated by
//    let x = this.appRef.bootstrap(MdlDialogOutletComponent);
@Component({
	moduleId: module.id,
	selector: 'dialog-outlet',
	template: ''
})
export class MdlDialogOutletComponent
{
	constructor(
		private vCRef: ViewContainerRef
	) {}

	public get viewContainerRef()
	{
		return this.vCRef;
	}
}
