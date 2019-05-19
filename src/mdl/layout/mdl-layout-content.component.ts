import {
	Component,
	ViewEncapsulation,
	ElementRef,
	ContentChildren,
	QueryList
} from '@angular/core';
import { MdlLayoutTabPanelComponent } from './mdl-layout-tab-panel.component';

@Component({
	moduleId: module.id,
	selector: 'mdl-layout-content',
	host: {
		'[class.mdl-layout__content]': 'true',
	},
	template: `<ng-content></ng-content>`,
	encapsulation: ViewEncapsulation.None,
})
export class MdlLayoutContentComponent
{
	@ContentChildren(MdlLayoutTabPanelComponent) public tabs: QueryList<MdlLayoutTabPanelComponent>;

	public el: HTMLElement;

	constructor(
		// TODO: Confirm safe removal of `MdlLayoutContentComponent.elRef`
		elRef: ElementRef
	) {
		this.el = elRef.nativeElement;
	}
}
