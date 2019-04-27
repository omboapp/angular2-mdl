import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlRadioComponent, MdlRadioGroupRegisty } from './mdl-radio.component';

@NgModule({
	imports: [CommonModule, FormsModule],
	exports: [MdlRadioComponent],
	declarations: [MdlRadioComponent],
	providers: [MdlRadioGroupRegisty]
})
export class MdlRadioModule
{}
