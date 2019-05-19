import {
	Component,
	ChangeDetectorRef,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	Input,
	Output,
	ViewEncapsulation,
} from '@angular/core';
import { MdlButtonComponent } from '@angular/mdl/button';
import { MdlPopoverRegistry } from './popover-registry.service';
import { PopupPositionService } from './popup-position.service';

@Component({
	moduleId: module.id,
	selector: 'mdl-popover',
	host: {
		'[class.mdl-popover]': 'true'
	},
	templateUrl: 'popover.html',
	encapsulation: ViewEncapsulation.None,
})
export class MdlPopoverComponent
{
	@Input('hide-on-click') public hideOnClick: boolean = false;
	@Input('mdl-popover-position') public position: string;
	@Output() onShow: EventEmitter<any> = new EventEmitter();
	@Output() onHide: EventEmitter<any> = new EventEmitter();
	@HostBinding('class.is-visible') public isVisible = false;

	constructor(
		private changeDetectionRef: ChangeDetectorRef,
		public elementRef: ElementRef,
		private popoverRegistry: MdlPopoverRegistry,
		// TODO: Confirm safe removal of `MdlPopoverComponent.popupPositionService`
		// @ts-ignore
		popupPositionService: PopupPositionService
	) {
		this.popoverRegistry.add(this);
	}

	public ngOnDestroy()
	{
		this.popoverRegistry.remove(this);
	}

	public toggle(event: Event, forElement: any = null)
	{
		if (this.isVisible) {
			this.hide();
		} else {
			this.show(event, forElement);
		}
	}

	public hide()
	{
		if (this.isVisible) {
			this.onHide.emit(null);
			this.isVisible = false;
			this.changeDetectionRef.markForCheck();
		}
	}

	show(event: Event, forElement: any = null)
	{
		this.hideAllPopovers();
		event.stopPropagation();

		if (!this.isVisible) {
			this.onShow.emit(null);
			this.isVisible = true;
			// this.updateDirection(event, forElement);
			this.updateDirection(forElement);
		}
	}

	@HostListener('click', ['$event'])
	onClick(event: Event)
	{
		if (!this.hideOnClick) {
			event.stopPropagation();
		}
	}

	private hideAllPopovers()
	{
		this.popoverRegistry.hideAllExcept(this);
	}

	// private updateDirection(event: Event, forElement: any) {
	private updateDirection(forElement: any)
	{
		if (forElement && this.position) {
			const popoverElement = this.elementRef.nativeElement;

			const forHtmlElement = this.getHtmlElement(forElement);
			PopupPositionService.updatePosition(forHtmlElement, popoverElement, this.position);
			this.changeDetectionRef.markForCheck();

			return;
		}
	}

	private getHtmlElement(forElement: any): HTMLElement
	{
		if (forElement instanceof MdlButtonComponent) {
			const buttonComponent = <MdlButtonComponent>forElement;
			return buttonComponent.elementRef.nativeElement;
		}

		if (forElement instanceof ElementRef) {
			const elementRef = <ElementRef>forElement;
			return elementRef.nativeElement;
		}

		return forElement;
	}
}
