import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-changepassword',
    standalone: true,
    templateUrl: './changepassword.component.html',
    styleUrl: './changepassword.component.scss',
    imports: [
      CommonModule,
      HeaderComponent,
      RouterModule
    ]
})
export class ChangepasswordComponent implements AfterViewInit, OnInit{

  //ประกาศตัวแปร passwordInputRef, eyeIconRef เก็บองค์ประกอบมาจาก HTML ที่มีตัวแปรคือ #password, #eyeIcon, #confirmpassword, #eyeIcon2
  @ViewChild('password') changepassword!: ElementRef<HTMLInputElement>;
  @ViewChild('eyeIcon') eyeIcon!: ElementRef<HTMLElement>;
  @ViewChild('confirmpassword') confirmpassword!: ElementRef<HTMLInputElement>;
  @ViewChild('eyeIcon2') eyeIcon2!: ElementRef<HTMLElement>;

  // ประกาศตัวแปร เป็นฟังก์ชันที่ไม่มีการส่งค่าคืน (void)
  private iconEyeClickListener!: () => void;
  private iconEyeClickListener2!: () => void;

  constructor(
    private router: Router,
    private location: Location
  ){
  }

  ngOnInit(): void {

  }

  // ngAfterViewInit ของ Angular คือ ถูกเรียกหลังจาก Angular ได้สร้างโครงสร้างของคอมโพเนนท์และองค์ประกอบทั้งหมดแล้ว
  ngAfterViewInit(): void {

    this.toggleEye(); // เรียกใช้ method

    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) { // NavigationEnd คือโหลดหน้าใหม่เสร็จสมบูรณ์แล้ว
          if (event.url == '/main/profile') { //ตรวจสอบว่า URL ปัจจุบันที่นำทางไปยังนั้นเป็น '/main/changepassword' หรือไม่
            this.removeIconEyeClickListener();// เรียกใช้ method
          } else {
            this.toggleEye();
          }
        }
    });
  }

  toggleEye(){

    const input = this.changepassword.nativeElement; //รับ องค์ประกอบ HTML
    const inputConfirm = this.confirmpassword.nativeElement;
    const iconEye = this.eyeIcon.nativeElement;
    const iconEye2 = this.eyeIcon2.nativeElement;

    this.iconEyeClickListener = async () => {

      input.type = input.type == 'password' ? 'text' : 'password'; // สลับ type input
      iconEye.classList.toggle('ri-eye-line');
      iconEye.classList.toggle('ri-eye-off-line');
    };
    this.iconEyeClickListener2 = async () => {

      inputConfirm.type = inputConfirm.type == 'password' ? 'text' : 'password'; // สลับ type input
      iconEye2.classList.toggle('ri-eye-line');
      iconEye2.classList.toggle('ri-eye-off-line');
    };
    // เหมือนๆกับกับ iconEye.addEventListener('click', async () => {}); แค่เปลี่ยนเป็นแบบนี้
    iconEye.addEventListener('click', this.iconEyeClickListener);
    iconEye2.addEventListener('click', this.iconEyeClickListener2);
  }

  removeIconEyeClickListener(): void {
    const iconEye = this.eyeIcon.nativeElement; //รับ องค์ประกอบ HTML
    const iconEye2 = this.eyeIcon2.nativeElement;
    if (iconEye && this.iconEyeClickListener) { //ถ้าสองอย่างนี้ที่องค์ประกอบ HTML มีค่าที่ไม่ใช่ null 
      iconEye.removeEventListener('click', this.iconEyeClickListener); //ฟังก์ชัน iconEyeClickListener
    }
    if (iconEye2 && this.iconEyeClickListener2) { //ถ้าสองอย่างนี้ที่องค์ประกอบ HTML มีค่าที่ไม่ใช่ null 
      iconEye2.removeEventListener('click', this.iconEyeClickListener2); //ฟังก์ชัน iconEyeClickListener
    }
  }

  async delay(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  warn: any;
  warnicon: any;
  warnicon2: any;
  recommend: any;

  async onInputChange(password: HTMLInputElement, passwordConfirm: HTMLInputElement) {

    const containerChangePassword = document.getElementById('containerChangePassword') as HTMLElement;
    const containerChangePassword2 = document.getElementById('containerChangePassword2') as HTMLElement;

    // ถ้าป้อนมาไม่มีค่าว่าง
    if (password.value != ""){
      
      if (password.value.length < 8){
        this.recommend = "Use at least 8 characters. Don’t use a password from another site, or something too obvious like your pet’s name.";
      } 
      //  /: เริ่มต้นขอบเขตของ regular expression ซึ่งใช้ในการตรวจสอบว่าข้อความที่ให้มามีเฉพาะตัวเลขเท่านั้นหรือไม่ 
      //  ^: บอกว่าเริ่มต้นของข้อความ
      //  \d: แทนตัวอักษรตัวเลข คือ 0-9
      //  +: บอกว่าต้องมีตัวเลขอย่างน้อย 1 ตัวขึ้นไป (ไม่มีหรือมากกว่านั้น)
      //  $: บอกว่าจบขอบเขตของข้อความ
      //  /: สิ้นสุดขอบเขตของ regular expression
      //  .test() ทำให้เป็นการเรียกใช้งาน regular expression 
        else if (/^\d+$/.test(password.value)) {
        this.recommend = "Password strength: Too weak.";
      } else if (password.value.length > 12){
        this.recommend = "Password strength: Strong.";
      } else {
        this.recommend = "Password strength: Good.";
      }

      if (password.value == passwordConfirm.value && password.value.length >= 8 && passwordConfirm.value.length >= 8) {

        this.warn = "";
        await this.delay(200);
        containerChangePassword.classList.toggle('borderGreen');
        this.warnicon = "";
        await this.delay(300);
        containerChangePassword2.classList.toggle('borderGreen');
        this.warnicon2 = "";
        
      } else if (passwordConfirm.value.length > 0 && password.value != passwordConfirm.value) {
        
        this.warn = "Passwords don't match.";
        await this.delay(200);
        containerChangePassword.classList.remove('borderGreen');
        this.warnicon = "!";
        await this.delay(300);
        containerChangePassword2.classList.remove('borderGreen');
        this.warnicon2 = "!";
      } else {

        this.warn = "";
        await this.delay(200);
        containerChangePassword.classList.remove('borderGreen');
        this.warnicon = "";
        await this.delay(300);
        containerChangePassword2.classList.remove('borderGreen');
        this.warnicon2 = "";
      }

    } else if (password.value.length == 0){

      this.recommend = "";
    }
  }
}
