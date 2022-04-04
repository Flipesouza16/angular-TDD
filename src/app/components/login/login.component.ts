import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {
  public isLogin = true;
  public formLogin: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
   this.formLogin = this.formBuilder.group({
     name: [null, [Validators.required]],
     email: [null, [Validators.required, Validators.email]],
     password: [null, [Validators.required, Validators.minLength(6)]],
   });
   console.log('this.formLogin: ',this.formLogin);
  }

  onSubmit() {
    if(this.isLogin) {
    } else {
    }
  }

  toggleLoginRegister() {
    this.isLogin = !this.isLogin;
  }

}
