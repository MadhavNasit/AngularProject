import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserComponent } from '../user.component';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  formModel = {
    Email: ''
  }
  constructor(public service: UserService,public router: Router, private toastr:ToastrService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.service.formModel.reset();
  }

  onSubmit(form: NgForm){
    this.spinner.show();
    this.service.forgotpassword(form.value).subscribe(
      (res: any) => {
        if(res.body.status == "success")
        {
          this.service.formModel.reset();
          this.toastr.success(res.body.message,'Check Your Email');
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
