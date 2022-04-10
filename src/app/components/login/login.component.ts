import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "./services/authentication.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {
  public isLogin = true;
  public formLogin: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
   this.formLogin = this.formBuilder.group({
     email: [null, [Validators.required, Validators.email]],
     password: [null, [Validators.required, Validators.minLength(6)]],
   });
  }

  toggleLoginRegister(): void {
    this.isLogin = !this.isLogin;
    if(!this.isLogin) {
      this.formLogin.addControl('name', new FormControl(null, [Validators.required]));
    } else {
      this.formLogin.removeControl('name');
    }
  }


  onSubmit(): void {
    if(this.isLogin) {
    } else {
    }
  }
}
