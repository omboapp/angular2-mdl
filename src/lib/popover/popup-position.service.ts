import {
	Injectable,
} from '@angular/core';

const BOTTOM_LEFT = 'bottom-left'; // Below the element, aligned to its left.
const BOTTOM_RIGHT = 'bottom-right'; // Below the element, aligned to its right.
const TOP_LEFT = 'top-left'; // Above the element, aligned to its left.
const TOP_RIGHT = 'top-right'; // Above the element, aligned to its right.

export interface IPositionCoordinates
{
	left: number;
	top: number;
}

@Injectable()
export class PopupPositionService
{
	static updatePosition(forElement: HTMLElement, popoverElement: HTMLElement, position: string): void
	{
		const coordinates = PopupPositionService.calculateCoordinates(forElement, popoverElement, position);
		PopupPositionService.applyCoordinates(coordinates, popoverElement.style);
	}

	static applyCoordinates(coordinates: IPositionCoordinates | undefined, elementStyle: CSSStyleDeclaration)
	{
		if (!coordinates) {
			return;
		}

		elementStyle.right = '';
		elementStyle.bottom = '';

		elementStyle.left = coordinates.left + 'px';
		elementStyle.top = coordinates.top + 'px';
	}

	static calculateCoordinates(
		forElement: HTMLElement,
		popoverElement: HTMLElement,
		position: string
	): IPositionCoordinates | undefined {
		if (!forElement || !position) {
			return;
		}

		switch (position) {
			case BOTTOM_RIGHT:
				return {
					top: forElement.offsetTop + forElement.offsetHeight,
					left: forElement.offsetLeft + forElement.offsetWidth - popoverElement.offsetWidth
				};
			case BOTTOM_LEFT:
				return {
					top: forElement.offsetTop + forElement.offsetHeight,
					left: forElement.offsetLeft
				};
			case TOP_LEFT:
				return {
					top: forElement.offsetTop - popoverElement.offsetHeight,
					left: forElement.offsetLeft
				};
			case TOP_RIGHT:
				return {
					top: forElement.offsetTop - popoverElement.offsetHeight,
					left: forElement.offsetLeft + forElement.offsetWidth - popoverElement.offsetWidth
				};
		}

		return;
	}
}
