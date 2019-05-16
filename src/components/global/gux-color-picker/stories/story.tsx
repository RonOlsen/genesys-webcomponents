import { action } from '@storybook/addon-actions';
import { array, boolean, select, text } from '@storybook/addon-knobs/polymer';
import { storiesOf } from '@storybook/polymer';
import { withReadme } from 'storybook-readme';

import README from '../readme.md';

storiesOf('Basic Components', module).add(
  'Color Picker',
  withReadme(README, () => {
    const el = document.createElement('gux-color-picker');
    el.value = text('value', '#203B73');
    el.customColors = array('customColors', []);
    el.disabled = boolean('disabled', false);
    el.addEventListener('input', e => action('input')(e.detail));
    document.getElementsByTagName('html')[0].className =
      'gux-' + select('theme', ['dark', 'default'], 'default') + '-theme';
    return el;
  })
);