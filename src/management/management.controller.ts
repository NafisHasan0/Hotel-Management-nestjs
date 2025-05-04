import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { UpdateManagementDto } from './dtos/update-management.dto';
import { Employee } from './entities/employee.entity';
import { Management } from './entities/management.entity';

@Controller('management')
export class ManagementController {
  private readonly logger = new Logger(ManagementController.name);

  constructor(private readonly managementService: ManagementService) {
    this.logger.log('ManagementController initialized');
  }

  // Employee Endpoints
  @Post('createEmployees')
  createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    this.logger.log('Creating employee');
    return this.managementService.createEmployee(createEmployeeDto);
  }

  @Get('viewAllEmployees')
  findAllEmployees(): Promise<Employee[]> {
    this.logger.log('Fetching all employees');
    return this.managementService.findAllEmployees();
  }

  @Get('viewEmployeeById/:id')
  findOneEmployee(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    this.logger.log(`Fetching employee with ID ${id}`);
    return this.managementService.findOneEmployee(id);
  }

  @Put('updateEmployeeById/:id')
  updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    this.logger.log(`Updating employee with ID ${id}`);
    return this.managementService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete('deleteEmployeeById/:id')
  deleteEmployee(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Deleting employee with ID ${id}`);
    return this.managementService.deleteEmployee(id);
  }

  // Management Endpoints
  @Get('viewAllManagements')
  findAllManagement(): Promise<Management[]> {
    this.logger.log('Fetching all management records');
    return this.managementService.findAllManagement();
  }

  @Get('viewManagementById/:id')
  findOneManagement(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Management> {
    this.logger.log(`Fetching management record with ID ${id}`);
    return this.managementService.findOneManagement(id);
  }

  @Put('updateManagementById/:id')
  updateManagement(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManagementDto: UpdateManagementDto,
  ): Promise<Management> {
    this.logger.log(`Updating management record with ID ${id}`);
    return this.managementService.updateManagement(id, updateManagementDto);
  }

  @Delete('deleteManagementById/:id')
  deleteManagement(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Deleting management record with ID ${id}`);
    return this.managementService.deleteManagement(id);
  }
}
