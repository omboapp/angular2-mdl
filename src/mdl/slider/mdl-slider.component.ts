import {
	Component,
	Input,
	forwardRef,
	ViewChild,
	Renderer2,
	ElementRef,
	ViewEncapsulation,
} from '@angular/core';
import {
	NG_VALUE_ACCESSOR,
	ControlValueAccessor,
} from '@angular/forms';
import { callNative, noop, toBoolean } from '@angular/mdl/common';

@Component({
	moduleId: module.id,
	selector: 'mdl-slider',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => MdlSliderComponent),
		multi: true
	}],
	host: {
		'[class.mdl-slider__container]': 'true',
		'(mouseup)': 'onMouseUp($event)',
		'(mousedown)': 'onMouseDown($event)'
	},
	template: `
		<input class="mdl-slider is-upgraded"
			type="range"
			[min]="min"
			[max]="max"
			[step]="step"
			[(ngModel)]="value"
			[disabled]="disabled"
			tabindex="0"
			#input>
		<div class="mdl-slider__background-flex">
			<div class="mdl-slider__background-lower" #lower></div>
			<div class="mdl-slider__background-upper" #uppper></div>
		</div>
	`,
	styles: [`
		:host {
			height: 22px;
			user-select: none;
			-webkit-user-select: none;
			-moz-user-select: none;
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class MdlSliderComponent implements ControlValueAccessor
{
	private value_: any;

	@Input() public min: number;
	@Input() public max: number;
	@Input() public step: number;
	@ViewChild('lower', { static: false }) public lowerEl: ElementRef;
	@ViewChild('uppper', { static: false }) public upperEl: ElementRef;
	@ViewChild('input', { static: false }) public inputEl: ElementRef;

	private _disabled: boolean = false;
	@Input() get disabled(): boolean { return this._disabled; }
	set disabled(value) { this._disabled = toBoolean(value); }

	get value(): any { return this.value_; };

	@Input()
	set value(v: any)
	{
		this.value_ = v;
		this.updateSliderUI();
		this.onChangeCallback(v);
	}

	// TODO: Confirm safe ts-ignore
	// @ts-ignore
	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;

	constructor(
		private renderer: Renderer2,
		private elRef: ElementRef
	) {}

	public writeValue(value: number): void
	{
		this.value_ = value;
		this.updateSliderUI();
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

	private updateSliderUI()
	{
		var fraction = (this.value_ - this.min) / (this.max - this.min);

		if (fraction === 0) {
			this.renderer.addClass(this.inputEl.nativeElement, 'is-lowest-value');
		} else {
			this.renderer.removeClass(this.inputEl.nativeElement, 'is-lowest-value');
		}

		this.renderer.setStyle(this.lowerEl.nativeElement, 'flex', '' + fraction);
		this.renderer.setStyle(this.upperEl.nativeElement, 'flex', '' + (1 - fraction));
	}

	public onMouseUp(event: any)
	{
		event.target.blur();
	}

	public onMouseDown(event: MouseEvent)
	{
		if (event.target !== this.elRef.nativeElement) {
			return;
		}

		// Discard the original event and create a new event that
		// is on the slider element.
		event.preventDefault();
		var newEvent: any = new MouseEvent('mousedown', {
			relatedTarget: event.relatedTarget,
			button: event.button,
			buttons: event.buttons,
			clientX: event.clientX,
			clientY: this.inputEl.nativeElement.getBoundingClientRect().y,
			screenX: event.screenX,
			screenY: event.screenY
		});
		callNative(this.inputEl.nativeElement, 'dispatchEvent', newEvent);
	}
}
