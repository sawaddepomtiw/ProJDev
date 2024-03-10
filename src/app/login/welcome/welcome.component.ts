import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ImageModel } from '../../model/getpostputdelete';
import { AppdataService } from '../../service/appdata.service';

@Component({
    selector: 'app-welcome',
    standalone: true,
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
    imports: [
      CommonModule,
      RouterModule
    ]
})
export class WelcomeComponent {

  ImageModel: ImageModel[] = [];
    randomImage1: any;
    randomImage2: any;
    randomImage11: any;
    randomImage22: any;
  
  constructor(
    private router:Router,
    private AppdataService: AppdataService,
  ) {}
  
  ngOnInit() {

    let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
    if (addUserLoginSessions.length > 0) { // เมื่อมีการ loginแล้ว ป้องกัน user พิมพ์ url localhost:4200 แล้วกลับมา login ใหม่
      this.router.navigate(['/main']);     // รวมถึง พิมพ์ localhost:4200/register ด้วย
    }

    this.searchPicture(); 
    this.clickBodyHideSelect(); //เมื่อเข้า main ให้ทำงานเลย
  }

  async searchPicture() {

    this.ImageModel = await this.AppdataService.getImage(); // ดึงข้อมูลรูปภาพโดยอนุญาติให้รอได้
    this.randomImage1 = this.getRandomElement(this.ImageModel); // สุ่มภาพแรก
    this.randomImage2 = this.getRandomElement(this.ImageModel); // สุ่มภาพที่สอง

    while (this.randomImage1 == this.randomImage2) {
        // ตรวจสอบว่ารูปภาพทั้งสองซ้ำกันหรือไม่ ถ้าซ้ำกันให้สุ่มใหม่
        this.randomImage2 = this.getRandomElement(this.ImageModel);
    }
  }

  getRandomElement(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
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

  handleImageClick(randomImage: any){

    if (randomImage){
      Swal.fire({
        title: "Are you signin now?",
        text: "You want to go to the signin page now!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, i want to go!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/signin']);
        }
      });
    }
  }
  
  async selectClick(event: any){ // click event ใน select option

    const containerSelect = document.getElementById('containerSelect') as HTMLElement;
    const selectShow = document.getElementById('selectShow') as HTMLElement;
    selectShow.click();//ให้ hamburger หรือ selectShow animation กลับเหมือนเดิม
    containerSelect.classList.remove('show');//ลบ class 'show' ใน element นั้น

    if (event.target.textContent == 'Personality'){
      this.router.navigate(['/signin']);
    } else if (event.target.textContent == 'Change password'){
      this.router.navigate(['/signin']);
    } else if (event.target.textContent == 'Your picture'){
      this.router.navigate(['/signin']);
    } else if (event.target.textContent == 'Ranks'){
      this.router.navigate(['/signin']);
    } else if (event.target.textContent == 'Sign in'){
      this.router.navigate(['/signin']);
    }
  }
}
