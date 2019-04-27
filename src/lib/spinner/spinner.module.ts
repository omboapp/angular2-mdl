import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlSpinnerComponent } from './mdl-spinner.component';

const MDL_SPINNER_DIRECTIVES = [MdlSpinnerComponent];

@NgModule({
	imports: [CommonModule],
	exports: MDL_SPINNER_DIRECTIVES,
	declarations: MDL_SPINNER_DIRECTIVES,
})
export class MdlSpinnerModule
{}
