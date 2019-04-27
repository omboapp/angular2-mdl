import {
	// Inject,
	Injectable,
	ComponentFactoryResolver,
	ComponentRef,
	Type,
	ReflectiveInjector,
	Provider,
	// ApplicationRef,
	ViewContainerRef,
	TemplateRef,
	EventEmitter,
	InjectionToken,
	Component,
	ViewEncapsulation,
	HostListener,
	forwardRef,
	Inject,
	ViewChildren,
	QueryList,
	ElementRef,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core';
import { Animations } from '@angular/mdl/common';
// import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { MdlDialogOutletService } from '@angular/mdl/dialog-outlet';
import {
	IMdlCustomDialogConfiguration,
	IMdlDialogAction,
	IMdlDialogConfiguration,
	IOpenCloseRect,
	IMdlSimpleDialogConfiguration,
} from './mdl-dialog-configuration';
import { InternalMdlDialogReference } from './internal-dialog-reference';
import { MdlButtonComponent } from '@angular/mdl/button';
import { MdlDialogReference } from './dialog-reference';

export const MDL_CONFIGURATION = new InjectionToken<IMdlDialogConfiguration>('MDL_CONFIGURATION');
export const MIN_DIALOG_Z_INDEX = 100000;

/**
 * The MdlDialogService is used to open different kind of dialogs. SimpleDialogs and Custom Dialogs.
 * @experimental
 */
@Injectable()
export class MdlDialogService
{
	private openDialogs = new Array<InternalMdlDialogReference>();

	/**
	 * Emits an event when either all modals are closed, or one gets opened.
	 * @returns A subscribable event emitter that provides a boolean indicating whether a modal is open or not.
	 */
	public onDialogsOpenChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		// TODO: Confirm safe removal of `MdlDialogService.doc`
		// @Inject(DOCUMENT) private doc: any,
		// TODO: Confirm safe removal of `MdlDialogService.appRef`
		// private appRef: ApplicationRef,
		private mdlDialogOutletService: MdlDialogOutletService
	) {
		this.mdlDialogOutletService.backdropClickEmitter.subscribe(() => {
			this.onBackdropClick();
		});
	}

	/**
	 * Shows a dialog that is just an alert - e.g. with one button.
	 * @param alertMessage The message that should be displayed.
	 * @param okText The text that the button should have
	 * @param title The optional title of the dialog
	 * @returns An Observable that is called if the user hits the Ok button.
	 */
	public alert(alertMessage: string, okText = 'Ok', title?: string): Observable<void>
	{
		let result: Subject<any> = new Subject();

		this.showDialog({
			title: title,
			message: alertMessage,
			actions: [{
				handler: () => {
					result.next(null);
					result.complete();
				}, text: okText
			}],
			isModal: true
		});

		return result;
	}

	/**
	 * Shows a dialog that is just a confirm message - e.g. with two button.
	 * @param question The question that should be displayed.
	 * @param title The title that should be displayed on top of Question.
	 * @param declineText The text for decline button. defaults to Cancel
	 * @param confirmText The text for the confirm button . defaults to Ok
	 * @returns An Observable that is called if the user hits the Ok button.
	 */
	public confirm(
		question: string,
		declineText = 'Cancel',
		confirmText = 'Ok',
		title?: string
	): Observable<void>
	{
		let result: Subject<any> = new Subject();

		this.showDialog({
			title: title,
			message: question,
			actions: [
				{
					handler: () => {
						result.next(null);
						result.complete();
					},
					text: confirmText
				},
				{
					handler: () => {
						result.error(null);
					},
					text: declineText,
					isClosingAction: true
				}
			],
			isModal: true
		});

		return result.asObservable();
	}

	/**
	 * Shows a dialog that is specified by the provided configuration.
	 * @param config The simple dialog configuration.
	 * @returns An Observable that returns the MdlDialogReference.
	 */
	public showDialog(config: IMdlSimpleDialogConfiguration): Observable<MdlDialogReference>
	{
		if (config.actions.length === 0) {
			throw new Error('a dialog must have at least one action');
		}

		let internalDialogRef = new InternalMdlDialogReference(config);

		let providers = [
			{ provide: MdlDialogReference, useValue: new MdlDialogReference(internalDialogRef) },
			{ provide: MDL_CONFIGURATION, useValue: config }
		];

		let hostComponentRef = this.createHostDialog(internalDialogRef, config);

		// TODO: Confirm safe removal of local var `MdlDialogService.showDialog() cRef`
		this.createComponentInstance(
			hostComponentRef.instance.dialogTarget,
			providers,
			MdlSimpleDialogComponent
		);

		return this.showHostDialog(internalDialogRef.dialogRef, hostComponentRef);
	}

	/**
	 * Shows a dialog that is specified by the provided configuration.
	 * @param config The custom dialog configuration.
	 * @returns An Observable that returns the MdlDialogReference.
	 */
	public showCustomDialog(config: IMdlCustomDialogConfiguration): Observable<MdlDialogReference>
	{
		let internalDialogRef = new InternalMdlDialogReference(config);

		let providers: Provider[] = [
			{ provide: MdlDialogReference, useValue: new MdlDialogReference(internalDialogRef) }
		];

		if (config.providers) {
			providers.push(...config.providers);
		}

		let hostComponentRef = this.createHostDialog(internalDialogRef, config);

		this.createComponentInstance(hostComponentRef.instance.dialogTarget, providers, config.component);

		return this.showHostDialog(internalDialogRef.dialogRef, hostComponentRef);
	}

	public showDialogTemplate(
		template: TemplateRef<any>,
		config: IMdlDialogConfiguration
	): Observable<MdlDialogReference>
	{
		let internalDialogRef = new InternalMdlDialogReference(config);

		let hostComponentRef = this.createHostDialog(internalDialogRef, config);

		hostComponentRef.instance.dialogTarget.createEmbeddedView(template);

		return this.showHostDialog(internalDialogRef.dialogRef, hostComponentRef);
	}

	private showHostDialog(dialogRef: MdlDialogReference, hostComponentRef: ComponentRef<MdlDialogHostComponent>)
	{
		let result: Subject<any> = new Subject();

		setTimeout(() => {
			result.next(dialogRef);
			result.complete();
			hostComponentRef.instance.show();
		});

		return result.asObservable();
	}

	private createHostDialog(internalDialogRef: InternalMdlDialogReference, dialogConfig: IMdlDialogConfiguration)
	{
		let viewContainerRef = this.mdlDialogOutletService.viewContainerRef;

		if (!viewContainerRef) {
			throw new Error('You did not provide a ViewContainerRef. ' +
				'Please see https://github.com/mseemann/angular2-mdl/wiki/How-to-use-the-MdlDialogService');
		}

		let providers: Provider[] = [
			{ provide: MDL_CONFIGURATION, useValue: dialogConfig },
			{ provide: InternalMdlDialogReference, useValue: internalDialogRef }
		];

		let hostDialogComponent = this.createComponentInstance(viewContainerRef, providers, MdlDialogHostComponent);

		internalDialogRef.hostDialogComponentRef = hostDialogComponent;
		internalDialogRef.isModal = dialogConfig.isModal;

		internalDialogRef.closeCallback = () => {
			this.popDialog(internalDialogRef);
			hostDialogComponent.instance.hide(hostDialogComponent);
		};
		this.pushDialog(internalDialogRef);

		return hostDialogComponent;
	}

	private pushDialog(dialogRef: InternalMdlDialogReference)
	{
		if (this.openDialogs.length == 0) { // first dialog being opened
			this.onDialogsOpenChanged.emit(true);
		}

		this.openDialogs.push(dialogRef);
		this.orderDialogStack();
	}

	private popDialog(dialogRef: InternalMdlDialogReference)
	{
		this.openDialogs.splice(this.openDialogs.indexOf(dialogRef), 1);
		this.orderDialogStack();

		if (this.openDialogs.length == 0) { // last dialog being closed
			this.onDialogsOpenChanged.emit(false);
		}
	}

	private orderDialogStack()
	{
		// +1 because the overlay may have MIN_DIALOG_Z_INDEX if the dialog is modal.
		let zIndex = MIN_DIALOG_Z_INDEX + 1;

		this.openDialogs.forEach((iDialogRef) => {
			iDialogRef.hostDialog.zIndex = zIndex;
			// +2 to make room for the overlay if a dialog is modal
			zIndex += 2;
		});

		this.mdlDialogOutletService.hideBackdrop();

		// if there is a modal dialog append the overlay to the dom - if not remove the overlay from the body
		let topMostModalDialog: InternalMdlDialogReference | null = this.getTopMostInternalDialogRef();

		if (topMostModalDialog) {
			// move the overlay directly under the topmost modal dialog
			this.mdlDialogOutletService.showBackdropWithZIndex(topMostModalDialog.hostDialog.zIndex - 1);
		}
	}

	private getTopMostInternalDialogRef(): InternalMdlDialogReference | null
	{
		let topMostModalDialog: InternalMdlDialogReference | null = null;

		for (var i = (this.openDialogs.length - 1); i >= 0; i--) {
			if (this.openDialogs[i].isModal) {
				topMostModalDialog = this.openDialogs[i];
				break;
			}
		}

		return topMostModalDialog;
	}

	private onBackdropClick()
	{
		let topMostModalDialog: InternalMdlDialogReference | null = this.getTopMostInternalDialogRef();
		if (topMostModalDialog && topMostModalDialog.config.clickOutsideToClose) {
			topMostModalDialog.hide();
		}
	}

	private createComponentInstance<T>(
		viewContainerRef: ViewContainerRef,
		providers: Provider[],
		component: Type<T>
	): ComponentRef<any> {
		let cFactory = this.componentFactoryResolver.resolveComponentFactory(component);

		let resolvedProviders = ReflectiveInjector.resolve(providers);
		let parentInjector = viewContainerRef.parentInjector;
		let childInjector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, parentInjector);

		return viewContainerRef.createComponent(cFactory, viewContainerRef.length, childInjector);
	}
}

@Component({
	moduleId: module.id,
	selector: 'mdl-dialog-component',
	template: `
		<h3 class="mdl-dialog__title" *ngIf="dialogConfiguration?.title">{{dialogConfiguration?.title}}</h3>
		<div class="mdl-dialog__content" [innerHTML]="dialogConfiguration?.message"></div>
		<div
			class="mdl-dialog__actions"
			[ngClass]="{ 'mdl-dialog__actions--full-width': dialogConfiguration?.fullWidthAction }"
		>
			<button
				*ngFor="let action of dialogConfiguration?.actions"
				mdl-button mdl-colored="primary"
				type="button"
				(click)="actionClicked(action)"
				[ngClass]="{ 'close': action.isClosingAction }"
			>{{action.text}}</button>
		</div>
	`,
	encapsulation: ViewEncapsulation.None
})
export class MdlSimpleDialogComponent
{
	@ViewChildren(MdlButtonComponent) public buttons: QueryList<MdlButtonComponent>;

	// TODO: Why do we need forwardRef at this point -- the demo LoginDialog doesn't need this?
	constructor(
		@Inject(forwardRef(() => MDL_CONFIGURATION)) public dialogConfiguration: IMdlSimpleDialogConfiguration,
		@Inject(forwardRef(() => MdlDialogReference)) public dialog: MdlDialogReference
	) {
		dialog.onVisible()
			.subscribe(() => {
				if (this.buttons) {
					this.buttons.first.elementRef.nativeElement.focus();
				}
			});
	}

	public actionClicked(action: IMdlDialogAction)
	{
		action.handler();
		this.dialog.hide();
	}

	@HostListener('keydown.esc')
	public onEsc(): void
	{
		// run the first action that is marked as closing action
		let closeAction = this.dialogConfiguration.actions.find((action: any) => action.isClosingAction);

		if (closeAction) {
			closeAction.handler();
			this.dialog.hide();
		}
	}
}

const enterTransitionDuration = 300;
const leaveTransitionDuration = 250;

const enterTransitionEasingCurve = 'cubic-bezier(0.0, 0.0, 0.2, 1)';
const leaveTransitionEasingCurve = 'cubic-bezier(0.0, 0.0, 0.2, 1)';

// @experimental
@Component({
	moduleId: module.id,
	selector: 'mdl-dialog-host-component',
	host: {
		'[class.mdl-dialog]': 'true',
		'[class.open]': 'visible',
		'[style.zIndex]': 'zIndex',
	},
	template: `<div #dialogTarget></div>`,
	styles: [`
		mdl-dialog-host-component {
			width: -moz-fit-content;
			width: -webkit-fit-content;
			width: fit-content;
			height: -moz-fit-content;
			height: -webkit-fit-content;
			height: fit-content;
			padding: 1em;
			background: white;
			color: black;
			opacity: 1;
			visibility: hidden;
			display: block;
			position: fixed;
			margin: auto;
			left: 0;
			right: 0;
			transition: all;
			top: 50%;
			transform: translate(0, -50%);
		}

		mdl-dialog-host-component.open {
			visibility: visible;
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class MdlDialogHostComponent implements OnInit
{
	@ViewChild('dialogTarget', { read: ViewContainerRef }) public dialogTarget: any;

	public visible = false;

	private showAnimationStartStyle: { [key: string]: string } = {
		top: '38%',
		opacity: '0'
	};

	private showStyle: { [key: string]: string } = {
		top: '50%',
		opacity: '1'
	};

	private hideAnimationEndStyle: { [key: string]: string } = {
		top: '63%',
		opacity: '0'
	};

	public zIndex: number = MIN_DIALOG_Z_INDEX + 1;

	constructor(
		// TODO: Confirm safe removal of `MdlDialogHost.ngZone`
		// private ngZone: NgZone,
		private renderer: Renderer2,
		private animations: Animations,
		private elementRef: ElementRef,
		@Inject(forwardRef(() => MDL_CONFIGURATION)) private config: IMdlDialogConfiguration,
		private internalDialogRef: InternalMdlDialogReference
	) {}

	public show()
	{
		this.visible = true;

		// give the dialogs time to draw so that a focus can be set
		setTimeout(() => {
			this.internalDialogRef.visible();
		});

		if (this.isAnimateEnabled()) {
			if (this.config.openFrom || this.config.closeTo) {

				// transform is modified during animation and must be part of each animation keyframe.
				this.showStyle['transform'] = 'translate(0, -50%) scale(1.0)';

				const targetClientRect = this.elementRef.nativeElement.getBoundingClientRect();

				const openFromRect = this.getClientRect(this.config.openFrom);
				const closeToRect = this.config.closeTo ? this.getClientRect(this.config.closeTo) : openFromRect;

				const centerTarget = this.getCenterInScreen(targetClientRect);
				const centerFrom = this.getCenterInScreen(openFromRect);
				const centerTo = this.getCenterInScreen(closeToRect);

				const translationFrom = {
					x: Math.round(centerFrom.cx - centerTarget.cx),
					y: Math.round(centerFrom.cy - centerTarget.cy),
					scaleX: Math.round(100 * Math.min(0.25, openFromRect.width / targetClientRect.width)) / 100,
					scaleY: Math.round(100 * Math.min(0.25, openFromRect.height / targetClientRect.height)) / 100
				};

				this.showAnimationStartStyle = {
					top: `${targetClientRect.top}px`,
					opacity: '0',
					transform: `translate(${translationFrom.x}px, ${translationFrom.y}px) ` +
						`scale(${translationFrom.scaleX}, ${translationFrom.scaleY})`
				};

				const translationTo = {
					x: Math.round(centerTo.cx - centerTarget.cx),
					y: Math.round(centerTo.cy - centerTarget.cy),
					scaleX: Math.round(100 * Math.min(0.25, closeToRect.width / targetClientRect.width)) / 100,
					scaleY: Math.round(100 * Math.min(0.25, closeToRect.height / targetClientRect.height)) / 100
				};

				this.hideAnimationEndStyle = {
					top: `${targetClientRect.top}px`,
					opacity: '0',
					transform: `translate(${translationTo.x}px, ${translationTo.y}px) ` +
						`scale(${translationTo.scaleX}, ${translationTo.scaleY})`
				};
			}

			let animation: any = this.animations.animate(
				this.elementRef.nativeElement,
				[
					this.showAnimationStartStyle,
					this.showStyle
				],
				this.config.enterTransitionDuration || enterTransitionDuration,
				this.config.enterTransitionEasingCurve || enterTransitionEasingCurve);

			animation.play();
		}
	}

	public hide(selfComponentRef: ComponentRef<MdlDialogHostComponent>)
	{
		if (this.isAnimateEnabled()) {

			let animation: any = this.animations.animate(
				this.elementRef.nativeElement,
				[
					this.showStyle,
					this.hideAnimationEndStyle
				],
				this.config.leaveTransitionDuration || leaveTransitionDuration,
				this.config.leaveTransitionEasingCurve || leaveTransitionEasingCurve);

			animation.onDone(() => {
				selfComponentRef.destroy();
			});

			animation.play();

		} else {
			selfComponentRef.destroy();
		}
	}

	public ngOnInit()
	{
		this.applyStyle(this.config.styles);
		this.applyClasses(this.config.classes ? this.config.classes : '');
	}

	private applyStyle(styles: { [key: string]: string } | undefined)
	{
		if (styles) {
			for (let style in styles) {
				this.renderer.setStyle(this.elementRef.nativeElement, style, styles[style]);
			}
		}
	}

	private applyClasses(classes: string)
	{
		classes
			.split(' ')
			.filter((cssClass) => { return !!cssClass; })
			.forEach((cssClass) => {
				this.renderer.addClass(this.elementRef.nativeElement, cssClass);
			});
	}

	private isAnimateEnabled()
	{
		// not present? assume it is true.
		if (typeof this.config.animate === 'undefined') {
			return true;
		}

		return this.config.animate;
	}

	private getClientRect(input: MdlButtonComponent | MouseEvent | IOpenCloseRect | undefined): IOpenCloseRect
	{
		if (input instanceof MdlButtonComponent) {

			const rect: ClientRect = (input as MdlButtonComponent).elementRef.nativeElement.getBoundingClientRect();
			return this.createOpenCloseRect(rect);

		} else if (input instanceof MouseEvent) {

			const evt: any = input as MouseEvent;
			// just to make it possible to test this code with a fake event - target is
			// readonly and con not be mutated.
			const htmlElement = (evt.target || evt['testtarget']) as HTMLElement;
			const rect: ClientRect = htmlElement.getBoundingClientRect();
			return this.createOpenCloseRect(rect);

		}

		return input as IOpenCloseRect;
	}

	private createOpenCloseRect(rect: ClientRect): IOpenCloseRect
	{
		return {
			height: rect.top - rect.bottom,
			left: rect.left,
			top: rect.top,
			width: rect.right - rect.left
		};
	}

	private getCenterInScreen(rect: IOpenCloseRect)
	{
		return {
			cx: Math.round(rect.left + (rect.width / 2)),
			cy: Math.round(rect.top + (rect.height / 2))
		};
	}
}
