import { Component, Element, h, JSX, Prop } from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { trackComponent } from '../../../usage-tracking';

import breadcrumbsResources from './i18n/en.json';
import { GuxBreadcrumbAccent } from './gux-breadcrumbs.types';

@Component({
  styleUrl: 'gux-breadcrumbs.less',
  tag: 'gux-breadcrumbs-beta'
})
export class GuxBreadcrumbs {
  private i18n: GetI18nValue;

  @Element()
  private root: HTMLElement;

  @Prop()
  accent: GuxBreadcrumbAccent = 'primary';

  async componentWillRender(): Promise<void> {
    trackComponent(this.root, { variant: this.accent });

    this.i18n = await buildI18nForComponent(this.root, breadcrumbsResources);
  }

  render(): JSX.Element {
    return (
      <nav
        aria-label={this.i18n('breadcrumbs')}
        class="gux-breadcrumbs-container"
      >
        <slot />
      </nav>
    );
  }
}