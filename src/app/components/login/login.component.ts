import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationParams } from "src/domain/useCases/authentication";
import { AuthenticationService } from "./services/authentication.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {
  public isLogin = true;
  public formLogin: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
   this.formLogin = this.formBuilder.group({
     email: [null, [Validators.required, Validators.email]],
     password: [null, [Validators.required, Validators.minLength(8)]],
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

  async register() {
    if(!this.formLogin.valid) {
      this.validateForm();
    } else {
      const authenticationParams: AuthenticationParams = {
        firstname: this.formLogin.get('name')?.value,
        email: this.formLogin.get('email')?.value,
        password: this.formLogin.get('password')?.value
      }
      try {
        // const response = await this.authenticationService.register(authenticationParams);
        // console.log('response: ',response);
      } catch(error) {
        console.error(error);
      }
    }
  }

  validateForm(): void {
    let invalidField = null;
    const formControls = this.formLogin.controls;
    for(const nameField in formControls) {
      if(formControls['name'].invalid) {
        invalidField = 'name';
        break;
      } else if(formControls[nameField].invalid) {
        invalidField = nameField;
        break;
      }
    }
    invalidField && this.openSnackBar(`The ${invalidField} field is invalid`);
  }

  openSnackBar(message: string, duration = 2000): void {
    this.snackBar.open(message, 'Close', {
      duration
    });
  }

  async onSubmit(): Promise<void> {
    console.log('this.formLogin.valid: ',this.formLogin.valid);
    if(this.isLogin) {
      console.log('isLogin: ',this.formLogin);
    } else {
      console.log('isRegister: ',this.formLogin);
      await this.register();
    }
  }
}
