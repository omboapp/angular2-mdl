import { Component, ViewEncapsulation } from '@angular/core';
import {
	Router,
	ActivatedRoute
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdlScreenSizeService } from '../../../mdl/layout';
import { flyInOutTrigger } from '../animations/flyInOutTrigger-animation';
import { hostConfig } from '../animations/flyInOutTrigger-animation';
import { AbstractDemoComponent } from '../abstract-demo.component';

@Component({
	selector: 'layout-demo',
	host: hostConfig,
	animations: [
		flyInOutTrigger
	],
	templateUrl: 'layout.component.html',
	styles: [`
		.demo-container {
			width: 100%;
			position: relative;
			height: 300px;
		}

		.demo-layout-transparent {
			background: url('../../assets/oslo.jpg') center / cover;
			color: white;
		}

		.page-content {
			height: 600px;
		}

		mdl-icon {
			vertical-align: middle;
		}

		.mdl-layout__tab {
			cursor: pointer;
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class LayoutDemo extends AbstractDemoComponent
{
	public activeIndex = 0;

	constructor(
		router: Router,
		route: ActivatedRoute,
		titleService: Title,
		mdlScreenSizeService: MdlScreenSizeService
	) {
		super(router, route, titleService);

		mdlScreenSizeService.sizes().subscribe((isSmall) => {
			console.log(`is ${isSmall ? 'small' : 'large'} screen`);
		});
	}

	public tabChanged({ index }: { index: number })
	{
		this.activeIndex = index;
	}

	public tabMouseover({ index }: { index: number })
	{
		console.log(`mouseover: ${index}`);
	}

	public tabMouseout({ index }: { index: number })
	{
		console.log(`mouseout: ${index}`);
	}
}

@Component({
	selector: 'layout-demo-0',
	template: '',
})
export class Layout0Demo
{}

@Component({
	selector: 'layout-demo-1',
	template: '<div>Link 1 content</div>',
})
export class Layout1Demo
{}

@Component({
	selector: 'layout-demo-2',
	template: '<div>Link 2 content</div>',
})
export class Layout2Demo
{}

@Component({
	selector: 'layout-demo-3',
	template: '<div>Link 3 content</div>',
})
export class Layout3Demo
{}
