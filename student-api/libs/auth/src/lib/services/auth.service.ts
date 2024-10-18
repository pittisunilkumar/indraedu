import { ResponseInterface, SocialAuthTypes } from '@application/api-interfaces';
import { Employee, EmployeeService, MobileUsersService, User, UsersService } from '@application/shared-api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private MobileusersService: MobileUsersService,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(request: any): Promise<any> {

    const userssss = await this.usersService.findByUuid(request.sub);
    var active = 1;

    if(userssss){


    userssss.devices?.forEach(dev => {

    if(dev?.device_id === request.deviceId && active === 1) {
        if(dev.isLoggedIn && active === 1){
              active = 0
          }else{
              active = 1
          }
          }
        });
          if(active === 0){
            return userssss
        }else{
          return null;
          //  return { "status": false, "code": 2004, 'message': 'Unathorized', 'data': {} }
        }
    }else{
      return null;

    }
  }
  // async validateUser(request: any): Promise<User> {
  //   return this.usersService.findByUuid(request.sub).then((val) => {
  //     if (val) {
  //       console.log('AuthService validateUser', val);

  //       return val;
  //     }

  //     return null;
  //   });
  // }

  async validateEmployee(request: any): Promise<Employee> {
    return this.employeeService.findByUuid(request.sub).then((val) => {
      if (val) {
        // console.log('AuthService validateUser', val);
        return val;
      }
      return null;
    });


    // return this.usersService.findByUuid(request.sub).then((val) => {
    //   if (val) {
    //     console.log('AuthService validateUser', val);

    //     return val;
    //   }
    //   return null;
    // });

  }

  async login(user: User): Promise<User> {
    const payload = { username: user.mobile, sub: user.uuid };
    user.accessToken = this.jwtService.sign(payload);
    // user.save()
    return user;
  }


  async loginCheck(user,registerUserDto){

      if(user.code === 2000){
        // const users = await this.usersService.findByMobile(user.data.mobile);
        const users = await this.usersService.findByMobileForLogin(user.data.mobile);

        const payload = { username: users.mobile, sub: users.uuid ,deviceId:registerUserDto.device_id};
        users.accessToken = this.jwtService.sign(payload);
        users.lastLoggedIn = new Date();
        users.signinType = SocialAuthTypes.MOBILE
        users.profileId = ''
        users.save()
        return {"status": true,"code" : user.code, 'message' : user.message, 'data' : users}
      }else{
        return {"status": true,"code" : user.code, 'message' : user.message, 'data' : {}}
      }
    return {"status": true,"code" : user.code, 'message' : 'verified','data' : {}}
  }

  async loginSocialCheck(user,registerUserDto){

    if(user.code === 2000){
      const users = await this.usersService.findByEmail(user.data.email);

      if(!users.signinType){
        users.signinType = SocialAuthTypes.MOBILE;
      }
      const payload = { username: users.mobile,email: users.email, sub: users.uuid ,deviceId:registerUserDto.device_id};
      users.accessToken = this.jwtService.sign(payload);
      users.lastLoggedIn = new Date();
      users.save()
      return {"status": true,"code" : user.code, 'message' : user.message, 'data' : users}
    }else{
      return {"status": true,"code" : user.code, 'message' : user.message, 'data' : {}}
    }
  return {"status": true,"code" : user.code, 'message' : 'verified','data' : {}}
}

  async verifyToken(res,body){

    // console.log(res)
    if(res.code === 2000){
    const user = this.jwtService.verify(body.token);
    // const users = await this.usersService.findByMobile(user.username);
    let users = await this.usersService.findByMobileForLogin(user.username);
    if(!user){
      users = await this.usersService.findByEmail(user.email);
    }

      // console.log(res.code,user)
    try{
      if(user.username == body.mobile || user.email == body.email){

        var notofications = await this.MobileusersService.getNotifications(users._id, body);
         
          var userData = {
            type : users.type,
            _id : users._id,
            mobile : users.mobile,
            uuid : users.uuid,
            email : users.email,
            name : users.name,
            devices : users.devices,
            accessToken : users.accessToken,
            otp : users.otp,
            signinType : users.signinType ? users.signinType: "MOBILE" ,
            profileId : users.profileId ? users.profileId : '',
            expiration_time : users.expiration_time,
            courses : users.courses,
            imgUrl : users.imgUrl ? users.imgUrl : '',
            gender : users.gender ? users.gender : 'male',
            notifications : notofications['notifications'],
            totalRecords : notofications['totalRecords'],
            currentPage : notofications['currentPage'],
            last_page   : notofications['last_page'],
            un_read   : notofications['un_read'],
          };
          return {"status": true,"code" : 2000, 'message' : 'verified','data' : userData}
        }else{
          return {"status": false,"code" : 2001, 'message' : 'expired','data':{}}
        }
      } catch (error) {
        return {"status": false,"code" : 5000, 'message' : 'Server error','data':{}}
      }
    }else{
      return res;
    }

}


  async employeeLogin(user: Employee): Promise<Employee> {
    const payload = { username: user.mobile, sub: user.uuid };
    user.accessToken = this.jwtService.sign(payload);
// console.log('useruseruseruseruser',user);

    return user;
  }

  validateApiKey(apikey: string){
      // const apiKeys : string[]  = ['1b34a532-e779-4826-a3a4-3c95feeaf9c3','7c0d3bee-4a3e-4e45-b905-1050c93d20de']
      const apiKeys: string[] = this.configService.get<string>('API_KEY')?.split(',') || [];
      return apiKeys.find((key) => apikey == key)
  }
}
