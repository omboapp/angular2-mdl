import {
	Component,
	ViewEncapsulation,
} from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'mdl-icon',
	host: {
		'[class.material-icons]': 'true'
	},
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None
})
export class MdlIconComponent
{}
