import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../model/getpostputdelete';
import { AppdataService } from '../../service/appdata.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  User: User[] = [];
  profileShow: any;
  nameShow: any;

  constructor(
    private router:Router,
    private location: Location,
    private AppdataService: AppdataService
  ) {}
  
  ngOnInit() {

    this.clickBodyHideSelect(); //เมื่อเข้า main ให้ทำงานเลย
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
        this.nameShow = results.name;
      }
    }
  }

  selectShow() { // click

    const containerSelect = document.getElementById('containerSelect') as HTMLElement;
    containerSelect.classList.toggle('show'); //กดแสดง select option
  }
  clickBodyHideSelect() {

    document.addEventListener('click', (event) => { //รับ document 
      const target = event.target as HTMLElement; // click
      const containerSelect = document.getElementById('containerSelect') as HTMLElement;
      const selectShow = document.getElementById('selectShow') as HTMLElement;
    
      if (!target.closest('#rightHead')) { // ไม่ click id = "rightHead"
        if (containerSelect && containerSelect.classList.contains('show')) { //ถ้ามี containerSelect && มี class 'show' ใน element นั้น
          selectShow.click(); //ให้ hamburger หรือ selectShow animation กลับเหมือนเดิม
          containerSelect.classList.remove('show'); //ลบ class 'show' ใน element นั้น
        }
      }
    });
  }
  async selectClick(event: any){ // click event ใน select option

    const containerSelect = document.getElementById('containerSelect') as HTMLElement;
    const selectShow = document.getElementById('selectShow') as HTMLElement;
    selectShow.click();//ให้ hamburger หรือ selectShow animation กลับเหมือนเดิม
    containerSelect.classList.remove('show');//ลบ class 'show' ใน element นั้น

    if (event.target.textContent == 'Personality'){
      this.router.navigate(['/main/profile']);
    } else if (event.target.textContent == 'Change password'){

      let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions')! || '[]');

      if (this.location.path().includes('/main/changepassword')) { //ตรวจสอบว่า URL ปัจจุบันที่นำทางไปยังนั้นเป็น '/main/changepassword' หรือไม่
        return;
      }

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
        this.router.navigate([this.location.path()]);
      }
    } else if (event.target.textContent == 'Your picture'){
      this.router.navigate(['main/yourpicture']);
    } else if (event.target.textContent == 'Ranks'){
      this.router.navigate(['main/rank']);
    } else if (event.target.textContent == 'Log out'){
      this.logout();
    }
  }

  logout(){
    
    let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions')! || '[]');

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 1500
        });

        this.router.navigate(['/signin']);
        if (addUserLoginSessions.length > 0) {
          sessionStorage.clear();
        }
      }
    });
  }
}
