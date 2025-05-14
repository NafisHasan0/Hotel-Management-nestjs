import { Injectable, BadRequestException } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { UserService } from '../user/user.service';
  import { ManagementService } from '../management/management.service';
  import * as bcrypt from 'bcrypt';
  import { LoginDto } from './dtos/login.dto';

  @Injectable()
  export class AuthService {
    constructor(
      private userService: UserService,
      private managementService: ManagementService,
      private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
      const user = await this.userService.findByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }

    async validateEmployee(email: string, password: string): Promise<any> {
      const employee = await this.managementService.findByEmail(email);
      if (employee && await bcrypt.compare(password, employee.password)) {
        const { password, ...result } = employee;
        return result;
      }
      return null;
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
      const { email, password } = loginDto;
      const user = await this.validateUser(email, password);
      if (user) {
        const payload = { sub: user.user_id, email: user.email, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
      }

      const employee = await this.validateEmployee(email, password);
      if (employee) {
        const payload = { sub: employee.employee_id, email: employee.email, role: employee.role, isEmployee: true };
        return { access_token: this.jwtService.sign(payload) };
      }

      throw new BadRequestException('Invalid credentials');
    }
  }