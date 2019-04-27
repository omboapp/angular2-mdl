import {
	NgModule,
	ApplicationRef,
	ApplicationInitStatus
} from '@angular/core';
import {
	BrowserModule,
	Title
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MdlAnimationsModule, MdlRippleModule } from '../../lib/common';
import { MdlBadgeModule } from '../../lib/badge';
import { MdlButtonModule } from '../../lib/button';
import { MdlCardModule } from '../../lib/card';
import { MdlCheckboxModule } from '../../lib/checkbox';
import { MdlChipModule } from '../../lib/chips';
import { MdlDialogModule } from '../../lib/dialog';
import { MdlIconModule } from '../../lib/icon';
import { MdlIconToggleModule } from '../../lib/icon-toggle';
import { MdlLayoutModule } from '../../lib/layout';
import { MdlListModule } from '../../lib/list';
import { MdlMenuModule } from '../../lib/menu';
// import { MdlPopoverModule } from '../../lib/popover';
import { MdlProgressModule } from '../../lib/progress';
import { MdlRadioModule } from '../../lib/radio';
// import { MdlSelectModule } from '../../lib/select';
import { MdlShadowModule } from '../../lib/shadow';
import { MdlSliderModule } from '../../lib/slider';
import { MdlSnackbarModule } from '../../lib/snackbar';
import { MdlSpinnerModule } from '../../lib/spinner';
import { MdlSwitchModule } from '../../lib/switch';
import { MdlTableModule } from '../../lib/table';
import { MdlTabsModule } from '../../lib/tabs';
import { MdlTextFieldModule } from '../../lib/textfield';
import { MdlTooltipModule } from '../../lib/tooltip';

import { Angular2MdlAppComponent, Home, appRoutes } from './app.component';
import { ButtonDemo } from './button/button.component';
import { BadgeDemo } from './badge/badge.component';
import { CardDemo } from './card/card.component';
import { ChipsDemo } from './chips/chips.component';
import { IconDemo } from './icon/icon.component';
import { ShadowDemo } from './shadow/shadow.component';
import { LoadingDemo } from './loading/loading.component';
import { ListDemo } from './list/list.component';
import {
	LayoutDemo,
	Layout0Demo,
	Layout1Demo,
	Layout2Demo,
	Layout3Demo
} from './layout/layout.component';
import { MenuDemo } from './menus/menu.component';
import { ToggleDemo } from './toggle/toggle.component';
import { TooltipDemo } from './tooltip/tooltip.component';
import { SliderDemo } from './slider/slider.component';
import { SnackbarDemo } from './snackbar/snackbar.component';
import { TableDemo } from './tables/table.component';
import { TabsDemo } from './tabs/tabs.component';
import { TextFieldDemo } from './textfield/textfield.component';
import { PrismDirective } from './prism/prism.component';
import { ReactiveFormsDemo } from './reactiveforms/reactiveform.component';
import { ThemeDemo } from './theme/theme.component';
import { DialogDemo } from './dialog/dialog.component';
import { DialogDeclarativeDemo } from './dialog-declarative/dialog-declarative.component';
import { LoginModule } from './dialog/login.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,

		MdlAnimationsModule,
		MdlRippleModule,
		MdlBadgeModule,
		MdlButtonModule,
		MdlCardModule,
		MdlCheckboxModule,
		MdlChipModule,
		MdlDialogModule,
		MdlIconModule,
		MdlIconToggleModule,
		MdlLayoutModule,
		MdlListModule,
		MdlMenuModule,
		// MdlPopoverModule,
		MdlProgressModule,
		MdlRadioModule,
		// MdlSelectModule,
		MdlShadowModule,
		MdlSliderModule,
		MdlSnackbarModule,
		MdlSpinnerModule,
		MdlSwitchModule,
		MdlTableModule,
		MdlTabsModule,
		MdlTextFieldModule,
		MdlTooltipModule,

		RouterModule.forRoot(appRoutes, { enableTracing: false }),
		LoginModule,
		BrowserAnimationsModule
	],
	declarations: [
		Angular2MdlAppComponent,
		Home,
		ButtonDemo,
		BadgeDemo,
		CardDemo,
		ChipsDemo,
		DialogDemo,
		DialogDeclarativeDemo,
		IconDemo,
		ShadowDemo,
		LoadingDemo,
		ListDemo,
		LayoutDemo,
		Layout0Demo,
		Layout1Demo,
		Layout2Demo,
		Layout3Demo,
		MenuDemo,
		ToggleDemo,
		TooltipDemo,
		SliderDemo,
		SnackbarDemo,
		TableDemo,
		TabsDemo,
		TextFieldDemo,
		ThemeDemo,
		PrismDirective,
		ReactiveFormsDemo
	],
	providers: [
		Title
	],
	entryComponents: [Angular2MdlAppComponent],
	bootstrap: [],
})
export class Angular2MdlAppModule
{
	constructor(
		private appRef: ApplicationRef,
		private appStatus: ApplicationInitStatus
	) {}

	public ngDoBootstrap()
	{
		this.appStatus.donePromise.then(() => {
			let script = document.createElement('script');
			script.innerHTML = '';
			script.src = 'https://buttons.github.io/buttons.js';

			let anyScriptTag: any = document.getElementsByTagName('script')[0];
			anyScriptTag.parentNode.insertBefore(script, anyScriptTag);
		});

		this.appRef.bootstrap(Angular2MdlAppComponent);
	}
}
