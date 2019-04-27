import {
	Component,
	forwardRef,
	Input,
	Renderer2,
	ElementRef,
	OnChanges,
	DoCheck,
	ViewChild,
	Optional,
	Inject,
	EventEmitter,
	Output,
	ViewEncapsulation,
	InjectionToken
} from '@angular/core';
import {
	NG_VALUE_ACCESSOR,
	ControlValueAccessor
} from '@angular/forms';
import { callNative, noop, toBoolean, toNumber } from '@angular/mdl/common';

export const DISABLE_NATIVE_VALIDITY_CHECKING = new InjectionToken<boolean>('disableNativeValidityChecking');

let nextId = 0;

const IS_FOCUSED = 'is-focused';
const IS_DISABLED = 'is-disabled';
const IS_INVALID = 'is-invalid';
const IS_DIRTY = 'is-dirty';

@Component({
	moduleId: module.id,
	selector: 'mdl-textfield',
	host: {
		'[class.mdl-textfield]': 'true',
		'[class.is-upgraded]': 'true',
		'[class.mdl-textfield--expandable]': 'icon',
		'[class.mdl-textfield--floating-label]': 'isFloatingLabel',
		'[class.has-placeholder]': 'placeholder'
	},
	template: `
		<div *ngIf="!icon">
			 <textarea
				 *ngIf="rows"
				 #input
				 [rows]="rows"
				 class="mdl-textfield__input"
				 type="text"
				 [attr.name]="name"
				 [id]="id"
				 [placeholder]="placeholder ? placeholder : ''"
				 (focus)="onFocus($event)"
				 (blur)="onBlur($event)"
				 (keydown)="keydownTextarea($event)"
				 (keyup)="onKeyup($event)"
				 [(ngModel)]="value"
				 [disabled]="disabled"
				 [required]="required"
				 [autofocus]="autofocus"
				 [readonly]="readonly"
				 [maxlength]="maxlength"
			 ></textarea>
			<input
				*ngIf="!rows"
				#input
				class="mdl-textfield__input"
				[type]="type"
				[attr.name]="name"
				[id]="id"
				[pattern]="pattern ? pattern : '.*'"
				[attr.min]="min"
				[attr.max]="max"
				[attr.step]="step"
				[placeholder]="placeholder ? placeholder : ''"
				[autocomplete]="autocomplete ? autocomplete : ''"
				(focus)="onFocus($event)"
				(blur)="onBlur($event)"
				(keyup)="onKeyup($event)"
				[(ngModel)]="value"
				[disabled]="disabled"
				[required]="required"
				[autofocus]="autofocus"
				[readonly]="readonly"
				[attr.tabindex]="tabindex"
				[maxlength]="maxlength"
			>
			<label class="mdl-textfield__label" [attr.for]="id">{{label}}</label>
			<span class="mdl-textfield__error">{{errorMessage}}</span>
		</div>
		<div *ngIf="icon">
			<button mdl-button mdl-button-type="icon" (click)="setFocus()">
				<mdl-icon>{{icon}}</mdl-icon>
			</button>
			<div class="mdl-textfield__expandable-holder">
				<input
					#input
					class="mdl-textfield__input"
					[type]="type"
					[attr.name]="name"
					[id]="id"
					[pattern]="pattern ? pattern : '.*'"
					[attr.min]="min"
					[attr.max]="max"
					[attr.step]="step"
					[placeholder]="placeholder ? placeholder : ''"
					[autocomplete]="autocomplete ? autocomplete : ''"
					(focus)="onFocus($event)"
					(blur)="onBlur($event)"
					(keyup)="onKeyup($event)"
					[(ngModel)]="value"
					[disabled]="disabled"
					[required]="required"
					[autofocus]="autofocus"
					[readonly]="readonly"
					[attr.tabindex]="tabindex"
					[maxlength]="maxlength"
				>
				<label class="mdl-textfield__label" [attr.for]="id">{{label}}</label>
				<span class="mdl-textfield__error">{{errorMessage}}</span>
			</div>
		</div>
	`,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => MdlTextFieldComponent),
		multi: true
	}],
	encapsulation: ViewEncapsulation.None
})
export class MdlTextFieldComponent implements ControlValueAccessor, OnChanges, DoCheck
{
	private value_: any;
	private el: HTMLElement;

	@Output('blur')
	public blurEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

	@Output('focus')
	public focusEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

	@Output('keyup')
	public keyupEmitter: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

	@ViewChild('input') public inputEl: ElementRef;

	get value(): any { return this.value_; }
	@Input() set value(v: any) {
		this.value_ = this.type === 'number' ? (v === '' ? null : parseFloat(v)) : v;
		this.onChangeCallback(this.value);
	}

	@Input() public type = 'text';
	@Input() public label: any;
	@Input() public pattern: any;
	@Input() public min: any;
	@Input() public max: any;
	@Input() public step: any;
	@Input() public name: any;
	@Input() public id = `mdl-textfield-${nextId++}`;
	@Input('error-msg') public errorMessage: any;

	private _disabled: boolean = false;
	@Input() get disabled(): boolean { return this._disabled; }
	set disabled(value) { this._disabled = toBoolean(value); }

	private _readonly: boolean = false;
	@Input() get readonly() { return this._readonly; }
	set readonly(value) { this._readonly = toBoolean(value); }

	private _required: boolean = false;
	@Input() get required() { return this._required; }
	set required(value) { this._required = toBoolean(value); }

	private _autofocus: boolean = false;
	@Input() get autofocus() { return this._autofocus; }
	set autofocus(value) { this._autofocus = toBoolean(value); }

	private _isFloatingLabel: boolean = false;
	@Input('floating-label') get isFloatingLabel() { return this._isFloatingLabel; }
	set isFloatingLabel(value) { this._isFloatingLabel = toBoolean(value); }

	@Input() public placeholder: string;
	@Input() public autocomplete: string;

	private _rows: null | number = null;
	@Input() get rows() { return this._rows; }
	set rows(value) { this._rows = toNumber(value); }

	private _maxrows: null | number = -1;
	@Input() get maxrows() { return this._maxrows; }
	set maxrows(value) { this._maxrows = toNumber(value); }

	@Input() public icon: string;
	@Input() public tabindex: null | number = null;
	@Input() public maxlength: null | number = null;

	// @experimental
	private _disableNativeValidityChecking: boolean = false;
	@Input() get disableNativeValidityChecking() { return this._disableNativeValidityChecking; }
	set disableNativeValidityChecking(value) { this._disableNativeValidityChecking = toBoolean(value); }

	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;

	constructor(
		private renderer: Renderer2,
		// TODO: Confirm safe removal of `MdlTextFieldComponent.elmRef`
		elmRef: ElementRef,
		@Optional() @Inject(DISABLE_NATIVE_VALIDITY_CHECKING) private nativeCheckGlobalDisabled: Boolean
	) {
		this.el = elmRef.nativeElement;
	}

	public writeValue(value: any): void
	{
		this.value_ = value;
		this.checkDirty();
	}

	public registerOnChange(fn: any): void
	{
		this.onChangeCallback = fn;
	}

	public registerOnTouched(fn: any): void
	{
		this.onTouchedCallback = fn;
	}

	public setDisabledState(isDisabled: boolean): void
	{
		this.disabled = isDisabled;
	}

	public ngOnChanges()
	{
		this.checkDisabled();
	}

	public ngDoCheck()
	{
		this.checkValidity();
		this.checkDirty();
	}

	public setFocus()
	{
		if (!this.inputEl) {
			return;
		}

		callNative(this.inputEl.nativeElement, 'focus');
	}

	public onFocus(event: FocusEvent)
	{
		this.renderer.addClass(this.el, IS_FOCUSED);
		this.focusEmitter.emit(event);
	}

	public onBlur(event: FocusEvent)
	{
		this.renderer.removeClass(this.el, IS_FOCUSED);
		this.onTouchedCallback();
		this.blurEmitter.emit(event);
	}

	public onKeyup(event: KeyboardEvent)
	{
		this.keyupEmitter.emit(event);
	}

	private checkDisabled()
	{
		if (this.disabled) {
			this.renderer.addClass(this.el, IS_DISABLED);
		} else {
			this.renderer.removeClass(this.el, IS_DISABLED);
		}
	}

	private checkValidity()
	{
		// check the global setting - if globally disabled do no check
		if (this.nativeCheckGlobalDisabled === true) {
			return;
		}
		// check local setting - if locally disabled do no check
		if (this.disableNativeValidityChecking) {
			return;
		}
		if (this.inputEl && this.inputEl.nativeElement.validity) {
			if (!this.inputEl.nativeElement.validity.valid) {
				this.renderer.addClass(this.el, IS_INVALID);
			} else {
				this.renderer.removeClass(this.el, IS_INVALID);
			}
		}
	}

	private checkDirty()
	{
		let dirty = this.inputEl && this.inputEl.nativeElement.value && this.inputEl.nativeElement.value.length > 0;

		if (dirty) {
			this.renderer.addClass(this.el, IS_DIRTY);
		} else {
			this.renderer.removeClass(this.el, IS_DIRTY);
		}
	}

	public keydownTextarea($event: KeyboardEvent)
	{
		var currentRowCount = this.inputEl.nativeElement.value.split('\n').length;

		if ($event.keyCode === 13) {
			// TODO: Confirm safe ts-ignore
			// @ts-ignore
			if (currentRowCount >= this.maxrows && this.maxrows !== -1) {
				$event.preventDefault();
			}
		}
	}

	// hm only for test purposes to simulate a change to the input field that will change the
	// model value.
	triggerChange(event: Event)
	{
		this.value = (event.target as HTMLInputElement).value;
		this.onTouchedCallback();
	}
}
