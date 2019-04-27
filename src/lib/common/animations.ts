import { NgModule } from '@angular/core';

function isWebAnimationsSupported()
{
	return typeof Element !== 'undefined' && typeof (<any>Element).prototype['animate'] === 'function';
}

export function instantiateSupportedAnimationDriver()
{
	/* istanbul ignore next */
	if (isWebAnimationsSupported()) {
		return new NativeWebAnimations();
	}

	/* istanbul ignore next */
	return new NoopWebAnimations();
}

export interface AnimationPlayer
{
	onDone(fn: () => void): void;
	play(): void;
}

export class NativeWebAnimationPlayer implements AnimationPlayer
{
	private onDoneCallback: (() => void)[] = [];

	constructor(
		private element: any,
		private keyframes: { [key: string]: string | number }[],
		private duration: number,
		private easing: string
	) {}

	public onDone(fn: () => void)
	{
		this.onDoneCallback.push(fn);
	}

	public play()
	{
		let animation = this.element['animate'](
			this.keyframes,
			{
				duration: this.duration,
				easing: this.easing,
				fill: 'forwards'
			});

		animation.addEventListener('finish', () => this.onDoneCallback.forEach(fn => fn()));
	}
}

export class NoopAnimationPlayer implements AnimationPlayer
{
	private onDoneCallback: (() => void)[] = [];

	constructor(
		// @ts-ignore
		element: any,
		// @ts-ignore
		keyframes: { [key: string]: string | number }[],
		// @ts-ignore
		duration: number,
		// @ts-ignore
		easing: string
	) {}

	public onDone(fn: () => void)
	{
		this.onDoneCallback.push(fn);
	}

	public play()
	{
		this.onDoneCallback.forEach(fn => fn());
	}
}

export abstract class Animations
{
	abstract animate(
		element: any,
		keyframes: { [key: string]: string | number }[],
		duration: number,
		easing: string
	): AnimationPlayer;
}

export class NativeWebAnimations implements Animations
{
	public animate(
		element: any,
		keyframes: { [key: string]: string | number }[],
		duration: number,
		easing: string
	): AnimationPlayer {
		return new NativeWebAnimationPlayer(element, keyframes, duration, easing);
	}
}

export class NoopWebAnimations implements Animations
{
	public animate(
		element: any,
		keyframes: { [key: string]: string | number }[],
		duration: number,
		easing: string
	): AnimationPlayer {
		return new NoopAnimationPlayer(element, keyframes, duration, easing);
	}
}

@NgModule({
	providers: [
		{ provide: Animations, useFactory: instantiateSupportedAnimationDriver }
	]
})
export class MdlAnimationsModule
{}
