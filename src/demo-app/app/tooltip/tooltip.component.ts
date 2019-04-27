import { Component } from '@angular/core';
import {
	Router,
	ActivatedRoute
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { flyInOutTrigger, hostConfig } from '../animations/flyInOutTrigger-animation';
import { AbstractDemoComponent } from '../abstract-demo.component';

@Component({
	selector: 'tooltip-demo',
	host: hostConfig,
	animations: [
		flyInOutTrigger
	],
	templateUrl: 'tooltip.component.html',
	styles: [`
		.tooltip-demo-container {
			text-align: center;
		}
	`]
})
export class TooltipDemo extends AbstractDemoComponent
{
	protected tt1 = 'Follow';

	constructor(
		router: Router,
		route: ActivatedRoute,
		titleService: Title
	) {
		super(router, route, titleService);
	}
}
