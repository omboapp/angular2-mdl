import { NgModule } from '@angular/core';
import { MdlRippleModule } from '@angular/mdl/common';
import { MdlCheckboxModule } from '@angular/mdl/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
	MdlTableComponent,
	MdlSelectableTableComponent
} from './mdl-table.component';

const MDL_TABLE_DIRECTIVES = [
	MdlTableComponent,
	MdlSelectableTableComponent
];

@NgModule({
	imports: [MdlCheckboxModule, MdlRippleModule, CommonModule, FormsModule],
	exports: MDL_TABLE_DIRECTIVES,
	declarations: MDL_TABLE_DIRECTIVES,
})
export class MdlTableModule
{}
