import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  userName: AbstractControl;
  password: AbstractControl;
  submitAttempt: boolean = false;
  loginFailed: boolean = false;
  failedLoginMessage: string;

  constructor(
    public viewController: ViewController,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider) {

    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.userName = this.loginForm.controls['userName'];
    this.password = this.loginForm.controls['password'];
  }

  login() {
    this.submitAttempt = true;

    if (this.loginForm.valid) {
      let enteredUserName = this.loginForm.value.userName;
      let enteredPassword = this.loginForm.value.password;

      this.authProvider.login(enteredUserName, enteredPassword)
        .then((token) => {
          this.viewController.dismiss({successful: true, username: enteredUserName});
        })
        .catch((error) => {
          this.failedLoginMessage = error.message;
          this.loginFailed = true;

          let alert = this.alertController.create({
            title: 'Login Failed!',
            subTitle: error.message,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  return true;
                }
              }
            ]
          });

          alert.present();
        });
    }
  }

  cancel() {
    this.viewController.dismiss({ successful: false, username: ''})
  }
}
