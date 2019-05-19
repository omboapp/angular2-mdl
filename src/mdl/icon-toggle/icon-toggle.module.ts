import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlCheckboxModule } from '@angular/mdl/checkbox';
import { MdlIconModule } from '@angular/mdl/icon';
import { MdlIconToggleComponent } from './mdl-icon-toggle.component';

const MDL_ICON_TOGGLE_DIRECTIVES = [MdlIconToggleComponent];

@NgModule({
	imports: [MdlCheckboxModule, MdlIconModule, CommonModule, FormsModule],
	exports: [...MDL_ICON_TOGGLE_DIRECTIVES],
	declarations: MDL_ICON_TOGGLE_DIRECTIVES,
})
export class MdlIconToggleModule
{}
