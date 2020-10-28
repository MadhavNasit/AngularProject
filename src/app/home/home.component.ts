import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName;
  constructor(private router:Router, private service:UserService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
  }

  onLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('userName');
    this.router.navigate(['/user/login'])
  }
}
