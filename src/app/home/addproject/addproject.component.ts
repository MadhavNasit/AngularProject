import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/shared/home.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { project } from 'src/app/models/project';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css']
})
export class AddprojectComponent implements OnInit {

  project: project;
  id:0;
  constructor(public service: HomeService, private fb: FormBuilder, private router:Router, private toastr:ToastrService, private route:ActivatedRoute,private spinner: NgxSpinnerService) {
    this.id = this.route.snapshot.params['id'];

   }

  ngOnInit() {
    this.resetForm();
    if(this.id != 0)
    {
      this.populateForm(); 
    }
  }

  resetForm(form?: NgForm)
  {
    if(form != null)
      this.resetForm();
    this.service.formModel = {
        id: 0,
        projectName: '',
        duration: null,
        cost: null,
        projectDate: null,
        description: '',
    };
  }

  populateForm()
  {
    this.spinner.show();
    this.service.getProject(this.id).subscribe(
      (res: any)=>{
        if(res.status == "success")
        {
          this.service.formModel = res.project;
        }
        else{
          this.toastr.error(res.message,'Error!');
        }
        this.spinner.hide();
        
      },
      err =>{
        console.log(err.error.ex.message);
          this.toastr.error(err.error.ex.message);
      }
    )
  }

  onSubmit(form: NgForm) {
    console.log("A");
    console.log(this.service.formModel.id);
    if (this.service.formModel.id == 0)
      this.insertRecord(form);
    else
      this.updateRecord(form);
  }

  insertRecord(form: NgForm) {
    this.service.addProject().subscribe(
      (res:any) => {
        console.log(res);
        this.resetForm(form);
        this.toastr.success('Submitted successfully', res.status);
        this.router.navigateByUrl('/home/projects');
      },
      err => {
        debugger;
        console.log(err);
      }
    )
  }
  updateRecord(form: NgForm) {
    this.service.updateProject().subscribe(
      res => {
        this.resetForm(form);
        this.toastr.success('Submitted successfully', 'Project Updated');
        this.router.navigateByUrl('/home/projects');
      },
      err => {
        console.log(err);
      }
    )
  }
}
