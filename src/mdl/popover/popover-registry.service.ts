import {
	Inject,
	Injectable,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MdlPopoverComponent } from './popover.component';

@Injectable()
export class MdlPopoverRegistry
{
	private popoverComponents: any[] = [];

	constructor(
		@Inject(DOCUMENT) public doc: any
	) {
		this.doc.addEventListener('click', () => {
			this.popoverComponents
				.filter((component: MdlPopoverComponent) => component.isVisible)
				.forEach((component: MdlPopoverComponent) => component.hide());
		});
	}

	public add(popoverComponent: MdlPopoverComponent)
	{
		this.popoverComponents.push(popoverComponent);
	}

	public remove(popoverComponent: MdlPopoverComponent)
	{
		this.popoverComponents.slice(this.popoverComponents.indexOf(popoverComponent), 1);
	}

	public hideAllExcept(popoverComponent: MdlPopoverComponent)
	{
		this.popoverComponents.forEach((component) => {
			if (component !== popoverComponent) {
				component.hide();
			}
		});
	}
}
