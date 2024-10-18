import { ResponseInterface } from '@application/api-interfaces';
import { Employee, EmployeeService, User, UsersService } from '@application/shared-api';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) {}

  // async validateUser(request: any): Promise<User> {
  //   return this.usersService.findByUuid(request.sub).then((val) => {
  //     if (val) {
  //       console.log('AuthService validateUser', val);

  //       return val;
  //     }
      
  //     return null;
  //   });
  // }

  async validateUser(request: any): Promise<Employee> {
    return this.employeeService.findByUuid(request.sub).then((val) => {
      if (val) {
        // console.log('AuthService validateUser', val);
        return val;
      }
      return null;
    });
  }

  async login(user: User): Promise<User> {
    const payload = { username: user.mobile, sub: user.uuid };
    user.accessToken = this.jwtService.sign(payload);
    // user.save()
    return user;
  }


  async loginCheck(user){

      if(user.code === 2000){
        const users = await this.usersService.findByMobile(user.data.mobile);
        const payload = { username: users.mobile, sub: users.uuid };
        users.accessToken = this.jwtService.sign(payload);
        users.save()
        return users;
      }else{
        return user;
      }
    return user;
  }


  async employeeLogin(user: any) {
    // console.log('useruseruseruseruser',user);
    
    const payload = { username: user.mobile, sub: user.uuid };
    if (user.flags.isActive) {
      user.accessToken = this.jwtService.sign(payload);
      user.save()
      return user;
    }
  }
  async verifyToken(request){

    const user = this.jwtService.verify(request.token);


    try{
      if(user.username == request.mobile){
        return {"status": true,"code" : 2000, 'data' : user}
      }else{
        return {"status": false,"code" : 2001, 'message' : 'expired'}
      }
    } catch (error) {
      return {"status": false,"code" : 5000, 'message' : 'Server error'}
    }
    return user;
}
}
