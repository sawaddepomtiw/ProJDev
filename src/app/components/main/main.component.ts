import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from "@angular/common";
import { NavigationExtras, Router, RouterModule } from "@angular/router";
import { ImageModel, User, VoteModel } from "../../model/getpostputdelete";
import { AddUserLoginSession, AppdataService } from "../../service/appdata.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    imports: [
        HeaderComponent,
        CommonModule,
        RouterModule
    ]
})
export class MainComponent implements OnInit {
    
    User: User[] = [];
    ImageModel: ImageModel[] = [];
    VoteModel: VoteModel[] = [];
    randomImageLeft: any;
    randomImageRight: any;
    randomImageLeftShow: any;
    randomImageRightShow: any;
    showImageUserVoteLeft: any;
    showImageUserVoteRight: any;

    constructor(
        private AppdataService: AppdataService,
        private router: Router
    ) {
        
    }

    ngOnInit() {
        
        this.beforeSearchPicture();
        this.showProfileUserVote();
    }

    async showProfileUserVote(){
        this.User = await this.AppdataService.getUser();
        for (const results of this.User){
            if (results.uid == this.randomImageLeftShow.uid){
                if (results.profile == null){
                    this.showImageUserVoteLeft = 'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png';
                } else {
                    this.showImageUserVoteLeft = results.profile;
                }
            }
            if (results.uid == this.randomImageRightShow.uid){
                if (results.profile == null){
                    this.showImageUserVoteRight = 'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png';
                } else {
                    this.showImageUserVoteRight = results.profile;
                }
            }
        }        
    }
    beforeSearchPicture(){

        let keep = false;
        let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
        
        if (!keep){
            this.searchPicture();  
            
            this.randomImageLeftShow = addUserLoginSessions[1]?.randomImageLeft;
            this.randomImageRightShow = addUserLoginSessions[1]?.randomImageRight;
            
            keep = true;
        }
        if (addUserLoginSessions.length > 1) {
            addUserLoginSessions.splice(2);
            
            sessionStorage.setItem('addUserLoginSessions', JSON.stringify(addUserLoginSessions));
        }
    }
    async searchPicture() {
         
        this.ImageModel = await this.AppdataService.getImage(); // ดึงข้อมูลรูปภาพโดยอนุญาติให้รอได้
        this.randomImageLeft = this.getRandomElement(this.ImageModel); // สุ่มภาพแรก
        this.randomImageRight = this.getRandomElement(this.ImageModel); // สุ่มภาพที่สอง
        
        while (this.randomImageLeft == this.randomImageRight) {
            // ตรวจสอบว่ารูปภาพทั้งสองซ้ำกันหรือไม่ ถ้าซ้ำกันให้สุ่มใหม่
            this.randomImageRight = this.getRandomElement(this.ImageModel);
        }
        let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
        let addUserLoginSession = new AddUserLoginSession();
        addUserLoginSession.randomImageLeft = this.randomImageLeft;
        addUserLoginSession.randomImageRight = this.randomImageRight;
        addUserLoginSessions.push(addUserLoginSession); // เพิ่มข้อมูล session ลงใน array
        sessionStorage.setItem('addUserLoginSessions', JSON.stringify(addUserLoginSessions)); // บันทึกข้อมูล session ลงใน sessionStorag
        
        this.randomImageLeftShow = addUserLoginSessions[1]?.randomImageLeft;
        this.randomImageRightShow = addUserLoginSessions[1]?.randomImageRight;
    }

    // method random picture
    getRandomElement(array: any[]): any {
        return array[Math.floor(Math.random() * array.length)];
    }
    async delay(ms: number) {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    //method elo rating
    handleImageClick(winner: number) {
        
        if (winner){

            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to vote for this picture?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, I will vote!"
            }).then(async (result) => {
                if (result.isConfirmed) {

                    const kFactor = 62;
                    
                    let ImageModel1 = await this.AppdataService.getImageID(this.randomImageLeftShow.imid);
                    let ImageModel2 = await this.AppdataService.getImageID(this.randomImageRightShow.imid);

                    // getEmail from session
                    let addUserLoginSessions = JSON.parse(sessionStorage.getItem('addUserLoginSessions') || '[]');
                    let uidUservote : any;  
                    if (addUserLoginSessions != null) {
                        const userModels: User[] = await this.AppdataService.getUserByemail(addUserLoginSessions[0].email);
                        
                        for (const userModel of userModels) {
                            uidUservote = userModel.uid;
                            break;
                        }
                    }
                    
                    let eloRatingImage1 = ImageModel1[0].score; // เข้าถึง elo rating ของภาพที่ 1
                    let eloRatingImage2 = ImageModel2[0].score; // เข้าถึง elo rating ของภาพที่ 2
                    
                    let voteImage1 = ImageModel1[0].voteTOTAL; 
                    let voteImage2 = ImageModel2[0].voteTOTAL; 
                    
                    let imidImage1 = ImageModel1[0].imid; 
                    let imidImage2 = ImageModel2[0].imid; 
                    
                
                    if (winner == 1) { //ซ่าย
                        const expectedScoreImage1 = 1 / (1 + Math.pow(10, (eloRatingImage2 - eloRatingImage1) / 400));
                        let newEloRatingImage1 = eloRatingImage1 + kFactor * (1 - expectedScoreImage1);
                        let newEloRatingImage2 = eloRatingImage2 + kFactor * (0 - (1 - expectedScoreImage1));
                        
                        if (eloRatingImage1 == 0 && eloRatingImage2 == 0 ) {
                            // console.log("1");
                            newEloRatingImage2=0;
                        }else if (eloRatingImage1 ==0 && eloRatingImage2 !=0) { // ซ้าย = 0 ขวา != 0
                            // console.log("2");
                            newEloRatingImage2 = newEloRatingImage2;
                            if (newEloRatingImage2 <=0) {
                                newEloRatingImage2=0
                            }
                        }else if (eloRatingImage1 !=0 && eloRatingImage2 ==0) {
                            // console.log("3");
                            newEloRatingImage1 = newEloRatingImage1;
                            if (newEloRatingImage2 <=0) {
                                newEloRatingImage2=0;
                            }
                        }else{
                            // console.log("4");
                            newEloRatingImage1 = newEloRatingImage1;
                            newEloRatingImage2 = newEloRatingImage2;
                            if (newEloRatingImage2 <=0) {
                                
                                newEloRatingImage2 = 0;
                            }
                        }
                        
                        eloRatingImage1 = newEloRatingImage1;//vote ของเก่า + 1
                        voteImage1 += 1;
                        eloRatingImage2 = newEloRatingImage2;
                        const body1 = {
                            score : eloRatingImage1,
                            voteTOTAL : voteImage1,
                        };
                        const body2 = {
                            score : eloRatingImage2,
                        };
                        const userVoteWin = {
                            uid : uidUservote,
                            imid : imidImage1,
                            status: 1
                        } 
                        const userVoteLose = {
                            uid : uidUservote,
                            imid : imidImage2,
                            status: 0
                        } 

                        await this.AppdataService.putImagescore(this.randomImageLeftShow.imid, body1); 
                        await this.AppdataService.putImagescore(this.randomImageRightShow.imid, body2); 
                        await this.AppdataService.postVote(userVoteWin); 
                        await this.AppdataService.postVote(userVoteLose); 

                        const containerImageVote = document.getElementById('containerImageVote') as HTMLElement;
                        containerImageVote.classList.toggle('none');
                        const navigationExtras: NavigationExtras = {
                            state: {
                                winner: 'winner',
                                idIamgeLeft: this.randomImageLeftShow.imid,
                                idIamgeRight: this.randomImageRightShow.imid
                            }
                        };      
                                          
                        this.router.navigate(['/main/rank'], navigationExtras);
            
                    } else if (winner == 2) { //ขวา
                        
                        const expectedScoreImage2 = 1 / (1 + Math.pow(10, (eloRatingImage1 - eloRatingImage2) / 400));
                        let newEloRatingImage2 = eloRatingImage2 + kFactor * (1 - expectedScoreImage2);
                        let newEloRatingImage1 = eloRatingImage1 + kFactor * (0 - (1 - expectedScoreImage2));
                        if (eloRatingImage2==0 && eloRatingImage1 == 0 ) {
                            // console.log("1");
                            newEloRatingImage1=0;
                        }else if (eloRatingImage2 ==0 && eloRatingImage1 !=0) { // ซ้าย = 0 ขวา != 0
                            // console.log("2");
                            newEloRatingImage1 = newEloRatingImage1;
                            if (newEloRatingImage1 <=0) {
                                newEloRatingImage1=0
                            }
                        }else if (eloRatingImage2 !=0 && eloRatingImage1 ==0) {
                            // console.log("3");
                            newEloRatingImage2 = newEloRatingImage2;
                            if (newEloRatingImage1 <=0) {
                                newEloRatingImage1=0;
                            }
                        }else{
                            // console.log("4");
                            newEloRatingImage2 = newEloRatingImage2;
                            newEloRatingImage1 = newEloRatingImage1;
                            if (newEloRatingImage1 <= 0) {
                                
                                newEloRatingImage1 = 0;
                            }
                        }
                        
                        eloRatingImage1 = newEloRatingImage1;
                        eloRatingImage2 = newEloRatingImage2;    
                        voteImage2 +=1;     
            
                        const body1 = {
                            score : eloRatingImage1,
                        };
                        const body2 = {
                            score : eloRatingImage2,
                            voteTOTAL : voteImage2,
                        }; 
                        const userVoteWin = {
                            uid : uidUservote,
                            imid : imidImage2,
                            status: 1
                        }
                        const userVoteLose = {
                            uid : uidUservote,
                            imid : imidImage1,
                            status: 0
                        }
                        await this.AppdataService.putImagescore(this.randomImageLeftShow.imid, body1); 
                        await this.AppdataService.putImagescore(this.randomImageRightShow.imid, body2); 
                        await this.AppdataService.postVote(userVoteWin);
                        await this.AppdataService.postVote(userVoteLose);

                        const containerImageVote = document.getElementById('containerImageVote') as HTMLElement;
                        containerImageVote.classList.toggle('none');
                        const navigationExtras: NavigationExtras = {
                        state: {
                            lose: 'lose',
                            idIamgeRight: this.randomImageRightShow.imid,
                            idIamgeLeft: this.randomImageLeftShow.imid
                        }
                        };                        
                        this.router.navigate(['/main/rank'], navigationExtras);
                    }
                
                    // refresh ภาพหลังจากผู้ใช้ทำการเลือกแล้ว
                    let keep = false;
            
                    if (!keep){
                        this.searchPicture();  
                        
                        this.randomImageLeftShow = addUserLoginSessions[1]?.randomImageLeft;
                        this.randomImageRightShow = addUserLoginSessions[1]?.randomImageRight;
            
                        keep = true;
                    }
                    if (addUserLoginSessions.length > 0) {
                        addUserLoginSessions.splice(1);
                
                        sessionStorage.setItem('addUserLoginSessions', JSON.stringify(addUserLoginSessions));
                    }
                }
            });
        }
    }
}