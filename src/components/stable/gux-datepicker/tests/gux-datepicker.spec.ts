import { newSpecPage } from '@stencil/core/testing';

import { GuxDatepicker } from '../gux-datepicker';
import { CalendarModes } from '../../../../common-enums';

const components = [GuxDatepicker];
const language = 'en';

describe('gux-datepicker', () => {
  describe('#render', () => {
    [
      `<gux-datepicker value="1997-08-15"></gux-datepicker>`,
      `<gux-datepicker value="1997-08-15" format="mm/dd/yy"></gux-datepicker>`,
      `<gux-datepicker value="1997-08-15" format="mm.dd.yyyy"></gux-datepicker>`,
      `<gux-datepicker value="1997-08-15" disabled></gux-datepicker>`,
      `<gux-datepicker mode="range" value="2019-11-25/2019-12-02" number-of-months="2" ></gux-datepicker>`,
      `<gux-datepicker mode="range" value="2019-11-25/2019-12-02" min-date="2019-11-10" max-date="2019-12-31" number-of-months="2" ></gux-datepicker>`,
      `<gux-datepicker mode="range" value="2019-11-25/2019-12-02" min-date="2019-11-10" max-date="2019-12-31" number-of-months="2" format="mm.dd.yyyy" ></gux-datepicker>`,
      `<gux-datepicker mode="range" value="2019-11-25/2019-12-02" number-of-months="2" disabled></gux-datepicker>`
    ].forEach((input, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSpecPage({
          components,
          html: input,
          language
        });

        expect(page.root).toMatchSnapshot();
      });
    });
  });

  it('should build', async () => {
    const page = await newSpecPage({
      components,
      html: `<gux-datepicker></gux-datepicker>`,
      language
    });
    expect(page.rootInstance).toBeInstanceOf(GuxDatepicker);
  });

  describe('with default input properties', () => {
    let component: GuxDatepicker;

    beforeEach(async () => {
      const page = await newSpecPage({
        components: components,
        html: `<gux-datepicker></gux-datepicker>`,
        language: 'en'
      });
      component = page.rootInstance;
      component.calendarElement = new HTMLElement() as HTMLGuxCalendarElement;
      component.calendarElement.setValue = async () => {
        return;
      };
      component.calendarElement.focusPreviewDate = async () => {
        return;
      };
    });

    it('should set to defaults', async () => {
      expect(component.disabled).toBe(false);
      expect(component.format).toBe('mm/dd/yyyy');
      expect(component.label).toBe('');
      expect(component.minDate).toBe('');
      expect(component.maxDate).toBe('');
      expect(component.mode).toBe(CalendarModes.Single);
      expect(component.numberOfMonths).toBe(1);
    });
    it('should set the formatted value', async () => {
      component.value = '1998-04-24';

      expect(component.formatedValue).toBe('04/24/1998');
    });
    it('should emit when the input value changes', async () => {
      spyOn(component.input, 'emit').and.callFake(() => {
        return;
      });
      component.inputElement.value = '04/24/1998';
      component.setValue();

      expect(component.input.emit).toHaveBeenCalledWith('1998-04-24');
    });

    it('should focus the calendar when the calendar is in the DOM', async () => {
      spyOn(component.calendarElement, 'focusPreviewDate').and.callFake(() => {
        return;
      });

      const componentRoot = component.root as any;
      componentRoot.shadowRoot = {
        querySelector: () => {
          return {
            classList: {
              contains: () => true
            }
          };
        }
      } as any;
      component.toggleCalendar();
      expect(component['focusPreviewDateAfterCalendarActive']).toBe(false);
      expect(component.calendarElement.focusPreviewDate).toHaveBeenCalled();
    });
    it('should set calendar focus on next render when the calendar is in not the DOM', async () => {
      const componentRoot = component.root as any;
      componentRoot.shadowRoot = {
        querySelector: () => {
          return {
            classList: {
              contains: () => false
            }
          };
        }
      } as any;
      component.toggleCalendar();
      expect(component['focusPreviewDateAfterCalendarActive']).toBe(true);
    });
  });

  describe('with custom input properties', () => {
    let component: GuxDatepicker;

    beforeEach(async () => {
      const page = await newSpecPage({
        components: components,
        html: `<gux-datepicker disabled format="yyyy/mm/dd" label="myLabel" min-date="2022-05-03" max-date="2022-07-10" mode="range" number-of-months="3"></gux-datepicker>`,
        language: 'en'
      });
      component = page.rootInstance;
    });
    it('should set to passed in values', async () => {
      expect(component.disabled).toBe(true);
      expect(component.format).toBe('yyyy/mm/dd');
      expect(component.label).toBe('myLabel');
      expect(component.minDate).toBe('2022-05-03');
      expect(component.maxDate).toBe('2022-07-10');
      expect(component.mode).toBe(CalendarModes.Range);
      expect(component.numberOfMonths).toBe(3);
    });
  });
});
