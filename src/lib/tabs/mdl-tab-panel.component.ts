import {
	Component,
	Input,
	ContentChild,
	ViewEncapsulation
} from '@angular/core';
import { MdlTabPanelTitleComponent } from './mdl-tab-panel-title.component';

@Component({
	moduleId: module.id,
	selector: 'mdl-tab-panel-content',
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None
})
export class MdlTabPanelContent
{}

@Component({
	moduleId: module.id,
	selector: 'mdl-tab-panel',
	host: {
		'[class.mdl-tabs__panel]': 'true',
		'[class.is-active]': 'isActive'
	},
	template: `
		<ng-content *ngIf="titleComponent" select="mdl-tab-panel-content"></ng-content>
		<ng-content *ngIf="!titleComponent"></ng-content>
	`,
	encapsulation: ViewEncapsulation.None
})
export class MdlTabPanelComponent
{
	@ContentChild(MdlTabPanelTitleComponent) public titleComponent: MdlTabPanelTitleComponent;

	@Input('mdl-tab-panel-title') public title: string;
	@Input('disabled') public disabled: boolean;

	public isActive = false;
}
