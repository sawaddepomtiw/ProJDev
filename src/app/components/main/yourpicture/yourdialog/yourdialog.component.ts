import { ImageModel, User } from './../../../../model/getpostputdelete';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { YourpictureComponent } from '../yourpicture.component';
import { lastValueFrom, map } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppdataService } from '../../../../service/appdata.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-yourdialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, FormsModule, HttpClientModule],
  templateUrl: './yourdialog.component.html',
  styleUrls: ['./yourdialog.component.scss']
})
export class YourDialogComponent implements OnInit {
  selectedFile: File | null = null;
  textInput: string = '';
  results: any;

  
  constructor(
    public dialogRef: MatDialogRef<YourpictureComponent>,
    private http: HttpClient,
    private AppdataService: AppdataService
  ) {}

  ngOnInit(): void { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  async onOkClicked() {
    let textname = this.textInput;
    // let userEmail: string; // เก็บค่าอีเมล
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response: any = await this.http.post('http://localhost:3000/upload/image', formData).toPromise();

        
        const obj = response;
        const arr = Object.keys(obj).map(key => obj[key]);
        console.log(arr[0]);
        // console.log(response);
        let userEmail: any;
        const data = sessionStorage.getItem('addUserLoginSessions');
        if ( data != null) {
          const parsedData = JSON.parse(data);
          for (const item of parsedData) {
            userEmail = item.email; // เก็บค่าอีเมล
            console.log(userEmail);
            // console.log(typeof userEmail);
            
            break; // ออกจากการลูปเมื่อได้ค่าอีเมลครั้งแรก
          }
          const userModels: User[] = await this.AppdataService.getUserByemail(userEmail);
          let uid : any;
          for (const userModel of userModels) {
            uid = userModel.uid;
            console.log(uid);
            break;
          }
          const imageInfo = {
            uid: uid, // หรือจากที่คุณดึง UID อื่น ๆ ที่ต้องการจาก context หรือ session
            name: textname, // หรือ req.file.originalname ตามที่คุณต้องการ
            score: 500,
            voteTOTAL: 0,
            url: arr[0]
          };
          
          const countResponse: any = await this.AppdataService.getCountImg(uid);
          console.log(countResponse);

          const count: number = countResponse.count;
          console.log("countttttttttt" + count);
          
          if (count <= 5) {
            const success = await this.AppdataService.postImage(imageInfo);
            console.log("success"+success);
          }else{
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถเพิ่มรูปภาพได้ เนื่องจากเกินจำนวนที่กำหนด'
            });
            this.dialogRef.close();
          }
          console.log(textname);
        }
        this.dialogRef.close();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }
}
