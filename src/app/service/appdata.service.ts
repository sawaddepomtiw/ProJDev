import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User,ImageModel } from '../model/getpostputdelete';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class AppdataService {

  keepUserEmail = Array<KeepUserEmail>();
  addUserLoginSession = Array<AddUserLoginSession>();

  constructor(
    private constants: Constants,
    private http: HttpClient
  ) {}
  //  =================================================================
  public async sendEmailOtp(emailData: any) {
    
    const url = `${this.constants.API_ENDPOINT}/send-otp`;
    await lastValueFrom(this.http.post(url, emailData));    
  }
  //  =================================================================

  //table User
  public async getUser() {
    
    const url = `${this.constants.API_ENDPOINT}/tableUser/get-TableUser`;
    const response = await lastValueFrom(this.http.get(url));    
    return response as User[];
  }
  public async postUser(registerData: any) {
    
    const url = `${this.constants.API_ENDPOINT}/tableUser/post-TableUser`;
    const response = await lastValueFrom(this.http.post(url, registerData));    
    return response as User[];
  }
  //table User

  //table Image
  public async getImage(){
    
    const url = `${this.constants.API_ENDPOINT}/tableImage/select-all`;
    const response = await lastValueFrom(this.http.get(url));
    return response as ImageModel[];
  }
  public async getImageID(id: any) {

    const url = `${this.constants.API_ENDPOINT}/tableImage/select/${id}`;
    const response = await lastValueFrom(this.http.get(url));
    return response as ImageModel[];
  }
  public async putImagescore(id: any, scorevote : any) {

    const url = `${this.constants.API_ENDPOINT}/tableImage/${id}`;
    const response = await lastValueFrom(this.http.put(url, scorevote));
    return response as ImageModel[];
  }
  async getUserByemail(email: string) {
    const url = `${this.constants.API_ENDPOINT}/tableImage/selectemail`;
    const response = await lastValueFrom(this.http.get<User[]>(url, { params: { email: email } }));
    return response;
  }
  public async postImage(Imgdata : any){
    const url = `${this.constants.API_ENDPOINT}/tableImage/insertImg`;
    const response = await lastValueFrom(this.http.post(url, Imgdata));     
    return response;
  }
  public async getCountImg(uid : any){
    const url = `${this.constants.API_ENDPOINT}/tableImage/count/${uid}`;
    const response = await lastValueFrom(this.http.get(url));
    return response;
  }
  //table Image
  
  //table Vote
  public async postVote(Votedata : any){
    const url = `${this.constants.API_ENDPOINT}/tableVote/insertVote`;
    const response = await lastValueFrom(this.http.post(url, Votedata));
    return response;
  }
  //table Vote
}

export class KeepUserEmail {

  email : string = '';
  password : string = '';
}
export class AddUserLoginSession {

  email : string = '';
  password : string = '';
  randomImageLeft: any;
  randomImageRight: any;
}
