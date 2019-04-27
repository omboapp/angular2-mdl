import {
	Component,
	Input,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef,
	ContentChildren,
	QueryList,
	Renderer2,
	ViewEncapsulation,
	Injectable,
	OnDestroy,
	forwardRef,
	Inject,
} from '@angular/core';
import { callNative, MdlError, toBoolean } from '@angular/mdl/common';
import { MdlButtonComponent } from '@angular/mdl/button';

const BOTTOM_LEFT = 'bottom-left';
const BOTTOM_RIGHT = 'bottom-right';
const TOP_LEFT = 'top-left';
const TOP_RIGHT = 'top-right';
const UNALIGNED = 'unaligned';

// Total duration of the menu animation.
const TRANSITION_DURATION_SECONDS = 0.3;
// The fraction of the total duration we want to use for menu item animations.
const TRANSITION_DURATION_FRACTION = 0.8;
// How long the menu stays open after choosing an option (so the user can see the ripple).
const CLOSE_TIMEOUT = 175;

const CSS_ALIGN_MAP: any = {};
CSS_ALIGN_MAP[BOTTOM_LEFT] = 'mdl-menu--bottom-left';
CSS_ALIGN_MAP[BOTTOM_RIGHT] = 'mdl-menu--bottom-right';
CSS_ALIGN_MAP[TOP_LEFT] = 'mdl-menu--top-left';
CSS_ALIGN_MAP[TOP_RIGHT] = 'mdl-menu--top-right';
CSS_ALIGN_MAP[UNALIGNED] = 'mdl-menu--unaligned';

export class MdlMenuError extends MdlError
{}

@Injectable()
export class MdlMenuRegisty
{
	private menuComponents: any[] = [];

	public add(menuComponent: MdlMenuComponent)
	{
		this.menuComponents.push(menuComponent);
	}

	public remove(menuComponent: MdlMenuComponent)
	{
		const fromIndex = this.menuComponents.indexOf(menuComponent);
		this.menuComponents.splice(fromIndex, 1);
	}

	public hideAllExcept(menuComponent: MdlMenuComponent)
	{
		this.menuComponents.forEach((component) => {
			if (component !== menuComponent) {
				component.hide();
			}
		});
	}
}


@Component({
	moduleId: module.id,
	selector: 'mdl-menu-item',
	host: {
		'[class.mdl-menu__item]': 'true',
		'tabindex': '-1',
		'(click)': 'onClick($event)',
		'(touchstart)': 'onTouch($event)'
	},
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None
})
export class MdlMenuItemComponent
{
	private _disabled: boolean = false;
	@Input() get disabled(): boolean { return this._disabled; }
	set disabled(value) { this._disabled = toBoolean(value); }

	public element: HTMLElement;

	// forwardRef is needed because of he circular dependency menu queries menuitems; menuitem needs the parent
	constructor(
		// TODO: Confirm safe removal of `MdlMenuItemComponent.elementRef`
		elementRef: ElementRef,
		// TODO: Confirm safe removal of `MdlMenuItemComponent.renderer`
		// private renderer: Renderer2,
		@Inject(forwardRef(() => MdlMenuComponent)) private mdlMenu: MdlMenuComponent
	) {
		this.element = elementRef.nativeElement;
	}

	public onClick($event: any)
	{
		$event.stopPropagation();
		if (this.disabled) {
			this.mdlMenu.hide();
			return;
		}
		this.mdlMenu.hideOnItemClicked();
	}

	// we need to register a touchstart at the window to get informed if the user taps outside the menu.
	// But if we register a touchstart event - safari will no longer convert touch events to click events.
	// So we need to convert touch to click and the user still needs to register a (click) listener to be
	// informed if the menu item has clicked.
	public onTouch($event: any)
	{
		// ensure that this event is totally consumed
		$event.stopPropagation();
		$event.preventDefault();

		let event: any = new MouseEvent('click', { bubbles: true });
		callNative(this.element, 'dispatchEvent', event);
	}
}

@Component({
	moduleId: module.id,
	selector: 'mdl-menu',
	host: {},
	exportAs: 'mdlMenu',
	template: `
		<div #container class="mdl-menu__container is-upgraded">
			<div #outline class="mdl-menu__outline" [ngClass]="cssPosition"></div>
			<div class="mdl-menu" #menuElement>
				<ng-content></ng-content>
			</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None
})
export class MdlMenuComponent implements OnInit, AfterViewInit, OnDestroy
{
	@Input('mdl-menu-position') public position: string;

	@ViewChild('container') public containerChild: ElementRef;
	private container: HTMLElement;

	@ViewChild('menuElement') public menuElementChild: ElementRef;
	private menuElement: HTMLElement;

	@ViewChild('outline') public outlineChild: ElementRef;
	private outline: HTMLElement;

	@ContentChildren(MdlMenuItemComponent) public menuItemComponents: QueryList<MdlMenuItemComponent>;

	public cssPosition = 'mdl-menu--bottom-left';

	private isVisible = false;

	constructor(
		private renderer: Renderer2,
		private menuRegistry: MdlMenuRegisty
	) {
		this.menuRegistry.add(this);
	}

	public ngOnInit()
	{
		this.cssPosition = CSS_ALIGN_MAP[this.position] || BOTTOM_LEFT;
	}

	public ngAfterViewInit()
	{
		this.container = this.containerChild.nativeElement;
		this.menuElement = this.menuElementChild.nativeElement;
		this.outline = this.outlineChild.nativeElement;

		// Add a click listener to the document, to close the menu.
		let callback = () => {
			if (this.isVisible) {
				this.hide();
			}
			return true;
		};

		this.renderer.listen('window', 'click', callback);
		this.renderer.listen('window', 'touchstart', callback);
	}

	public toggle(event: Event, mdlButton: MdlButtonComponent)
	{
		if (!mdlButton) {
			throw new MdlMenuError(`MdlButtonComponent is required`);
		}

		if (this.isVisible) {
			this.hide();
		} else {
			this.show(event, mdlButton);
		}
	}

	public hideOnItemClicked()
	{
		// Wait some time before closing menu, so the user can see the ripple.
		setTimeout(() => {
			this.hide();
		}, CLOSE_TIMEOUT);
	}

	public hide()
	{
		// Remove all transition delays; menu items fade out concurrently.
		this.menuItemComponents.toArray().forEach(mi => {
			mi.element.style.removeProperty('transition-delay');
		});

		// Measure the inner element.
		var rect = this.menuElement.getBoundingClientRect();
		var height = rect.height;
		var width = rect.width;

		// Turn on animation, and apply the final clip. Also make invisible.
		// This triggers the transitions.
		this.renderer.addClass(this.menuElement, 'is-animating');
		this.applyClip(height, width);
		this.renderer.removeClass(this.container, 'is-visible');

		// Clean up after the animation is complete.
		this.addAnimationEndListener();

		this.isVisible = false;
	}

	public show(event: any, mdlButton: any)
	{
		this.menuRegistry.hideAllExcept(this);

		event.stopPropagation();

		var forElement = mdlButton.element;
		var rect = forElement.getBoundingClientRect();
		var forRect = forElement.parentElement.getBoundingClientRect();

		if (this.position == UNALIGNED) {
			// Do not position the menu automatically. Requires the developer to
			// manually specify position.
		} else if (this.position == BOTTOM_RIGHT) {
			// Position below the "for" element, aligned to its right.
			this.container.style.right = (forRect.right - rect.right) + 'px';
			this.container.style.top = forElement.offsetTop + forElement.offsetHeight + 'px';
		} else if (this.position == TOP_LEFT) {
			// Position above the "for" element, aligned to its left.
			this.container.style.left = forElement.offsetLeft + 'px';
			this.container.style.bottom = (forRect.bottom - rect.top) + 'px';
		} else if (this.position == TOP_RIGHT) {
			// Position above the "for" element, aligned to its right.
			this.container.style.right = (forRect.right - rect.right) + 'px';
			this.container.style.bottom = (forRect.bottom - rect.top) + 'px';
		} else {
			// Default: position below the "for" element, aligned to its left.
			this.container.style.left = forElement.offsetLeft + 'px';
			this.container.style.top = forElement.offsetTop + forElement.offsetHeight + 'px';
		}

		// Measure the inner element.
		var height = this.menuElement.getBoundingClientRect().height;
		var width = this.menuElement.getBoundingClientRect().width;

		this.container.style.width = width + 'px';
		this.container.style.height = height + 'px';
		this.outline.style.width = width + 'px';
		this.outline.style.height = height + 'px';

		var transitionDuration = TRANSITION_DURATION_SECONDS * TRANSITION_DURATION_FRACTION;

		this.menuItemComponents.toArray().forEach(mi => {
			var itemDelay = null;

			if ((this.position == TOP_LEFT) || this.position == TOP_RIGHT) {
				itemDelay = ((height - mi.element.offsetTop - mi.element.offsetHeight) / height * transitionDuration) + 's';
			} else {
				itemDelay = (mi.element.offsetTop / height * transitionDuration) + 's';
			}

			mi.element.style.transitionDelay = itemDelay;
		});

		// Apply the initial clip to the text before we start animating.
		this.applyClip(height, width);

		this.renderer.addClass(this.container, 'is-visible');
		this.menuElement.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
		this.renderer.addClass(this.menuElement, 'is-animating');

		this.addAnimationEndListener();

		this.isVisible = true;
	}

	private addAnimationEndListener()
	{
		this.renderer.listen(this.menuElement, 'transitionend', () => {
			this.renderer.removeClass(this.menuElement, 'is-animating');

			return true;
		});
	}

	private applyClip(height: number, width: number)
	{
		if (this.position == UNALIGNED) {
			// Do not clip.
			this.menuElement.style.clip = '';
		} else if (this.position == BOTTOM_RIGHT) {
			// Clip to the top right corner of the menu.
			this.menuElement.style.clip = 'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
		} else if (this.position == TOP_LEFT) {
			// Clip to the bottom left corner of the menu.
			this.menuElement.style.clip = 'rect(' + height + 'px 0 ' + height + 'px 0)';
		} else if (this.position == TOP_RIGHT) {
			// Clip to the bottom right corner of the menu.
			this.menuElement.style.clip = 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
		} else {
			// Default: do not clip (same as clipping to the top left corner).
			this.menuElement.style.clip = '';
		}
	}

	public ngOnDestroy()
	{
		this.menuRegistry.remove(this);
	}
}
