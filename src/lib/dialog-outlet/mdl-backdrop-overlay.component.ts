import {
	Component,
	HostListener,
	HostBinding,
	ViewEncapsulation,
	EventEmitter,
	NgZone
} from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'mdl-backdrop-overlay',
	host: {
		'[class.dialog-backdrop]': 'true',
	},
	template: ``,
	styles: [`
		.dialog-backdrop {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.1);
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class MdlBackdropOverlayComponent
{
	public clickEmitter: EventEmitter<any> = new EventEmitter();

	@HostBinding('style.display')
	public get display()
	{
		return this.visible ? null : 'none';
	}

	private visible = false;

	@HostBinding('style.zIndex')
	public zIndex = 0;

	constructor(
		private ngZone: NgZone
	) {}

	@HostListener('click', ['$event'])
	public onBackdropClick(e: MouseEvent)
	{
		// this event runs not in angular zone of the main app. make sure it runs in the main angular zone
		// and change detection works
		this.ngZone.run(() => {
			this.clickEmitter.emit();
		});

		e.stopPropagation();
	}

	public hide()
	{
		this.visible = false;
	}

	public showWithZIndex(zIndex: number)
	{
		this.zIndex = zIndex;
		this.visible = true;
	}
}
