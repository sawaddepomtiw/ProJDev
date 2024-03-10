import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { CommonModule } from '@angular/common';
import { AppdataService } from '../../../service/appdata.service';

@Component({
    selector: 'app-rankvote',
    standalone: true,
    templateUrl: './rankvote.component.html',
    styleUrl: './rankvote.component.scss',
    imports: [
      HeaderComponent,
      CommonModule
    ]
})
export class RankvoteComponent implements OnInit {

  imageLeft: any;
  imageRight: any;

  constructor(
    private AppdataService: AppdataService
  ){
    
  }

  ngOnInit(): void {

    this.showWinnerLose();
  }


  async showWinnerLose(){

    const container = document.querySelector('.con') as HTMLElement;
    const body = document.querySelector('.bo') as HTMLElement;
    const bodyTop = document.querySelector('.botop') as HTMLElement;
    
    const state = history.state;
    
    if (state.idIamgeLeft && state.idIamgeRight){
      
      body.classList.toggle('dishide');
      bodyTop.style.display = 'flex';
      await this.delay(300);
      body.style.transform = 'translateY(0px)';
      
      
      // await this.delay(10000);
      // bodyTop.style.display = 'none';

      let ImageModelLeft = await this.AppdataService.getImageID(state.idIamgeLeft);
      let ImageModelRight = await this.AppdataService.getImageID(state.idIamgeRight);
      
      if (state.winner){ // ถ้าฝั่งซ้ายชนะ
        
        this.imageRight = ImageModelRight[0];
        this.imageLeft = ImageModelLeft[0];
      }
      if (state.lose){ // ถ้าฝั่งขวาชนะ
        
        this.imageRight = ImageModelLeft[0];
        this.imageLeft = ImageModelRight[0];
      }
      await this.delay(600);
      container.style.overflowY = 'auto';
    } else {

      body.classList.toggle('dishide');
      await this.delay(300);
      body.style.transform = 'translateY(0px)';
      await this.delay(500);
      container.style.overflowY = 'auto';
    }
  }

  async delay(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
