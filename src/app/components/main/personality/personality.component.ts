import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";
import Swal from 'sweetalert2';
import { AppdataService } from '../../../service/appdata.service';
import { User } from '../../../model/getpostputdelete';

@Component({
    selector: 'app-personality',
    standalone: true,
    templateUrl: './personality.component.html',
    styleUrl: './personality.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        HeaderComponent
    ]
})
export class PersonalityComponent implements AfterViewInit, OnInit {

    //ประกาศตัวแปร passwordInputRef, eyeIconRef เก็บองค์ประกอบมาจาก HTML ที่มีตัวแปรคือ #passwordInput, #eyeIcon
    @ViewChild('passwordInput') passwordInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('eyeIcon') eyeIconRef!: ElementRef<HTMLElement>;
    //--------------------------------------------------------------------------------------------------
    // ประกาศตัวแปร เป็นฟังก์ชันที่ไม่มีการส่งค่าคืน (void)
    private iconEyeClickListener!: () => void;

    User: User[] = [];
    profileShow: any;
    emailShow: any;
    nameShow: any;
    passwordShow: any;

    constructor(
        private router: Router,
        private AppdataService: AppdataService
    ) {}

    ngOnInit(): void {

        this.headerShow();
    }

    async headerShow(){
        let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions')! || '[]');
        this.User = await this.AppdataService.getUser();
        for (let results of this.User){
            if (results.email == addUserLoginSessions[0].email){
                if (results.profile == null){
                    this.profileShow = 'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png';
                } else {
                    this.profileShow = results.profile;
                }
                this.emailShow = results.email;
                this.nameShow = results.name;
                this.passwordShow = results.password;
            }
        }
    }

    // ngAfterViewInit ของ Angular คือ ถูกเรียกหลังจาก Angular ได้สร้างโครงสร้างของคอมโพเนนท์และองค์ประกอบทั้งหมดแล้ว
    ngAfterViewInit(): void {

        this.toggleEye(); // เรียกใช้ method

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) { // NavigationEnd คือโหลดหน้าใหม่เสร็จสมบูรณ์แล้ว
                if (event.url == '/main/changepassword') { //ตรวจสอบว่า URL ปัจจุบันที่นำทางไปยังนั้นเป็น '/main/changepassword' หรือไม่
                    this.removeIconEyeClickListener();// เรียกใช้ method
                } else {
                    this.toggleEye();
                }
            }
        });
    }

    toggleEye(): void {

        let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions')! || '[]');
        const input = this.passwordInputRef.nativeElement; //รับ องค์ประกอบ HTML
        const iconEye = this.eyeIconRef.nativeElement; 

        let isPasswordVisible = false; // สร้าง ตัวแปร false

        this.iconEyeClickListener = async () => {
            if (!isPasswordVisible) { // เข้าเงื่อนไขไว้
                const { value: password } = await Swal.fire({ // ป้อน password
                    title: "Enter your password",
                    input: "password",
                    inputLabel: "Enter your password to display the password.",
                    inputPlaceholder: "Enter your password.",
                    inputAttributes: {
                      autocapitalize: "off",
                      autocorrect: "off"
                    }
                });
                if (password == addUserLoginSessions[0].password) { //ถ้ามีการป้อน password เข้ามา
                    const isVisible = input.type == 'text'; //ถ้าเป็น password แสดงว่ารหัสผ่านถูกซ่อนอยู่ ผลลัพธ์จะเก็บไว้ในตัวแปร 
                    input.type = isVisible ? 'password' : 'text'; // สลับ type input
                    iconEye.classList.toggle('ri-eye-line', !isVisible); //เปิดตา
                    iconEye.classList.toggle('ri-eye-off-line', isVisible); //ปิดตา
                    
                    if (isVisible) {
                        input.classList.remove('show'); // ไม่แสดง class show ใน css บรรทัด ~ 84 ชื่อ class input.show
                    } else {
                        input.classList.add('show'); // แสดง class show 
                    }
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
                    isPasswordVisible = true; //เปลี่ยนตัวแปรเป็น true เพื่อให้เข้า else หลังจากเปิดดวงตา   -|
                } else {                                                                       //  |
                    const Toast = Swal.mixin({ // ถ้าไม่ใส่ password หรือ กดเปิดดวงตาแล้วไม่ทำอะไรเลย     |
                        toast: true,                                                             //|
                        position: "top",                                                     //|
                        showConfirmButton: false,                                                //|
                        timer: 2000,                                                             //|
                        timerProgressBar: true,                                                  //|
                        didOpen: (toast) => {                                                    //|
                          toast.onmouseenter = Swal.stopTimer;                                   //|
                          toast.onmouseleave = Swal.resumeTimer;                                 //|
                        }                                                                        //|
                      });                                                                        //|
                      Toast.fire({                                                               //|
                        icon: "warning",                                                         //|
                        title: "Something went wrong!"                                           //|
                    });                                                                          //|
                                                                                                 //|
                    return; // จบ                                                                  |
                }                                                                                //|
            } else { // <<<<<<<<<<<<<<<<<<<<<-------------------------------------------------------
                const isVisible = input.type == 'text';
                input.type = isVisible ? 'password' : 'text';
                iconEye.classList.toggle('ri-eye-line', !isVisible);
                iconEye.classList.toggle('ri-eye-off-line', isVisible);
                
                if (isVisible) {
                    input.classList.remove('show'); 
                } else {
                    input.classList.add('show');
                }
                isPasswordVisible = false; // เปลี่ยนตัวแปรเป็น false เพื่อให้เข้า if หลังจากปิดดวงตา
            }
        };
        // เหมือนๆกับกับ iconEye.addEventListener('click', async () => {}); แค่เปลี่ยนเป็นแบบนี้
        iconEye.addEventListener('click', this.iconEyeClickListener); // <<-------------
    }

    removeIconEyeClickListener(): void {
        const iconEye = this.eyeIconRef.nativeElement; //รับ องค์ประกอบ HTML
        if (iconEye && this.iconEyeClickListener) { //ถ้าสองอย่างนี้ที่องค์ประกอบ HTML มีค่าที่ไม่ใช่ null 
            iconEye.removeEventListener('click', this.iconEyeClickListener); //ฟังก์ชัน iconEyeClickListener
        }
    }

    async changepassword(){

        let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions')! || '[]');
        const { value: password } = await Swal.fire({ // ป้อน password
            title: "Enter your password",
            input: "password",
            inputLabel: "Enter your password to confirm change password.",
            inputPlaceholder: "Enter your password.",
            inputAttributes: {
              autocapitalize: "off",
              autocorrect: "off"
            }
        });
        if (password == addUserLoginSessions[0].password) {
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
            this.router.navigate(['/main/changepassword']);
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
                title: "The password is incorrect!"                                           
            });     
        }
    }
}