import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlIconModule } from '@angular/mdl/icon';
import { MdlChipContactDirective, MdlChipComponent } from './chips';

const DIRECTIVES = [MdlChipComponent, MdlChipContactDirective];

@NgModule({
	imports: [MdlIconModule, CommonModule],
	exports: [...DIRECTIVES],
	declarations: DIRECTIVES,
})
export class MdlChipModule
{}
