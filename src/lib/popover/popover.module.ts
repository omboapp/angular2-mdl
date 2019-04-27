import { NgModule } from '@angular/core';
import { MdlButtonModule } from '@angular/mdl/button';
import { MdlPopoverRegistry } from './popover-registry.service';
import { PopupPositionService } from './popup-position.service';
import { MdlPopoverComponent } from './popover.component';

@NgModule({
	imports: [MdlButtonModule],
	exports: [MdlPopoverComponent],
	declarations: [MdlPopoverComponent],
	providers: [MdlPopoverRegistry, PopupPositionService],
})
export class MdlPopoverModule
{}
