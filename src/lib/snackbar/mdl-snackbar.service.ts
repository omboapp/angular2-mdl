import {
	Component,
	Injectable,
	ComponentRef,
	ComponentFactoryResolver,
	ViewEncapsulation,
	ComponentFactory
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MdlDialogOutletService } from '@angular/mdl/dialog-outlet';

const ANIMATION_TIME = 250;

@Component({
	moduleId: module.id,
	selector: 'mdl-snackbar-component',
	template: `
		<div id="demo-toast-example" class=" mdl-snackbar" [ngClass]="{ 'mdl-snackbar--active': showIt }">
			<div class="mdl-snackbar__text">{{message}}</div>
			<button *ngIf="onAction" class="mdl-snackbar__action" type="button" (click)="onClick()">{{actionText}}</button>
		</div>
	`,
	encapsulation: ViewEncapsulation.None
})
export class MdlSnackbarComponent
{
	public message: string;
	public actionText: string;
	public showIt = false;
	public onAction: () => void;

	public onClick()
	{
		this.onAction();
	}

	public isActive()
	{
		return this.showIt;
	}

	public show(): Observable<void>
	{
		let result: Subject<any> = new Subject();

		// wait unit the dom is in place - then showIt will change the css class
		setTimeout(() => {
			this.showIt = true;

			// fire after the view animation is done
			setTimeout(() => {
				result.next(null);
				result.complete();
			}, ANIMATION_TIME);
		}, ANIMATION_TIME);

		return result.asObservable();
	}

	public hide(): Observable<void>
	{
		this.showIt = false;

		let result: Subject<any> = new Subject();

		// fire after the view animation is done
		setTimeout(() => {
			result.next(null);
			result.complete();
		}, ANIMATION_TIME);

		return result.asObservable();
	}
}

export interface IMdlSnackbarMessage
{
	message: string;
	timeout?: number;
	closeAfterTimeout?: boolean;
	action?: {
		handler: () => void;
		text: string;
	};
}

@Injectable()
export class MdlSnackbarService
{
	private cFactory: ComponentFactory<any>;
	private previousSnack: { component: MdlSnackbarComponent, cRef: ComponentRef<any> };

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private dialogOutletService: MdlDialogOutletService
	) {
		this.cFactory = this.componentFactoryResolver.resolveComponentFactory(MdlSnackbarComponent);
	}

	public showToast(message: string, timeout?: number): Observable<MdlSnackbarComponent>
	{
		return this.showSnackbar({
			message: message,
			timeout: timeout
		});
	}

	public showSnackbar(snackbarMessage: IMdlSnackbarMessage): Observable<MdlSnackbarComponent>
	{
		let optTimeout = snackbarMessage.timeout || 2750;
		let closeAfterTimeout = !!snackbarMessage.closeAfterTimeout;
		let viewContainerRef = this.dialogOutletService.viewContainerRef;

		if (!viewContainerRef) {
			throw new Error(
				'You did not provide a ViewContainerRef. ' +
				'Please see https://github.com/mseemann/angular2-mdl/wiki/How-to-use-the-MdlDialogService'
			);
		}

		let cRef = viewContainerRef.createComponent(this.cFactory, viewContainerRef.length);

		let mdlSnackbarComponent = <MdlSnackbarComponent>cRef.instance;
		mdlSnackbarComponent.message = snackbarMessage.message;

		if (this.previousSnack) {
			let previousSnack = this.previousSnack;
			let subscription = previousSnack.component.hide().subscribe(() => {
				previousSnack.cRef.destroy();
				subscription.unsubscribe();
			});
		}

		this.previousSnack = {
			component: mdlSnackbarComponent,
			cRef: cRef
		};

		if (snackbarMessage.action) {
			if (closeAfterTimeout) {
				this.hideAndDestroySnack(mdlSnackbarComponent, cRef, optTimeout);
			}

			mdlSnackbarComponent.actionText = snackbarMessage.action.text;
			mdlSnackbarComponent.onAction = () => {
				mdlSnackbarComponent.hide().subscribe(() => {
					cRef.destroy();
					// TODO: Confirm safe ts-ignore
					// @ts-ignore
					snackbarMessage.action.handler();
				});
			};
		} else {
			this.hideAndDestroySnack(mdlSnackbarComponent, cRef, optTimeout);
		}

		let result: Subject<MdlSnackbarComponent> = new Subject<MdlSnackbarComponent>();

		mdlSnackbarComponent.show().subscribe(() => {
			result.next(mdlSnackbarComponent);
			result.complete();
		});

		return result.asObservable();
	}

	private hideAndDestroySnack(
		component: MdlSnackbarComponent,
		componentRef: ComponentRef<MdlSnackbarComponent>,
		timeOut: number
	) {
		setTimeout(() => {
			component.hide().subscribe(() => {
				componentRef.destroy();
			});
		}, timeOut);
	}
}
