import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Prop,
  Watch
} from '@stencil/core';

import { GuxButtonAccent } from '../../stable/gux-button/gux-button.types';
import { trackComponent } from '../../../usage-tracking';
import { OnClickOutside } from '../../../utils/decorator/on-click-outside';

@Component({
  styleUrl: 'gux-button-multi.less',
  tag: 'gux-button-multi',
  shadow: true
})
export class GuxButtonMulti {
  @Element()
  private root: HTMLElement;
  listboxElement: HTMLGuxListboxElement;
  dropdownButton: HTMLElement;
  private moveFocusDelay: number = 100;

  /**
   * Triggered when the menu is open
   */
  @Event()
  open: EventEmitter;

  /**
   * Triggered when the menu is close
   */
  @Event()
  close: EventEmitter;

  /**
   * The component text.
   */
  @Prop()
  text: string;

  /**
   * Disables the action button.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * The component accent (secondary or primary).
   */
  @Prop()
  accent: GuxButtonAccent = 'secondary';

  /**
   * It is used to open or not the list.
   */
  @Prop({ mutable: true })
  expanded: boolean = false;

  @Listen('keydown')
  handleKeydown(event: KeyboardEvent): void {
    const composedPath = event.composedPath();

    switch (event.key) {
      case 'Escape':
        this.expanded = false;

        if (composedPath.includes(this.listboxElement)) {
          this.dropdownButton.focus();
        }

        break;
      case 'Enter':
        if (this.listboxElement) {
          setTimeout(() => {
            this.listboxElement.focus();
          }, this.moveFocusDelay);
        }
        break;
      case 'ArrowDown':
        if (document.activeElement !== this.listboxElement) {
          event.preventDefault();
          this.expanded = true;
          if (this.listboxElement) {
            setTimeout(() => {
              this.listboxElement.focus();
            }, this.moveFocusDelay);
          }
        }
        break;
    }
  }

  @Listen('keyup')
  handleKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ':
        if (this.listboxElement) {
          setTimeout(() => {
            this.listboxElement.focus();
          }, this.moveFocusDelay);
        }
        break;
    }
  }

  @Watch('disabled')
  watchDisabled(disabled: boolean): void {
    if (disabled) {
      this.expanded = false;
    }
  }

  @Watch('expanded')
  watchValue(expanded: boolean): void {
    if (expanded) {
      this.open.emit();
    } else {
      this.close.emit();
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside(): void {
    this.expanded = false;
  }

  private toggle(): void {
    if (!this.disabled) {
      this.expanded = !this.expanded;
    }
  }

  private onListboxElementFocusout(): void {
    this.expanded = false;
  }

  componentWillLoad(): void {
    trackComponent(this.root, { variant: this.accent });
    this.listboxElement = this.root.querySelector('gux-listbox');
  }

  componentDidLoad(): void {
    if (!this.listboxElement?.getAttribute('aria-label')) {
      this.listboxElement?.setAttribute('aria-label', this.text);
    }
    this.listboxElement?.addEventListener(
      'focusout',
      this.onListboxElementFocusout.bind(this)
    );
  }

  render(): JSX.Element {
    return (
      <gux-popup-beta expanded={this.expanded} disabled={this.disabled}>
        <div slot="target" class="gux-button-multi-container">
          <gux-button-slot-beta
            class="gux-dropdown-button"
            accent={this.accent}
          >
            <button
              type="button"
              disabled={this.disabled}
              ref={el => (this.dropdownButton = el)}
              onClick={() => this.toggle()}
              aria-haspopup="listbox"
              aria-expanded={this.expanded.toString()}
            >
              <span>{this.text}</span>
              <gux-icon decorative icon-name="chevron-small-down"></gux-icon>
            </button>
          </gux-button-slot-beta>
        </div>
        <div slot="popup">
          <slot />
        </div>
      </gux-popup-beta>
    ) as JSX.Element;
  }
}
