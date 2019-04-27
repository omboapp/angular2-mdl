import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlDialogModule } from '../../../lib/dialog';
import { MdlSnackbarModule } from '../../../lib/snackbar';
import { MdlTextFieldModule } from '../../../lib/textfield';
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
