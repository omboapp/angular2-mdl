import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlDialogOutletModule } from '@angular/mdl/dialog-outlet';
import { MdlSnackbarComponent, MdlSnackbarService } from './mdl-snackbar.service';

@NgModule({
	imports: [
		CommonModule,
		MdlDialogOutletModule
	],
	exports: [MdlSnackbarComponent],
	declarations: [MdlSnackbarComponent],
	providers: [MdlSnackbarService],
	entryComponents: [MdlSnackbarComponent]
})
export class MdlSnackbarModule
{}
