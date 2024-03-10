import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AddUserLoginSession, AppdataService, KeepUserEmail } from '../service/appdata.service';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from "./register/register.component";
import Swal from 'sweetalert2'
import { User } from '../model/getpostputdelete';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      RegisterComponent
    ]
})
export class LoginComponent{

  constructor(
    private router: Router,
    private AppdataService: AppdataService,
  ) {}

  ngOnInit(): void {
    
    let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
    if (addUserLoginSessions.length > 0) { // เมื่อมีการ loginแล้ว ป้องกัน user พิมพ์ url localhost:4200 แล้วกลับมา login ใหม่
      this.router.navigate(['/main']);     // รวมถึง พิมพ์ localhost:4200/register ด้วย
    }
    
    this.JsLogin();
    this.getLoginShowLocalStorage(); //ส่งการบันทึกทั้งหมดไปแสดง
    this.toggleRegisterForm();
  }

  //คลิ๊ก Register
  toggleRegisterForm(): any {

    const loginForm = document.querySelector('.loginN') as HTMLElement;
    const btn_Register = document.querySelector('.registers') as HTMLElement;
    
    btn_Register.addEventListener('click', async () => {
      loginForm.style.transform = 'translateX(500px)';
      await this.delay(500); //รอ delay
      loginForm.style.display = 'none'; // ให้ loginform display none ซ่อนไว้
      this.router.navigate(['/register']); //ไปที่ /register
    });
  }
  
  // javascript
  JsLogin(){

    const showHiddenPass = (loginPass: string, loginEye: string) => {
      const input = document.getElementById(loginPass) as HTMLInputElement; //รับ id 
      const iconEye = document.getElementById(loginEye) as HTMLElement;

      iconEye.addEventListener('click', () => {
          
        input.type = input.type === 'password' ? 'text' : 'password'; //กดดวกตา show password
        iconEye.classList.toggle('ri-eye-line');  //กดครั้งแรก
        iconEye.classList.toggle('ri-eye-off-line'); //กดครั้งสองให้ปิดตา
      });
    };
    
    const showEmail = (loginEye: string, showmail: string) => {
      const chevrondown = document.getElementById(loginEye) as HTMLElement; 
      const showemail = document.getElementById(showmail) as HTMLElement ;

      let rotated = true;
  
      chevrondown.addEventListener('click', () => {

        if (!rotated) {

          chevrondown.style.transform = '';
          showemail.style.display = 'none';
        } else {

          chevrondown.style.transform = 'rotate(-180deg)';
          showemail.style.display = 'block';
        }
        rotated = !rotated; 
    
        const body = document.body;
          if (body) {
            body.addEventListener('click', (event) => {
              const target = event.target as HTMLElement;
              if (!target.closest('#show-mail') && !target.closest('#login__select')) {
                showemail.style.display = 'none'; 
                chevrondown.style.transform = ''; 
                rotated = true; 
              }
            });
          }

        const show = document.querySelectorAll('.Show__emailSelect');

          show.forEach(icons => {
            icons.addEventListener('click', () => {

              showemail.style.display = 'none';
              chevrondown.style.transform = '';
              rotated = true;
            });
          });
      });
    };
    //รับ id เข้า
    showHiddenPass('login-password', 'login-eye');
    showEmail('login__select', 'show-mail');
  }

  results: User[] = [];
  email: any;
  password: any;

  //Click button ส่ง email
  async Login(email: HTMLInputElement, password: HTMLInputElement) {

    this.results = await this.AppdataService.getUser();

    for (const result of this.results) {
        this.email = result.email;
        this.password = result.password;

        if (!email.value || !email.value.includes('@')) {
          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please enter a valid email address",
              showConfirmButton: true,
              timer: 2000
          });
          return;
        }

        if (email.value == this.email && password.value == this.password) {
          Swal.fire({
              position: "center",
              icon: "success",
              title: "Signed in successfully!",
              showConfirmButton: false,
              timer: 1200
          });
          await this.delay(1300); 
          this.router.navigate(['/main']);
          return; 
        }
    }

    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or password",
        showConfirmButton: true,
        timer: 2000
    });
  }

  sendSelectEmail: any;
  sendSelectPassword: any;

  async clickSelect(select: any) {

    this.results = await this.AppdataService.getUser();

    for (let result of this.results) {
      if (select.password == result.password) {
        const { value: password } = await Swal.fire({ // ป้อน password
          title: "Enter your password",
          input: "password",
          inputLabel: "Enter your password to verify your identity.",
          inputPlaceholder: "Enter your password.",
          inputAttributes: {
            autocapitalize: "off",
            autocorrect: "off"
          }
        });      
        if (result.password == password) {
          const Toast = Swal.mixin({ 
            toast: true,                                                             
            position: "top",                                                     
            showConfirmButton: false,                                                
            timer: 2000,                                                             
            timerProgressBar: true,                                                  
            didOpen: (toast) => {                                                    
              toast.onmouseenter = Swal.stopTimer;                                   
              toast.onmouseleave = Swal.resumeTimer;                                 
            }                                                                        
            });                                                                        
            Toast.fire({                                                               
              icon: "success",                                                         
              title: "The password is correct."                                           
          });

          this.sendSelectEmail = select.email;
          this.sendSelectPassword = select.password;
          return;
        } else {
          const Toast = Swal.mixin({
            toast: true,                                                       
            position: "top",                                              
            showConfirmButton: false,                                        
            timer: 2000,                                                        
            timerProgressBar: true,                                           
            didOpen: (toast) => {                                              
              toast.onmouseenter = Swal.stopTimer;                            
              toast.onmouseleave = Swal.resumeTimer;                           
            }                                                                 
          });                                                                 
          Toast.fire({                                                        
            icon: "warning",                                                  
            title: "Something went wrong!"                                       
          }); 
          return;
        }
      }
    }
  }

  // function ดีเลย์สักหน่อยย
  async delay(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  // add เพิ่มการบันทึก email ลง localStorage
  async addTempsLocalStorage(email: HTMLInputElement, password: HTMLInputElement, remember: HTMLInputElement){

    let keepUserEmails = [];
    if(localStorage.getItem('keepUserEmails')){
      keepUserEmails = JSON.parse(localStorage.getItem('keepUserEmails')!);
    }
    let keepUserEmail = new KeepUserEmail();
    let found = false;
    this.results = await this.AppdataService.getUser();

    //1. กรณี user click remember me ตรวจสอบ localStorage ว่ามี email, password หรือไม่ 
    // ถ้า ไม่มี ให้ให้เช็ค email, password ใน database ว่ามันตรงกับ user พิมพ์มาไหม 
    // ถ้าทั้งคู่ตรงกัน และ user click rememeber me ให้บันทึกลง localStorage.

    //2. กรณีที่ user click remember me ให้ตรวจสอบ localStorage ว่ามี email, password หรือไม่ 
    // ถ้า มี ก็ให้ให้เช็ค email, password ใน database ว่ามันตรงกับ user พิมพ์มาไหม
    // ถ้าทั้งคู่ตรงกัน และยัง click remember me อยู่ให้ไม่ต้องบันทึกลง localStorage.

    if (remember.checked){ //กรณี user click remember me
      for (const result of this.results){ // เอาค่าใน database ออกมา
        if (keepUserEmails.length > 0) { // ตรวจสอบว่ามีใน localStorage     
          for (let temp of keepUserEmails) { // เอาค่าใน localStorage ออกมา          
            if (email.value == temp.email && password.value == temp.password){// ถ้าที่ input เข้ามัน 'ตรง' กับใน localStorage
              found = false;
              break; 
            } else { // ถ้าที่ input เข้ามัน 'ไม่ตรง' กับใน localStorage
              if (email.value == result.email && password.value == result.password){
                found = true;// ส่งไปบันทึกลง localStorage โลด
                break; // จบ
              }
            }
          }
        }else {  // ถ้าใน localStorage ไม่มีอะไรอะหยังจักอย่าง        
          if (email.value == result.email && password.value == result.password){ // ถ้าที่ input เข้ามันตรงกับ database
            found = true;// ส่งไปบันทึกลง localStorage โลด
            break;// จบ
          }
        }
      }
      if (found) { // ถ้า found => true
        keepUserEmail.email = email.value;
        keepUserEmail.password = password.value;
        keepUserEmails.push(keepUserEmail);
        localStorage.setItem('keepUserEmails', JSON.stringify(keepUserEmails));
      }
    }
  }

  tempEmailLogins: any;
  tempPasswordLogins: any;
  select: any;
  checked: boolean = false;
  // ดึง email
  getLoginShowLocalStorage(){

    let keepUserEmails = [];
    if(localStorage.getItem('keepUserEmails')){
      keepUserEmails = JSON.parse(localStorage.getItem('keepUserEmails')!);
      // this.checked = true; //ถ้ามี tempEmailLogins ให้ click remember me
      this.select = keepUserEmails;              
    }
    // for (let Get of tempEmailLogins){
    //   this.tempEmailLogins = Get.email;      
    //   this.tempPasswordLogins = Get.password;     
    //   return;       
    // }
  }

  addUserLoginSession(email: HTMLInputElement, password: HTMLInputElement){

    let addUserLoginSessions = [];
    if(sessionStorage.getItem('addUserLoginSessions')){
      addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions')!);
    }
    let addUserLoginSession = new AddUserLoginSession();

    if (email.value && password.value){

      addUserLoginSession.email = email.value;
      addUserLoginSession.password = password.value;
      addUserLoginSessions.push(addUserLoginSession);
      sessionStorage.setItem('addUserLoginSessions', JSON.stringify(addUserLoginSessions));
    }
  }
}