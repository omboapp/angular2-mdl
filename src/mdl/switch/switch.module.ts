import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlCheckboxModule } from '@angular/mdl/checkbox';
import { MdlSwitchComponent } from './mdl-switch.component';

const MDL_SWITCH_DIRECTIVES = [MdlSwitchComponent];

@NgModule({
	imports: [CommonModule, FormsModule, MdlCheckboxModule],
	exports: [...MDL_SWITCH_DIRECTIVES],
	declarations: MDL_SWITCH_DIRECTIVES,
})
export class MdlSwitchModule
{}
