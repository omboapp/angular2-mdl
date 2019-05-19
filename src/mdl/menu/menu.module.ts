import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlButtonModule } from '@angular/mdl/button';
import { MdlMenuComponent, MdlMenuItemComponent, MdlMenuRegisty } from './mdl-menu.component';
import { MdlMenuItemFullBleedDeviderComponent } from './mdl-menu-item.directive';
import { MdlToggleMenuDirective } from './mdl-toggle-menu.directive';

const MDL_MENU_DIRECTIVES = [
	MdlMenuComponent,
	MdlMenuItemComponent,
	MdlMenuItemFullBleedDeviderComponent,
	MdlToggleMenuDirective
];

@NgModule({
	imports: [CommonModule, MdlButtonModule],
	exports: [...MDL_MENU_DIRECTIVES],
	declarations: MDL_MENU_DIRECTIVES,
	providers: [MdlMenuRegisty]
})
export class MdlMenuModule
{}
