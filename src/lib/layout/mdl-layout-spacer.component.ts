import {
	Component,
	ViewEncapsulation
} from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'mdl-layout-spacer',
	host: {
		'[class.mdl-layout-spacer]': 'true'
	},
	template: '',
	encapsulation: ViewEncapsulation.None
})
export class MdlLayoutSpacerComponent
{}
