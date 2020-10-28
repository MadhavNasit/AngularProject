import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http:HttpClient) { }

  readonly baseURI = 'https://localhost:44306/api';

  formModel = this.fb.group({
    UserName :['', [Validators.email,Validators.required]],
    FirstName :['', Validators.required],
    LastName :[''],
    Passwords : this.fb.group({
      Password :['', [Validators.required,Validators.minLength(6)]],
      ConfirmPassword :['', Validators.required]
    }, {validator: this.comparePasswords})
  });

  comparePasswords(fb: FormGroup)
  {
    let confirmPasswordCtrl = fb.get('ConfirmPassword');

    if(confirmPasswordCtrl.errors == null || 'passwordMismatch' in confirmPasswordCtrl.errors){
      if(fb.get('Password').value != confirmPasswordCtrl.value)
        confirmPasswordCtrl.setErrors({passwordMismatch:true});
      else
        confirmPasswordCtrl.setErrors(null);
    }
  }

  register(){
    var body = {
      UserName: this.formModel.value.UserName,
      FirstName: this.formModel.value.FirstName,
      LastName: this.formModel.value.LastName,
      Password: this.formModel.value.Passwords.Password,
    };
    return this.http.post(this.baseURI+'/User/register',body,{observe: 'response'});
  }

  login(formData) {
    return this.http.post(this.baseURI + '/User/authenticate', formData);
  }

  forgotpassword(formData){
    return this.http.post(this.baseURI+'/User/forgotpassword',formData,{observe: 'response'});
  }

  getUserProfile() {
    return this.http.get(this.baseURI + '/User/getuser/'+localStorage.getItem('id'));
  }
}
