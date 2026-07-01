import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'E-commerce',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Clients',
    icon: 'people-outline',
    link: '/pages/clients', 
  },
  {
    title: 'Smart Table',
    icon: 'grid-outline',
    link: '/pages/tables/smart-table',
  },
];
