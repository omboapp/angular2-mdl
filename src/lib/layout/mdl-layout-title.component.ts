import {
	Component,
	ViewEncapsulation
} from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'mdl-layout-title',
	host: {
		'[class.mdl-layout-title]': 'true'
	},
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None
})
export class MdlLayoutTitleComponent
{}
