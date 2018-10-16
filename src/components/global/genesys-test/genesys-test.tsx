import { Event, EventEmitter, Component, Prop } from '@stencil/core';

@Component({
  tag: 'genesys-test',
  styleUrl: 'genesys-test.less'
})

export class GenesysTest {

  /**
  * Indicate the firt
  **/
  @Prop() first: string;
  /**
  * Indicate the firt
  **/
  @Prop() middle: string;
  /**
  * Indicate the last
  **/
  @Prop() last: string;

  /**
   * Triggered 2s after the component is loaded.
   * @return the current fullname
   */
  @Event() custom: EventEmitter;
  emitEvent () {
    this.custom.emit(this.format());
  }

  componentDidLoad () {
    setTimeout(() => {
      this.emitEvent();
    }, 2000);
  }

  format(): string {
    return (
      (this.first || '') +
      (this.middle ? ` ${this.middle}` : '') +
      (this.last ? ` ${this.last}` : '')
    );
  }

  render() {
    return (<div class="stuff large-title">Hello, World! I'm {this.format()}</div>);
  }
}
