import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirstKeyPipe } from 'src/app/pipes/first-key.pipe';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true,
})
export class RegistrationComponent {
  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ){}
  @Output() registrationSuccessful = new EventEmitter();

  isSubmitted:boolean = false;

  passwordMatchValidator: ValidatorFn = (control:AbstractControl):null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value != confirmPassword.value) {
      confirmPassword?.setErrors({passwordMismatch: true})
    } else {
      confirmPassword?.setErrors(null);
    }      
    return null
  }

  form = this.formBuilder.group({
    fullName : ['', Validators.required],
    email : ['', [Validators.required, Validators.email]],
    password : ['', [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
    ]],
    confirmPassword : ['']
  }, {validators:this.passwordMatchValidator})

  hasDisplayableError(controlName: string):Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && 
      (this.isSubmitted || Boolean(control?.touched))
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.authService.createUser(this.form.value)
      .subscribe({
        next:(res:any) => {
          if (res.succeeded)
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('New user created!', 'Registration Successful');

            // Log in automatically
            this.authService.signIn(this.form.value)
            .subscribe({
              next:(res:any) => {
                localStorage.setItem('token', res.token);
                this.registrationSuccessful.emit();
              },
              error:(err:any) => {
                  this.toastr.error('Error during login. Please try logging in manually', 'Login Failed');
                  console.log('error during login:\n', err)
              }
            });
        },
        error:(err:any) => {
          if (err.error.errors) 
            err.error.errors.forEach((x:any) => {
              switch(x.code) {
                case "DuplicateUserName":
                  break;
                case "DuplicateEmail":
                  this.toastr.error('Email is already in use.', 'Registration Failed');
                  break;
                  default:
                    this.toastr.error('Unknown error occured', 'Registration Failed');
                    console.log(x);
                    break;
              }
            });
          else 
            console.log('error:', err)
        }
      });
    }
  }
}
