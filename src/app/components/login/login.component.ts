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
  public isPasswordInvalid = false;
  public fullValidationRequirements: any = {
    atLeast1Lowercase: false,
    atLeast1Uppercase: false,
    atLeast1numeric: false,
    atLeast1Special: false,
    mustBe8CharactersOrLonger: false,
  };
  public isFormInvalid = false;
  public isLoading = false;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initializeFormLogin();
  }

  initializeFormLogin(): void {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  toggleLoginRegister(): void {
    this.isLogin = !this.isLogin;
    if(!this.isLogin) {
      this.formLogin.addControl('name', new FormControl('', [Validators.required]));
    } else {
      this.formLogin.removeControl('name');
    }
  }

  validateForm({ isRegister = true }): void {
    let invalidField = '';
    const formControls = this.formLogin.controls;
    for(const nameField in formControls) {
      if(formControls['name']?.invalid) {
        invalidField = 'name';
        break;
      } else if(formControls[nameField].invalid) {
        invalidField = nameField;
        break;
      }
    }

    if(invalidField) {
      this.isFormInvalid = true;
    }

    if(isRegister) {
      this.validateEachStageOfPassword(true, invalidField);
    }

    invalidField && this.openSnackBar(`The ${invalidField} field is invalid`);
  }

  validateEachStageOfPassword(isRegister = false, invalidField?: string): void {
    const password = this.formLogin.controls['password'].value;
    this.isFormInvalid = false;
    this.isPasswordInvalid = this.authenticationService.checkIfPasswordIsInvalid(password);
    this.fullValidationRequirements = this.authenticationService.validationRequirements;

    if(invalidField !== 'password' && this.isPasswordInvalid ) {
      if(isRegister) {
        this.openSnackBar(`The password field is invalid`);
        this.isFormInvalid = true;
      }
    }
  }

  checkIfPasswordIsValid(event: any) {
    if(event.target.value) {
      this.validateEachStageOfPassword();
    }
  }

  openSnackBar(message: string, duration = 2000): void {
    this.snackBar.open(message, 'Close', {
      duration
    });
  }

  async register() {
    this.validateForm({ isRegister: true });
    if(!this.isFormInvalid) {
      const authenticationParams: AuthenticationParams = {
        firstname: this.formLogin.get('name')?.value,
        email: this.formLogin.get('email')?.value,
        password: this.formLogin.get('password')?.value
      }
      try {
        this.isLoading = true;
        const response = await this.authenticationService.register(authenticationParams);
        console.log('response: ',response);
        this.openSnackBar('Registered successfully!');
        setTimeout(() => {
          window.location.reload();
          this.isLoading = false;
        }, 1000)
      } catch(error) {
        console.error(error);
        this.isLoading = false;
      }
    }
  }

  async login() {
    this.validateForm({ isRegister: false });
    try {
      const authenticationParams: AuthenticationParams = {
        email: this.formLogin.get('email')?.value,
        password: this.formLogin.get('password')?.value
      }
      this.isLoading = true;
      const response = await this.authenticationService.login(authenticationParams);
      console.log('response: ',response);
      this.openSnackBar('Logged successfully!');
      setTimeout(() => {
        window.location.reload();
        this.isLoading = false;
      }, 1000)
    } catch(error: any) {
      this.isLoading = false;
      console.error(error.message);
      const invalidField = error.message;

      if(invalidField.length) {
        invalidField && this.openSnackBar(`The ${invalidField} field is invalid`);
      } else {
        this.openSnackBar(`The email or password is invalid`);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if(this.isLogin) {
      await this.login();
    } else {
      await this.register();
    }
  }
}
