import * as hbs from 'hbs';

export function registerHbsHelpers() {
  hbs.registerHelper('gt', (a: number, b: number) => a > b);
  hbs.registerHelper('lt', (a: number, b: number) => a < b);
  hbs.registerHelper('eq', (a: any, b: any) => a === b);
  hbs.registerHelper('add', (a: number, b: number) => a + b);
  hbs.registerHelper('subtract', (a: number, b: number) => a - b);
}
