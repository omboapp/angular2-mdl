import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlSliderComponent } from './mdl-slider.component';

const MDL_SLIDER_DIRECTIVES = [MdlSliderComponent];

@NgModule({
	imports: [FormsModule, CommonModule],
	exports: [...MDL_SLIDER_DIRECTIVES],
	declarations: MDL_SLIDER_DIRECTIVES,
})
export class MdlSliderModule
{}
