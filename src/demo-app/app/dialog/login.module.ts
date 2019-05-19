import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlDialogModule } from '../../../mdl/dialog';
import { MdlSnackbarModule } from '../../../mdl/snackbar';
import { MdlTextFieldModule } from '../../../mdl/textfield';
import { LoginDialogComponent } from './login-dialog.component';
import { LoginService } from './login.service';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MdlDialogModule,
		MdlSnackbarModule,
		MdlTextFieldModule
	],
	declarations: [LoginDialogComponent],
	entryComponents: [LoginDialogComponent],
	providers: [LoginService]
})
export class LoginModule
{}
