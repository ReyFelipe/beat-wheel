import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ){}
  @Output() loginSuccessful = new EventEmitter();
  
  isSubmitted:boolean = false;

  form = this.formBuilder.group({
    email : ['', Validators.required],
    password : ['', Validators.required]
  });

  hasDisplayableError(controlName: string):Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && 
      (this.isSubmitted || Boolean(control?.touched))
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.authService.signIn(this.form.value)
      .subscribe({
        next:(res:any) => {
          localStorage.setItem('token', res.token);
          this.loginSuccessful.emit();
          this.toastr.success('Login Successful');
          // TODO: Subscribe to local storage instead of using variables
        },
        error:err => {
          if (err.status==400)
            this.toastr.error('Incorrect email or password', 'Login Failed');
          else 
            console.log('error during login:\n', err)
        }
      });
    }
  }
}
