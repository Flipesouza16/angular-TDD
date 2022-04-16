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

  validateForm(): void {
    let invalidField = '';
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

    if(invalidField) {
      this.isFormInvalid = true;
    }

    this.validateEachStageOfPassword(true, invalidField);
    invalidField && this.openSnackBar(`The ${invalidField} field is invalid`);
  }

  validateEachStageOfPassword(isRegister = false, invalidField?: string): void {
    const formControls = this.formLogin.controls;
    const password = formControls['password'].value;
    const typesOfValidationOfPassword = Object.keys(this.authenticationService.fullValidationRequirements(password));
    this.isPasswordInvalid = false;

    for(const stageValidationPassword of typesOfValidationOfPassword) {
      const isPasswordStageValid = this.authenticationService.fullValidationRequirements(password)[stageValidationPassword]();
      if(isPasswordStageValid) {
        this.fullValidationRequirements[stageValidationPassword] = true;
      } else {
        this.fullValidationRequirements[stageValidationPassword] = false;
        this.isPasswordInvalid = true;
      }
    }

    if(invalidField !== 'password' && this.isPasswordInvalid ) {
      isRegister && this.openSnackBar(`The password field is invalid`);
      this.isFormInvalid = true;
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
    this.validateForm();
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

  async onSubmit(): Promise<void> {
    if(this.isLogin) {
    } else {
      await this.register();
    }
  }
}
