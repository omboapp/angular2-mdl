import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlAnimationsModule, MdlCommonModule } from '@angular/mdl/common';
import { MdlButtonModule } from '@angular/mdl/button';
import { MdlDialogOutletModule, MdlDialogOutletService } from '@angular/mdl/dialog-outlet';
import { MdlDialogHostComponent, MdlDialogService, MdlSimpleDialogComponent } from './dialog';
import { MdlDialogComponent } from './mdl-dialog.component';
import { MdlAlertComponent } from './mdl-alert.component';

const PUBLIC_COMPONENTS = [
	MdlDialogComponent,
	MdlAlertComponent
];

const PRIVATE_COMPONENTS = [
	MdlDialogHostComponent,
	MdlSimpleDialogComponent
];

@NgModule({
	imports: [
		CommonModule,
		MdlCommonModule,
		MdlAnimationsModule,
		MdlButtonModule,
		MdlDialogOutletModule
	],
	exports: [
		...PUBLIC_COMPONENTS,
	],
	declarations: [
		...PUBLIC_COMPONENTS,
		...PRIVATE_COMPONENTS
	],
	providers: [
		MdlDialogService,
		MdlDialogOutletService
	],
	entryComponents: [
		...PUBLIC_COMPONENTS,
		...PRIVATE_COMPONENTS
	],
})
export class MdlDialogModule {}
