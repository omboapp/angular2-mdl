import { NgModule } from '@angular/core';
import {
	MdlCardComponent,
	MdlCardTitleComponent,
	MdlCardMediaComponent,
	MdlCardSupportingTextComponent,
	MdlCardActionsComponent,
	MdlCardMenuComponent,
	MdlCardTitleTextDirective,
	MdlCardBorderDirective,
	MdlCardExpandDirective
} from './mdl-card.component';

const MDL_CARD_DIRECTIVES = [
	MdlCardComponent,
	MdlCardTitleComponent,
	MdlCardMediaComponent,
	MdlCardSupportingTextComponent,
	MdlCardActionsComponent,
	MdlCardMenuComponent,
	MdlCardTitleTextDirective,
	MdlCardBorderDirective,
	MdlCardExpandDirective
];

@NgModule({
	imports: [],
	exports: [...MDL_CARD_DIRECTIVES],
	declarations: MDL_CARD_DIRECTIVES,
})
export class MdlCardModule
{}
