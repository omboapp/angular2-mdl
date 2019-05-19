import { NgModule } from '@angular/core';
import { MdlShadowDirective } from './mdl-shadow.directive';

const MDL_SHADOW_DIRECTIVES = [MdlShadowDirective];

@NgModule({
	imports: [],
	exports: [...MDL_SHADOW_DIRECTIVES],
	declarations: MDL_SHADOW_DIRECTIVES,
})
export class MdlShadowModule
{}
