import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { CommonModule, Location } from '@angular/common';
import { AppdataService } from '../../../service/appdata.service';
import { ImageModel, User } from '../../../model/getpostputdelete';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-yourpicture',
    standalone: true,
    templateUrl: './yourpicture.component.html',
    styleUrl: './yourpicture.component.scss',
    imports: [
      HeaderComponent,
      CommonModule,
      RouterModule,
      HttpClientModule,
      FormsModule
    ]
})
export class YourpictureComponent implements OnInit {

  User: User[] = [];
  ImageModel: ImageModel[] = [];
  allShow: any;
  profileShow: any;
  nameShow: any;
  selectedFile: File | null = null;
  textInput: string = '';
  results: any;

  constructor(
    private AppdataService: AppdataService,
    private router:Router,
    private location: Location,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {

    this.getImage();
    this.clickBodyHideSelect(); //เมื่อเข้า main ให้ทำงานเลย
    this.headerShow();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async onOkClicked() {
    let textname = this.textInput;
    
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response: any = await this.http.post('http://localhost:3000/upload/image', formData).toPromise();

        const obj = response;
        const arr = Object.keys(obj).map(key => obj[key]);
        let userEmail: any;        
        const data = sessionStorage.getItem('addUserLoginSessions');
        if (data != null) {
          const parsedData = JSON.parse(data);
          for (const item of parsedData) {
            userEmail = item.email; // เก็บค่าอีเมล
            break; // ออกจากการลูปเมื่อได้ค่าอีเมลครั้งแรก
          }
          const userModels: User[] = await this.AppdataService.getUserByemail(userEmail);
          let uid : any;
          for (const userModel of userModels) {
            uid = userModel.uid;            
            break;
          }
          
          const countResponse: any = await this.AppdataService.getCountImg(uid);
          // console.log(countResponse);
          
          const count: number = countResponse.count;
          console.log("countttttttttt" + count);

          console.log(arr[0]);
          
          
          
          const imageInfo = {
            uid: uid, // หรือจากที่คุณดึง UID อื่น ๆ ที่ต้องการจาก context หรือ session
            name: textname, // หรือ req.file.originalname ตามที่คุณต้องการ
            score: 1000,
            voteTOTAL: 0,
            url: arr[0]
          };
          
          if (count <= 5) {
            const success = await this.AppdataService.postImage(imageInfo);     
            console.log(success);
                   
            // if (success){
            //   Swal.fire({
            //     icon: 'success',
            //     title: 'อีซี่............',
            //     text: 'คุณเพิ่มรูปสำเร็จ'
            //   });
            // }
          }else{
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถเพิ่มรูปภาพได้ เนื่องจากเกินจำนวนที่กำหนด'
            });
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      
    }
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

  selectShow() { // click

    const containerSelect = document.getElementById('containerSelect') as HTMLElement;
    containerSelect.classList.toggle('show'); //กดแสดง select option
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
  
  async getImage() {

    let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
    this.User = await this.AppdataService.getUser();
    this.ImageModel = await this.AppdataService.getImage();

    const user = this.User.find(user => user.email == addUserLoginSessions[0].email);
    if (user) {
      this.allShow = this.ImageModel.filter(image => image.uid == user.uid);
    }
  }

}
