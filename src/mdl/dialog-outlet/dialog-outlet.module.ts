import { NgModule } from '@angular/core';
import { MdlDialogOutletComponent } from './mdl-dialog-outlet.component';
import { MdlDialogOutletService } from './mdl-dialog-outlet.service';
import { MdlBackdropOverlayComponent } from './mdl-backdrop-overlay.component';
import { MdlDialogInnerOutletComponent } from './dialog-inner-outlet.component';

const PUBLIC_COMPONENTS = [
	MdlDialogInnerOutletComponent
];

const PRIVATE_COMPONENTS = [
	MdlDialogOutletComponent,
	MdlBackdropOverlayComponent
];

@NgModule({
	imports: [],
	exports: PUBLIC_COMPONENTS,
	declarations: [
		...PUBLIC_COMPONENTS,
		...PRIVATE_COMPONENTS
	],
	entryComponents: [
		MdlDialogOutletComponent,
		MdlBackdropOverlayComponent
	],
	providers: [MdlDialogOutletService]
})
export class MdlDialogOutletModule
{}
