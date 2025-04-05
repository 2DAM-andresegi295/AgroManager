import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})
export class LoginPage implements OnInit {
email: any;
password: any;
login() {
throw new Error('Method not implemented.');
}

  constructor() { }

  ngOnInit() {
  }

}
