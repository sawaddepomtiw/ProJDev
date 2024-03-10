import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2'
import { User } from '../../model/getpostputdelete';
import { AppdataService } from '../../service/appdata.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(
    private router: Router,
    private http: HttpClient,
    private location: Location,
    private AppdataService: AppdataService
  ){
  }

  ngOnInit(): void {

    let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
    if (addUserLoginSessions.length > 0) { // เมื่อมีการ loginแล้ว ป้องกัน user พิมพ์ url localhost:4200 แล้วกลับมา login ใหม่
      this.router.navigate(['/main']);     // รวมถึง พิมพ์ localhost:4200/register ด้วย
    }

    this.togglebackToLoginForm();
    
    if (this.location.path().includes('/register')){

      const login = document.querySelector('.login') as HTMLElement;
      login.style.display = 'grid';

      this.waitAnimationWelcome();
    }
  }

  async waitAnimationWelcome(){

    const left__Welcome = document.querySelector('.left__Welcome') as HTMLElement;
    
    await this.delay(1400);
    left__Welcome.style.width = '978px';
    left__Welcome.style.overflow = 'hidden';
  }

  togglebackToLoginForm() {

    const login = document.querySelector('.login') as HTMLElement;
    const login__form = document.querySelector('.login__form') as HTMLElement;
    const register__form = document.querySelector('.register__form') as HTMLElement;
    const btn__Register = document.querySelector('.backToLogin') as HTMLElement;
    const left__Welcome = document.querySelector('.left__Welcome') as HTMLElement;
    
    btn__Register.addEventListener('click', async () => {

      left__Welcome.classList.toggle('left__Welcome');

      await this.delay(600);
      left__Welcome.style.width = '0px';
      
      login__form.style.transform = ''; //ให้ transform ขวา 500px
      register__form.style.transform = 'translateX(-500px)'; //ให้ transform ขวา 500px
      await this.delay(450); //รอ delay 
      login__form.style.display = 'block';
      this.router.navigate(['/signin']); //เมื่อกดปุ่ม register
      login.style.display = 'grid';
    });
  }

  // function ดีเลย์สักหน่อยย
  async delay(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  sendSelectEmail: any;
  sendSelectPassword: any;

  clickSelect(select: any) {

    this.sendSelectEmail = select.email;
    this.sendSelectPassword = select.password;
  }

  // generateOTP 6 หลัก
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  OTP = this.generateOTP(); //เก็บ generateOTP 6 หลัก
  REF = this.generateOTP(); //เก็บรหัสอ้างอิง 6 หลัก

  results: User[] = [];

  //Click button ส่ง email
  async sendOTP(username: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement, passwordConfirm: HTMLInputElement) {

    this.results = await this.AppdataService.getUser();
    
    let found = false;
    for (const result of this.results){
      if (result.email == email.value){
        found = true;
        break;
      }
    }    
      
    // ถ้าไม่มี value หรือ email ไม่มี @ ให้ user ทำให้ถูกต้อง
    if (found || !username.value || !email.value || !email.value.includes('@') || !email.value.includes('.') || !password.value || !passwordConfirm.value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        showConfirmButton: true,
        timer: 2000
      });
      return;
    }else {
      //ถ้ามี ครบ
      if (password.value == passwordConfirm.value) {
 
        const emailData = {
          recipient: email.value, //email ผู้รับ
          subject: "Verify your login Facemash account", //title mail
          content: `<table width="680px" cellpadding="0" cellspacing="0" border="0">
                      <tbody>
                        <tr>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="80%" bgcolor="#eeeeee" align="center"><h1>Welcome! to Facemash</h1></td>
                          <td width="5%" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="20" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" height="72" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="72" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="72" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="72" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="72" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="80%" bgcolor="#ffffff" align="center" valign="top" style="line-height:24px"><font color="#333333" face="Arial"><span style="font-size:20px">สวัสดี!</span></font><br><font color="#333333" face="Arial"><span style="font-size:16px">กรุณานำรหัส <span class="il">OTP</span> ด้านล่าง ไปกรอกในหน้ายืนยัน.</span></font><br></td>
                          <td width="5%" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" height="42" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="42" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="42" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="42" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="42" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" height="72" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="72" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="72" bgcolor="#ffffff" align="center" valign="top">
                            <table width="100%" height="72" cellpadding="0" cellspacing="0" border="0">
                              <tbody><tr>
                                <td width="10%" height="1" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="1" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="5%" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="*" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="5%" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="1" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="10%" height="1" bgcolor="#ffffff" style="font-size:0"></td>
                              </tr>
                              <tr>
                                <td width="10%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="1" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="5%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="*" height="20" bgcolor="#ffffff" align="center" valign="middle" style="font-size:18px;color:#c00;font-family:Arial">
                                  <span class="il">OTP</span> : <strong style="color:#000">${ this.OTP }</strong></td>
                                <td width="5%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="1" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="10%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                              </tr>
                              <tr>
                                <td width="10%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="1" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="5%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="*" height="20" bgcolor="#ffffff" align="center" valign="middle" style="font-size:18px;color:#c00;font-family:Arial">
                                  <span class="il">Ref</span> : <strong style="color:#000">${ this.REF }</strong></td>
                                <td width="5%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="1" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="10%" height="20" bgcolor="#ffffff" style="font-size:0"></td>
                              </tr>
                              <tr>
                                <td width="10%" height="1" bgcolor="#ffffff" style="font-size:0"></td>
                                <td width="1" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="5%" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="*" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="5%" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="1" height="1" bgcolor="#cc0000" style="font-size:0"></td>
                                <td width="10%" height="1" bgcolor="#ffffff" style="font-size:0"></td>
                              </tr>
                            </tbody></table>
                          </td>
                          <td width="5%" height="72" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="72" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>	
                        <tr>
                          <td width="5%" height="78" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="78" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="78" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="78" bgcolor="#ffffff" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="78" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" height="54" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="54" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="54" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="54" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="54" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td width="5%" height="24" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="24" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="80%" height="24" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="24" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                          <td width="5%" height="24" bgcolor="#eeeeee" style="font-size:0">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>`
        };
        
        const registerData = { // เก็บข้อมูล user ไว้
          email: email.value,
          password: password.value,
          name: username.value,
          
        };

        this.http.post('http://localhost:3000/send-otp', emailData).subscribe(); // แบบนี้จะไวมาก
        // await this.AppdataService.sendEmailOtp(emailData); // ส่วนแบบนี้จะช้าประมาณ 2-3 วิ
        this.Verify(registerData);// ส่งไปกรอกรหัส OTP และ ข้อมูล user

      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          showConfirmButton: true,
          timer: 2000
        });
        return;
      }
    }
  }

  //ใส่ OTP ที่ได้รับจาก email
  async Verify(registerData: any){ 
    const { value: OTP } = await Swal.fire({
      title: "Enter code OTP",
      input: "text",
      inputLabel: `Please enter the OTP code. sent to your email. (Ref : ${this.REF})`, // รหัสอ้างอิง
      inputPlaceholder: "Enter code OTP",
      inputAttributes: {
        maxlength: "6",
        autocapitalize: "off",
        autocorrect: "off"
      }
    });
    if (OTP){ //เมื่อใส่ otp และ กดยืนยัน
      this.VerifyOTP(OTP, registerData); //ส่งไปตรวจสอบ OTP และส่งข้อมูล user
    }
  }

  //ตรวจสอบ OTP
  async VerifyOTP(OTP: any, registerData: any){
    
    if (this.OTP == OTP){ //ถ้า OTP ถูกต้อง
      const correct = Swal.mixin({
        position: "top-end",
        showConfirmButton: false,
      });
      //ส่งเข้าระบบต่อไป
      if (correct){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Signed in successfully!",
          showConfirmButton: false,
          timer: 1200
        });
        const btn__Register = document.querySelector('.backToLogin') as HTMLElement;

        await this.AppdataService.postUser(registerData); // ส่งไปลง databases
        
        await this.delay(1500); //รอให้ Swal.fire เสร็จก่อนนนสัก วิ.. ค่อยไปหน้าต่อไป
        
        btn__Register.click(); // ส่งกลับไป login เพื่อเข้าระบบต่อไป...
      }
    }else { // ถ้า OTP กรอกผิด
      Swal.fire({
        position: "center",
        icon: "question",
        title: "The OTP code is not valid!",
        text: "Please try again.",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // ส่งไปให้ใส่ OTP อีกครั้งเมื่อกรอกผิด
          this.Verify(registerData);
        }
      });
    }
  }

  warn: any;
  warnicon: any;
  warnicon2: any;

  async onInputChange(password: HTMLInputElement, passwordConfirm: HTMLInputElement) {

    // ไม่ต้องแจ้งเตือน user ถ้ายังไม่ได้ป้อน password ทั้งสองครั้ง
    if (password.value == " " || passwordConfirm.value == " ") {
      this.warn = "";
    } else if (password.value != passwordConfirm.value) {// แจ้งเตือน user ถ้า password ไม่ตรงกัน
      this.warn = "Passwords don't match.";
      await this.delay(200);
      this.warnicon = "!";
      // await this.delay(300);
      this.warnicon2 = "!";
    } else { // ลบข้อความเตือนเมื่อ password ตรงกัน
      this.warn = " ";
      await this.delay(200);
      this.warnicon2 = " ";
      // await this.delay(300);
      this.warnicon = " ";
    }
  }
}