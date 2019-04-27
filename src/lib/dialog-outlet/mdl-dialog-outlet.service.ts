import {
	ViewContainerRef,
	Injectable,
	ApplicationRef,
	ComponentFactoryResolver,
	EventEmitter,
	NgZone,
	ComponentRef
} from '@angular/core';
import { take } from 'rxjs/operators';
import { MdlDialogOutletComponent } from './mdl-dialog-outlet.component';
import { MdlBackdropOverlayComponent } from './mdl-backdrop-overlay.component';

@Injectable()
export class MdlDialogOutletService
{
	private viewContainerRef_: null | ViewContainerRef;
	private backdropComponent: MdlBackdropOverlayComponent;

	public backdropClickEmitter: EventEmitter<any> = new EventEmitter();

	constructor(
		private appRef: ApplicationRef,
		private componentFactoryResolver: ComponentFactoryResolver,
		ngZone: NgZone
	) {
		let dialogOutletCompRef: ComponentRef<MdlDialogOutletComponent> | null = null;

		ngZone.onStable.pipe(take(1)).subscribe(() => {
			try {
				dialogOutletCompRef = this.appRef.bootstrap(MdlDialogOutletComponent);
			} catch (e) {
				// the user did not use the dialog.outlet element outside of his root app.
				// console.log(e);
			}

			if (dialogOutletCompRef) {
				this.setViewContainerRef(dialogOutletCompRef.instance.viewContainerRef);
			}
		});
	}

	public setDefaultViewContainerRef(vCRef: null | ViewContainerRef)
	{
		this.setViewContainerRef(vCRef);
	}

	public get viewContainerRef(): null | ViewContainerRef
	{
		return this.viewContainerRef_;
	}

	private setViewContainerRef(value: null | ViewContainerRef)
	{
		this.viewContainerRef_ = value;

		if (this.viewContainerRef_) {
			let cFactory = this.componentFactoryResolver.resolveComponentFactory(MdlBackdropOverlayComponent);

			this.backdropComponent = this.viewContainerRef_.createComponent(cFactory).instance;
			this.backdropComponent.clickEmitter.subscribe(() => {
				this.backdropClickEmitter.emit();
			});
		}
	}

	public hideBackdrop()
	{
		this.backdropComponent.hide();
	}

	public showBackdropWithZIndex(zIndex: number)
	{
		this.backdropComponent.showWithZIndex(zIndex);
	}
}
