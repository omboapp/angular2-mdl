import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlButtonModule } from '@angular/mdl/button';
import { MdlIconModule } from '@angular/mdl/icon';
import { MdlTextFieldComponent } from './mdl-textfield.component';

@NgModule({
	imports: [MdlIconModule, MdlButtonModule, FormsModule, CommonModule],
	exports: [MdlTextFieldComponent],
	declarations: [MdlTextFieldComponent],
})
export class MdlTextFieldModule
{}
