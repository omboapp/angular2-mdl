import { Component } from '@angular/core';
import {
	Router,
	ActivatedRoute
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdlSnackbarService } from '../../../lib/snackbar';
import { flyInOutTrigger } from '../animations/flyInOutTrigger-animation';
import { hostConfig } from '../animations/flyInOutTrigger-animation';
import { AbstractDemoComponent } from '../abstract-demo.component';

@Component({
	selector: 'snackbar-demo',
	host: hostConfig,
	animations: [
		flyInOutTrigger
	],
	templateUrl: 'snackbar.component.html'
})
export class SnackbarDemo extends AbstractDemoComponent
{
	constructor(
		router: Router,
		route: ActivatedRoute,
		titleService: Title,
		private mdlSnackbarService: MdlSnackbarService
	) {
		super(router, route, titleService);
	}

	public showSnackbar()
	{
		this.mdlSnackbarService.showSnackbar({
			message: 'The Message',
			action: {
				handler: () => {
					this.mdlSnackbarService.showToast('You hit the OK button');
				},
				text: 'OK'
			}
		});
	}
}
