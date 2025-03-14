import { RWSViewComponent, RWSView } from '@rws-framework/client';
import {  observable  } from '@microsoft/fast-element';


interface ILink {
  label: string;
  url: string;
}

@RWSView('site-menu', { ignorePackaging: true })
class SiteMenu extends RWSViewComponent {

  @observable links: ILink[] = [  
      { label: 'Reservation upload', url: '/' },
      { label: 'Reservation list', url: '/reservations' },
      { label: 'Users', url: '/users' },
  ];

  handleClick(event: Event, link: ILink): void {
      if(event){
          event.preventDefault();
      }      
      
    
      this.$emit('routing.url.changed', {
          item: link.url
      });
  }

  logout(){
    this.$emit('logout');
  }
}

SiteMenu.defineComponent();

export { SiteMenu, ILink };