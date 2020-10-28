import { Component, OnInit } from '@angular/core';
import { NgForOfContext } from '@angular/common';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formModel = {
    UserName: '',
    Password: ''
  }

  constructor(private service:UserService,private router:Router,private toastr:ToastrService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.spinner.show();
    this.service.login(form.value).subscribe(
      (res: any) => {
        if(res.status == "success")
        {
          localStorage.setItem('token', res.user.token);
          localStorage.setItem('id', res.user.id);
          localStorage.setItem('userName', res.user.username);
          this.router.navigateByUrl('/home/projects');
          this.toastr.success(res.message,'Success!');
        }
        else{
          this.toastr.error(res.message,'Error!');
        }
        this.spinner.hide();
      },
      err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong.', 'Sorry!');
          console.log(err);
      }
    );
  }
}
