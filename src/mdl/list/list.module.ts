import { NgModule } from '@angular/core';
import {
	MdlListComponent,
	MdlListItemComponent,
	MdlListItemPrimaryContentComponent,
	MdlListItemIconDirective,
	MdlListItemAvatarDirective,
	MdlListItemSecondaryContentComponent,
	MdlListItemSecondaryActionComponent,
	MdlListItemSubTitleComponent,
	MdlListItemSecondaryInfoComponent,
	MdlListItemTextBodyComponent
} from './mdl-list.component';

const MDL_LIST_DIRECTIVES = [
	MdlListComponent,
	MdlListItemComponent,
	MdlListItemPrimaryContentComponent,
	MdlListItemIconDirective,
	MdlListItemAvatarDirective,
	MdlListItemSecondaryContentComponent,
	MdlListItemSecondaryActionComponent,
	MdlListItemSubTitleComponent,
	MdlListItemSecondaryInfoComponent,
	MdlListItemTextBodyComponent
];

@NgModule({
	imports: [],
	exports: [...MDL_LIST_DIRECTIVES],
	declarations: MDL_LIST_DIRECTIVES,
})
export class MdlListModule
{}
