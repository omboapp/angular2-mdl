import {
	Component,
	AfterContentInit,
	ContentChild,
	ElementRef,
	EventEmitter,
	forwardRef,
	Inject,
	Injectable,
	InjectionToken,
	Input,
	NgZone,
	OnDestroy,
	OnChanges,
	Optional,
	Output,
	QueryList,
	Renderer2,
	SimpleChanges,
	ViewEncapsulation,
} from '@angular/core';
// import { EventManager } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { MdlError, toBoolean, toNumber } from '@angular/mdl/common';
import { MdlLayoutContentComponent } from './mdl-layout-content.component';
import { MdlLayoutTabPanelComponent } from './mdl-layout-tab-panel.component';

const ESCAPE = 27;
const STANDARD = 'standard';
const SCROLL = 'scroll';
const WATERFALL = 'waterfall';

/**
 * The LAYOUT_SCREEN_SIZE_THRESHOLD can be changed at the root module. Just provide a value for this InjectionToken:
 *
 * providers: [
 *  {provide:LAYOUT_SCREEN_SIZE_THRESHOLD, useValue: 768 }
 * ]
 *
 * You also need to change the scss variable to the same value: $layout-screen-size-threshold: 768px.
 *
 * It should be clear that this can only be used if you are using the scss and not the pre compiled css from getmdl.io.
 */
export const LAYOUT_SCREEN_SIZE_THRESHOLD = new InjectionToken<number>('layoutScreenSizeThreshold');

export class MdLUnsupportedLayoutTypeError extends MdlError
{
	constructor(type: string) {
		/* istanbul ignore next */
		super(`Layout type "${type}" isn't supported by mdl-layout (allowed: standard, waterfall, scroll).`);
	}
}

@Injectable()
export class MdlScreenSizeService
{
	private sizesSubject: BehaviorSubject<any> = new BehaviorSubject(false);
	private windowMediaQueryListener: Function | null;

	constructor(
		ngZone: NgZone,
		@Optional() @Inject(LAYOUT_SCREEN_SIZE_THRESHOLD) private layoutScreenSizeThreshold: number
	) {
		// if no value is injected the default size wil be used. same as $layout-screen-size-threshold in scss
		if (!this.layoutScreenSizeThreshold) {
			this.layoutScreenSizeThreshold = 1024;
		}

		// do not try to access the window object if rendered on the server
		if (typeof window === 'object' && 'matchMedia' in window) {
			let query: MediaQueryList = window.matchMedia(`(max-width: ${this.layoutScreenSizeThreshold}px)`);

			let queryListener = () => {
				ngZone.run(() => {
					this.sizesSubject.next(query.matches);
				});
			};

			query.addListener(queryListener);

			this.windowMediaQueryListener = function () {
				query.removeListener(queryListener);
			};

			// set the initial state
			this.sizesSubject.next(query.matches);
		}
	}

	public isSmallScreen(): boolean
	{
		return this.sizesSubject.value;
	}

	public sizes(): Observable<boolean>
	{
		return this.sizesSubject.asObservable();
	}

	destroy()
	{
		if (this.windowMediaQueryListener) {
			this.windowMediaQueryListener();
			this.windowMediaQueryListener = null;
		}
	}
}

@Component({
	moduleId: module.id,
	selector: 'mdl-layout-drawer',
	host: {
		'[class.mdl-layout__drawer]': 'true',
		'[class.is-visible]': 'isDrawerVisible'
	},
	template: `<ng-content></ng-content>`,
	encapsulation: ViewEncapsulation.None
})
export class MdlLayoutDrawerComponent
{
	public isDrawerVisible = false;

	constructor(
		@Optional() @Inject(forwardRef(() => MdlLayoutComponent)) private parentLayout: MdlLayoutComponent
	) {}

	public isDrawerDirectChildOf(layout: MdlLayoutComponent)
	{
		return this.parentLayout === layout;
	}
}

@Component({
	moduleId: module.id,
	selector: 'mdl-layout-header',
	host: {
		'[class.mdl-layout__header]': 'true',
		'[class.is-casting-shadow]': 'mode==="standard" || isCompact',
		'[class.mdl-layout__header--seamed]': 'isSeamed',
		'[class.mdl-layout__header--waterfall]': 'mode==="waterfall"',
		'[class.mdl-layout__header--scroll]': 'mode==="scroll"',
		'[class.is-compact]': 'isCompact',
		'(transitionend)': 'onTransitionEnd()',
		'(click)': 'onClick()'
	},
	template: `
		<ng-content></ng-content>
		<div *ngIf="tabs?.toArray()?.length > 0" class="mdl-layout__tab-bar-container">
			<div class="mdl-layout__tab-bar is-casting-shadow">
				<div *ngFor="let tab of tabs.toArray()"
					class="mdl-layout__tab"
					[ngClass]="{ 'is-active': tab.isActive }"
					(mouseover)="mdlLayout.onTabMouseover(tab)"
 					(mouseout)="mdlLayout.onTabMouseout(tab)"
				>
					<div
						*ngIf="tab.titleComponent"
						(click)="mdlLayout.tabSelected(tab)"
						[mdl-ripple]="isRipple"
						[append-view-container-ref]="tab.titleComponent.vcRef"></div>
					<a *ngIf="!tab.titleComponent"
						href="javascript:void(0)"
						(click)="mdlLayout.tabSelected(tab)"
						class="mdl-layout__tab"
						[ngClass]="{ 'is-active': tab.isActive }"
						[mdl-ripple]="isRipple"
					>{{tab.title}}</a>
				</div>
			</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None
})
export class MdlLayoutHeaderComponent
{
	// set from MdlLayoutComponent
	public mode: string;
	public el: HTMLElement;
	public isCompact = false;
	public isAnimating = false;
	public isSeamed = false;
	public isRipple = true;

	// will be set from MdlLayoutComponent
	public tabs: QueryList<MdlLayoutTabPanelComponent>;

	constructor(
		// TODO: Confirm safe removal of `MdlLayoutHeaderComponent.elementRef`
		elementRef: ElementRef,
		// TODO: Confirm safe removal of `MdlLayoutHeaderComponent.renderer`
		// private renderer: Renderer2,
		@Inject(forwardRef(() => MdlLayoutComponent))
		public mdlLayout: MdlLayoutComponent
	) {
		this.el = elementRef.nativeElement;
	}

	public onTransitionEnd()
	{
		this.isAnimating = false;
	}

	public onClick()
	{
		if (this.isCompact) {
			this.isCompact = false;
			this.isAnimating = true;
		}
	}
}

@Component({
	moduleId: module.id,
	selector: 'mdl-layout',
	template: `
		<div class="mdl-layout__container" [ngClass]="{ 'has-scrolling-header': mode === 'scroll' }">
			<div class="mdl-layout is-upgraded" [ngClass]="{
					'is-small-screen': isSmallScreen,
					'mdl-layout--fixed-drawer': isFixedDrawer,
					'mdl-layout--fixed-header': isFixedHeader,
					'mdl-layout--fixed-tabs': 'tabs.toArray().length > 0'
				}">
				<ng-content select="mdl-layout-header"></ng-content>
				<ng-content select="mdl-layout-drawer"></ng-content>
				<div *ngIf="drawer && isNoDrawer==false" class="mdl-layout__drawer-button" (click)="toggleDrawer()">
					<mdl-icon>&#xE5D2;</mdl-icon>
				</div>
				<ng-content select="mdl-layout-content"></ng-content>
				<div class="mdl-layout__obfuscator"
					[ngClass]="{ 'is-visible': isDrawerVisible }"
					(click)="toggleDrawer()"
					(keydown)="obfuscatorKeyDown($event)"
				></div>
			</div>
		</div>
	`,
	exportAs: 'mdlLayout',
	encapsulation: ViewEncapsulation.None
})
export class MdlLayoutComponent implements AfterContentInit, OnDestroy, OnChanges
{
	@ContentChild(MdlLayoutHeaderComponent) public header: MdlLayoutHeaderComponent;
	// will be set to undefined, if not a direct child or not present in 2.0.0 i
	// n 2.0.1 it is now the grand child drawer again :(
	@ContentChild(MdlLayoutDrawerComponent) public drawer: null | MdlLayoutDrawerComponent;
	@ContentChild(MdlLayoutContentComponent) public content: MdlLayoutContentComponent;

	@Input('mdl-layout-mode')
	public mode: string = STANDARD;

	private _isFixedDrawer: boolean = false;
	@Input('mdl-layout-fixed-drawer')
	get isFixedDrawer() { return this._isFixedDrawer; }
	set isFixedDrawer(value) { this._isFixedDrawer = toBoolean(value); }

	private _isFixedHeader: boolean = false;
	@Input('mdl-layout-fixed-header')
	get isFixedHeader() { return this._isFixedHeader; }
	set isFixedHeader(value) { this._isFixedHeader = toBoolean(value); }

	private _isSeamed: boolean = false;
	@Input('mdl-layout-header-seamed')
	get isSeamed() { return this._isSeamed; }
	set isSeamed(value) { this._isSeamed = toBoolean(value); }

	private _selectedIndex: null | number = 0;
	@Input('mdl-layout-tab-active-index')
	get selectedIndex(): null | number { return this._selectedIndex; }
	set selectedIndex(value) { this._selectedIndex = toNumber(value); }

	private _isNoDrawer: boolean = false;
	@Input('mdl-layout-no-drawer-button')
	get isNoDrawer() { return this._isNoDrawer; }
	set isNoDrawer(value) { this._isNoDrawer = toBoolean(value); }

	@Output('mdl-layout-tab-active-changed') public selectedTabEmitter = new EventEmitter();
	@Output('mdl-layout-tab-mouseover') public mouseoverTabEmitter = new EventEmitter();
	@Output('mdl-layout-tab-mouseout') public mouseoutTabEmitter = new EventEmitter();
	@Output('close') public onClose = new EventEmitter<void>();
	@Output('open') public onOpen = new EventEmitter<void>();

	public isDrawerVisible = false;
	public isSmallScreen = false;

	private scrollListener: Function | null;

	constructor(
		private renderer: Renderer2,
		// TODO: Confirm safe removal of `MdlLayoutComponent.evm`
		// private evm: EventManager,
		// TODO: Confirm safe removal of `MdlLayoutComponent.el`
		// el: ElementRef,
		private screenSizeService: MdlScreenSizeService
	) {}

	public ngAfterContentInit()
	{
		this.validateMode();

		if (this.header && this.content && this.content.tabs) {
			this.header.tabs = this.content.tabs;
			this.updateSelectedTabIndex();
		}

		// set this.drawer to null, if the drawer is not a direct child if this layout. It may be a drywer of a sub layout.
		if (this.drawer && !this.drawer.isDrawerDirectChildOf(this)) {
			this.drawer = null;
		}
	}

	public ngOnChanges(changes: SimpleChanges): any
	{
		if (changes['selectedIndex']) {
			this.updateSelectedTabIndex();
		}
	}

	private updateSelectedTabIndex()
	{
		if (this.header && this.header.tabs) {
			this.header.tabs.forEach((tab: any) => tab.isActive = false);

			// TODO: Confirm safe ts-ignore
			// @ts-ignore
			if (this.header.tabs.toArray().length > 0 && this.selectedIndex < this.header.tabs.toArray().length) {
				// TODO: Confirm safe ts-ignore
				// @ts-ignore
				this.header.tabs.toArray()[this.selectedIndex].isActive = true;
			}
		}
	}

	private validateMode()
	{
		if (this.mode === '') {
			this.mode = STANDARD;
		}

		if ([STANDARD, WATERFALL, SCROLL].indexOf(this.mode) === -1) {
			throw new MdLUnsupportedLayoutTypeError(this.mode);
		}

		if (this.header) {
			// inform the header about the mode
			this.header.mode = this.mode;
			this.header.isSeamed = this.isSeamed;
		}

		if (this.content) {
			this.scrollListener = this.renderer.listen(this.content.el, 'scroll', () => {
				this.onScroll(this.content.el.scrollTop);
				return true;
			});

			this.screenSizeService.sizes().subscribe((isSmall: boolean) => {
				this.onQueryChange(isSmall);
			});
		}
	}

	private onScroll(scrollTop: number)
	{
		if (this.mode !== WATERFALL) {
			return;
		}

		if (this.header.isAnimating) {
			return;
		}

		let headerVisible = !this.isSmallScreen || this.isFixedHeader;
		if (scrollTop > 0 && !this.header.isCompact) {
			this.header.isCompact = true;

			if (headerVisible) {
				this.header.isAnimating = true;
			}
		} else if (scrollTop <= 0 && this.header.isCompact) {
			this.header.isCompact = false;

			if (headerVisible) {
				this.header.isAnimating = true;
			}
		}
	}

	private onQueryChange(isSmall: boolean)
	{
		if (isSmall) {
			this.isSmallScreen = true;
		} else {
			this.isSmallScreen = false;
			this.closeDrawer();
		}
	}

	public toggleDrawer()
	{
		this.isDrawerVisible = !this.isDrawerVisible;
		if (this.drawer) {
			this.setDrawerVisible(this.isDrawerVisible);
		}
	}

	public closeDrawer()
	{
		this.isDrawerVisible = false;
		if (this.drawer) {
			this.setDrawerVisible(false);
		}
	}

	public openDrawer()
	{
		this.isDrawerVisible = true;
		if (this.drawer) {
			this.setDrawerVisible(true);
		}
	}

	private setDrawerVisible(visible: boolean)
	{
		// TODO: Confirm safe ts-ignore
		// @ts-ignore
		this.drawer.isDrawerVisible = visible;
		// TODO: Confirm safe ts-ignore
		// @ts-ignore
		this.drawer.isDrawerVisible ? this.onOpen.emit() : this.onClose.emit();
	}

	public obfuscatorKeyDown($event: KeyboardEvent)
	{
		if ($event.keyCode === ESCAPE) {
			this.toggleDrawer();
		}
	}

	public ngOnDestroy()
	{
		if (this.scrollListener) {
			this.scrollListener();
			this.scrollListener = null;
		}
	}

	// triggered from mdl-layout-header.component
	public tabSelected(tab: any)
	{
		let index = this.header.tabs.toArray().indexOf(tab);
		if (index != this.selectedIndex) {
			this.selectedIndex = index;
			this.updateSelectedTabIndex();
			this.selectedTabEmitter.emit({ index: this.selectedIndex });
		}
	}

	// triggered from mdl-layout-header.component
	public onTabMouseover(tab: any)
	{
		let index = this.header.tabs.toArray().indexOf(tab);
		this.mouseoverTabEmitter.emit({ index: index });
	}

	// triggered from mdl-layout-header.component
	public onTabMouseout(tab: any)
	{
		let index = this.header.tabs.toArray().indexOf(tab);
		this.mouseoutTabEmitter.emit({ index: index });
	}

	public closeDrawerOnSmallScreens()
	{
		if (this.isSmallScreen && this.isDrawerVisible) {
			this.closeDrawer();
		}
	}

	public openDrawerOnSmallScreens()
	{
		if (this.isSmallScreen && !this.isDrawerVisible) {
			this.openDrawer();
		}
	}

	public hasDrawer()
	{
		return !!this.drawer;
	}
}
