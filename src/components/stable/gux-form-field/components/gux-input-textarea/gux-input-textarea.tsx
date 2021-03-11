import { Component, Element, h, JSX, State } from '@stencil/core';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';

/**
 * @slot @slot input - Required slot for input[type="radio"]
 */
@Component({
  styleUrl: 'gux-input-textarea.less',
  tag: 'gux-input-textarea'
})
export class GuxInputTextArea {
  private input: HTMLInputElement;
  private disabledObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  @State()
  private disabled: boolean;

  async componentWillLoad(): Promise<void> {
    this.input = this.root.querySelector('textarea[slot="textarea"]');

    this.disabled = this.input.disabled;

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );
  }

  componentDidUnload(): void {
    this.disabledObserver.disconnect();
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-input-container': true,
          'gux-disabled': this.disabled
        }}
      >
        <slot name="textarea" />
      </div>
    );
  }
}
