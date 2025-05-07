import { Component, computed, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-auth',
  imports: [
    InputTextModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabel,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  providers: [MessageService],
})
export class AuthComponent {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toast: HotToastService
  ) {
    this.formInit();
    alert(`You can login with any username: Stanley and password: hakunamatata <\n>
      or

      Create a new account with any username and password <\n>
      and mail me at jaystechub@gmail.com to profile your account as either a doctor, nurse, pharmacist, medLabScientist or admin <\n>
      `);
  }

  authForm!: FormGroup;
  login = signal(true);
  // loginDetails = {username: signal(""), password: signal(""), confirmPassword:signal(""), email: signal("")}
  // passwordMatch = computed(() => {
  //   return this.loginDetails.password() === this.loginDetails.confirmPassword()
  // })

  // show(severity:string, message:string, summary:string) {
  //   this.messageService.add({ severity: severity , summary: summary, detail: message, life: 5000 });
  //   // console.log("showed")
  // }

  formInit() {
    this.authForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl({ value: '', disabled: this.login() }, [
        Validators.required,
      ]),
      email: new FormControl({ value: '', disabled: this.login() }, [
        Validators.required,
        Validators.email,
      ]),
    });
    // { validators: this.passwordMatchValidator.bind(this) })
  }

  passwordMatchValidator(): boolean | null {
    const password = this.authForm.get('password')?.value;
    const confirmPassword = this.authForm.get('confirmPassword')?.value;

    // Return null if passwords match, otherwise return an error object
    return password === confirmPassword ? true : false;
  }

  submit() {
    // console.log("DETAILS", this.loginDetails)

    if (this.login()) {
      //Logic for login
      const credentials = {
        username: this.authForm.get('username')?.value,
        password: this.authForm.get('password')?.value,
      };
      console.log(credentials);
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          this.authService.handleLoginResponse(response); // Call the service method to handle response
          // this.show('success', 'Login successful', response.message)
          this.toast.success(response.message);
        },
        error: (err) => {
          this.toast.error(err.error.message);
          console.error('Login failed:', err);
        },
      });
    } else {
      const userData = {
        username: this.authForm.get('username')?.value,
        email: this.authForm.get('email')?.value,
        password: this.authForm.get('password')?.value,
      };
      this.authService.register(userData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.toast.success(response.message);
          this.login.set(true);
          // this.router.navigate(['/login']); // Navigate on successful login
        },
        error: (error: any) => {
          console.error(error);
          this.toast.error(error.error.message);
        },
      });
      //Logic for SignUp
    }
  }

  switch() {
    this.login.update((value) => !value);
    this.formInit();
    console.log('Login state', this.login());
  }
}
