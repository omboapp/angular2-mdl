import { NgModule } from '@angular/core';
import {
	MdlCheckboxRippleDirective,
	MdlButtonRippleDirective,
	MdlRadioRippleDirective,
	MdlIconToggleRippleDirective,
	MdlSwitchRippleDirective,
	MdlMenuItemRippleDirective,
	MdlAnchorRippleDirective
} from './mdl-ripple.directive';

export * from './mdl-ripple.directive';

const MDL_COMMON_DIRECTIVES = [
	MdlCheckboxRippleDirective,
	MdlButtonRippleDirective,
	MdlRadioRippleDirective,
	MdlIconToggleRippleDirective,
	MdlSwitchRippleDirective,
	MdlMenuItemRippleDirective,
	MdlAnchorRippleDirective
];

@NgModule({
	imports: [],
	exports: [...MDL_COMMON_DIRECTIVES],
	declarations: MDL_COMMON_DIRECTIVES,
})
export class MdlRippleModule
{}
