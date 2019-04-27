import {
	Component,
	Input,
	EventEmitter,
	Output,
	ContentChild,
	ViewEncapsulation,
	Directive,
	Optional,
	forwardRef,
	Inject,
	OnInit
} from '@angular/core';
import { MdlStructureError } from '@angular/mdl/common';

@Directive({
	selector: '[mdl-chip-contact]',
	host: {
		'[class.mdl-chip__contact]': 'true'
	}
})
export class MdlChipContactDirective implements OnInit
{
	constructor(
		@Optional() @Inject(forwardRef(() => MdlChipComponent)) private mdlChipComponent: MdlChipComponent
	) {}

	public ngOnInit()
	{
		if (!this.mdlChipComponent) {
			throw new MdlStructureError('mdl-chip-contact', 'mdl-chip');
		}
	}
}

@Component({
	moduleId: module.id,
	selector: 'mdl-chip',
	host: {
		'[class.mdl-chip]': 'true',
		'[class.mdl-chip--contact]': 'chipContact'
	},
	template: `
		<ng-content></ng-content>
		<span *ngIf="mdlLabel" class="mdl-chip__text">{{mdlLabel}}</span>
		<button *ngIf="mdlActionIcon" (click)="action()" type="button" class="mdl-chip__action">
			<mdl-icon>{{mdlActionIcon}}</mdl-icon>
		</button>
	`,
	encapsulation: ViewEncapsulation.None
})
export class MdlChipComponent
{
	@Input('mdl-label') public mdlLabel: any;
	@Input('mdl-action-icon') public mdlActionIcon: any;
	@Output('action-click') public actionClick = new EventEmitter();
	@ContentChild(MdlChipContactDirective) public chipContact: MdlChipContactDirective;

	public action()
	{
		this.actionClick.emit();
	}
}
