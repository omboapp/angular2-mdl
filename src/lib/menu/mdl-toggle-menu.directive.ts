import {
	Directive, Input, HostListener
} from '@angular/core';
import { MdlButtonComponent } from '@angular/mdl/button';
import { MdlMenuComponent } from './mdl-menu.component';

@Directive({
	selector: '[mdl-button][mdl-toggle-menu]'
})
export class MdlToggleMenuDirective
{
	@Input('mdl-toggle-menu') public menu: MdlMenuComponent;

	constructor(
		private button: MdlButtonComponent
	) {}

	@HostListener('click', ['$event'])
	public onClick($event: Event)
	{
		this.menu.toggle($event, this.button);
	}
}
