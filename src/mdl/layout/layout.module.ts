import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdlAppendViewContainerModule, MdlRippleModule } from '@angular/mdl/common';
import { MdlIconModule } from '@angular/mdl/icon';
import { MdlTabsModule } from '@angular/mdl/tabs';
import {
	MdlLayoutComponent,
	MdlLayoutDrawerComponent,
	MdlLayoutHeaderComponent,
	MdlScreenSizeService
} from './mdl-layout.component';
import { MdlLayoutContentComponent } from './mdl-layout-content.component';
import { MdlLayoutHeaderTransparentDirective } from './mdl-layout-header-transparent.directive';
import { MdlLayoutHeaderRowComponent } from './mdl-layout-header-row.component';
import { MdlLayoutTitleComponent } from './mdl-layout-title.component';
import { MdlLayoutSpacerComponent } from './mdl-layout-spacer.component';
import { MdlLayoutTabPanelComponent } from './mdl-layout-tab-panel.component';

const MDL_LAYOUT_DIRECTIVES = [
	MdlLayoutComponent,
	MdlLayoutHeaderComponent,
	MdlLayoutDrawerComponent,
	MdlLayoutContentComponent,
	MdlLayoutHeaderTransparentDirective,
	MdlLayoutHeaderRowComponent,
	MdlLayoutTitleComponent,
	MdlLayoutSpacerComponent,
	MdlLayoutTabPanelComponent
];

@NgModule({
	imports: [
		CommonModule,
		MdlIconModule,
		MdlRippleModule,
		MdlAppendViewContainerModule,
		MdlTabsModule
	],
	exports: [...MDL_LAYOUT_DIRECTIVES],
	declarations: MDL_LAYOUT_DIRECTIVES,
	providers: [
		MdlScreenSizeService
	],
})
export class MdlLayoutModule
{}
