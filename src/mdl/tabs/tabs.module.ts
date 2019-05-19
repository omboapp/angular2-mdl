import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlAppendViewContainerModule, MdlRippleModule } from '@angular/mdl/common';
import { MdlTabsComponent } from './mdl-tabs.component';
import { MdlTabPanelComponent, MdlTabPanelContent } from './mdl-tab-panel.component';
import { MdlTabPanelTitleComponent } from './mdl-tab-panel-title.component';

const MDL_TABS_DIRECTIVES = [
	MdlTabsComponent,
	MdlTabPanelComponent,
	MdlTabPanelTitleComponent,
	MdlTabPanelContent
];

@NgModule({
	imports: [MdlRippleModule, MdlAppendViewContainerModule, CommonModule],
	exports: [...MDL_TABS_DIRECTIVES],
	declarations: [...MDL_TABS_DIRECTIVES],
})
export class MdlTabsModule
{}
