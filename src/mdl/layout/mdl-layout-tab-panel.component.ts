import {
	Component,
	Input,
	ContentChild,
	ViewEncapsulation
} from '@angular/core';
import { MdlTabPanelTitleComponent } from '@angular/mdl/tabs';

@Component({
	moduleId: module.id,
	selector: 'mdl-layout-tab-panel',
	host: {
		'[class.mdl-layout__tab-panel]': 'true',
		'[class.is-active]': 'isActive'
	},
	template: `
		<ng-content *ngIf="titleComponent" select="mdl-tab-panel-content"></ng-content>
		<ng-content *ngIf="!titleComponent"></ng-content>
	`,
	encapsulation: ViewEncapsulation.None
})
export class MdlLayoutTabPanelComponent
{
	@ContentChild(MdlTabPanelTitleComponent, { static: false }) public titleComponent: MdlTabPanelTitleComponent;

	@Input('mdl-layout-tab-panel-title') public title: string;

	public isActive = false;
}
