import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import {HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(public service: UserService, private toastr:ToastrService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.service.formModel.reset();
  }

  onSubmit()
  {
    this.spinner.show();
    this.service.register().subscribe(
      (res: any) => {
        console.log(res);
        if(res.body.status == "success")
        {
          this.service.formModel.reset();
          this.toastr.success(res.body.message,'Registered!');
          this.router.navigateByUrl('user/login');
        }
        else{
          this.toastr.error(res.body.message,'Error!');
        }
        this.spinner.hide();   
      },
      err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong.', 'Sorry!');
          console.log(err);
      }
    )
  }

}
