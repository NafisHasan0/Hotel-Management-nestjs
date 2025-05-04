import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { UpdateManagementDto } from './dtos/update-management.dto';
import { Employee } from './entities/employee.entity';
import { Management } from './entities/management.entity';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  // Employee Endpoints
  @Post('employees')
  createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.managementService.createEmployee(createEmployeeDto);
  }

  @Get('employees')
  findAllEmployees(): Promise<Employee[]> {
    return this.managementService.findAllEmployees();
  }

  @Get('employees/:id')
  findOneEmployee(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.managementService.findOneEmployee(id);
  }

  @Put('employees/:id')
  updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.managementService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete('employees/:id')
  deleteEmployee(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.managementService.deleteEmployee(id);
  }

  // Management Endpoints
  @Get('management')
  findAllManagement(): Promise<Management[]> {
    return this.managementService.findAllManagement();
  }

  
  @Patch('management/:id')
  updateManagement(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManagementDto: UpdateManagementDto,
  ): Promise<Management> {
    return this.managementService.updateManagement(id, updateManagementDto);
  }

  @Delete('management/:id')
  deleteManagement(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.managementService.deleteManagement(id);
  }
}
