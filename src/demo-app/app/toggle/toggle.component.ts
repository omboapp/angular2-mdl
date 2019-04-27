import { Component } from '@angular/core';
import {
	Router,
	ActivatedRoute
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { flyInOutTrigger } from '../animations/flyInOutTrigger-animation';
import { hostConfig } from '../animations/flyInOutTrigger-animation';
import { AbstractDemoComponent } from '../abstract-demo.component';

@Component({
	selector: 'toggle-demo',
	host: hostConfig,
	animations: [
		flyInOutTrigger
	],
	templateUrl: 'toggle.component.html'
})
export class ToggleDemo extends AbstractDemoComponent
{
	protected checkbox1 = true;
	protected checkbox2 = false;
	protected radioOption = '1';

	constructor(
		router: Router,
		route: ActivatedRoute,
		titleService: Title
	) {
		super(router, route, titleService);
	}

	public onChange(newValue: any)
	{
		console.log(newValue);
	}
}
