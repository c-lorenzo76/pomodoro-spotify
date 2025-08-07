import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    Accordion,
    AccordionHeader,
    AccordionPanel,
    AccordionContent
  ],
  templateUrl: './landing-page.component.html',

})
export class LandingPageComponent {
  constructor(private authService: AuthService, router: Router){}

  login(){
    this.authService.login().then(r => {
      console.log(r);
    });
  }

}
