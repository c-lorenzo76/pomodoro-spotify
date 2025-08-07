import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-callback',
  standalone:true,
  imports: [],
  templateUrl: './callback.component.html',

})
export class CallbackComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.processRedirect().then(r => {
      console.log(r);
    }).catch((err) => {
      console.log(err);
    });
  }

  private async processRedirect(){
    try{
      await this.authService.handleRedirect();
      this.router.navigate(['/dashboard']).then(r => {
        console.log(r);
      }).catch((err) => {
        console.log(err);
      });
    }catch(error){
      console.error('Error during login redirect:', error);
      await this.router.navigate(['/'])
    }
  }


}
