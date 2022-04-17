import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { By } from "@angular/platform-browser";
import { LoginComponent } from "./login.component";
import { AuthenticationService } from "./services/authentication.service";

describe(LoginComponent.name, () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let submitEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [AuthenticationService, HttpClient],
      declarations: [LoginComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  })

  it(`(D) Should disable login button if fields is empty`, () => {
    component.isLogin = true;
    fixture.detectChanges();
    submitEl = fixture.debugElement.query(By.css('.container-buttons .login-btn'));
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  })

  it(`(D) Should disable register button if fields is empty`, () => {
    component.toggleLoginRegister();
    fixture.detectChanges();
    submitEl = fixture.debugElement.query(By.css('.container-buttons .register-btn'));
    expect(submitEl.nativeElement.disabled).toBeTruthy();
  })

  it(`(D) Should disable all buttons when loading submit`, () => {
    component.isLoading = true;
    fixture.detectChanges();
    const buttonsLogin = fixture.debugElement.queryAll(By.css('.container-buttons .btn'));
    component.toggleLoginRegister()
    fixture.detectChanges();
    const buttonsRegister = fixture.debugElement.queryAll(By.css('.container-buttons .btn'));

    expect(buttonsLogin[0].nativeElement.disabled).toBeTruthy();
    expect(buttonsLogin[1].nativeElement.disabled).toBeTruthy();
    expect(buttonsRegister[0].nativeElement.disabled).toBeTruthy();
    expect(buttonsRegister[1].nativeElement.disabled).toBeTruthy();
  })
})
