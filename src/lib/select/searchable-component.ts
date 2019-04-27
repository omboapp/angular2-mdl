import { keyboardEventKey } from './keyboard';

export class SearchableComponent
{
	public searchQuery: string = '';
	private clearTimeout: any = null;

	// short search query will be cleared after 300 ms
	protected updateShortSearchQuery($event: KeyboardEvent)
	{
		if (this.clearTimeout) {
			clearTimeout(this.clearTimeout);
		}

		this.clearTimeout = setTimeout(() => {
			this.searchQuery = '';
		}, 300);

		this.searchQuery += keyboardEventKey($event).toLowerCase();
	}
}
