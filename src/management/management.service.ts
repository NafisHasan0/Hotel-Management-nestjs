import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeRole } from './entities/employee.entity';
import { Management } from './entities/management.entity';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { UpdateManagementDto } from './dtos/update-management.dto';

@Injectable()
export class ManagementService {
  private readonly logger = new Logger(ManagementService.name);

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Management)
    private managementRepository: Repository<Management>,
  ) {}

  // Employee CRUD Operations
  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    this.logger.log(`Creating employee with role: ${createEmployeeDto.role}`);
    const employee = this.employeeRepository.create(createEmployeeDto);
    const savedEmployee = await this.employeeRepository.save(employee);

    // Automatically create Management record for specific roles
    const rolesRequiringManagement = [
      EmployeeRole.ADMIN,
      EmployeeRole.MANAGER,
      EmployeeRole.RECEPTIONIST,
      EmployeeRole.FLOOR_MANAGER,
      EmployeeRole.RESTAURANT_RECEPTIONIST,
    ];

    if (rolesRequiringManagement.includes(savedEmployee.role)) {
      const existingManagement = await this.managementRepository.findOne({
        where: { employee: { employee_id: savedEmployee.employee_id } },
      });
      if (existingManagement) {
        throw new ConflictException(
          `Management record already exists for Employee ID ${savedEmployee.employee_id}`,
        );
      }

      this.logger.log(
        `Creating Management record for Employee ID ${savedEmployee.employee_id}`,
      );
      const management = this.managementRepository.create({
        email: `pending_${savedEmployee.employee_id}@example.com`,
        password: '',
        employee: savedEmployee,
      }); 
      await this.managementRepository.save(management);
      this.logger.log(
        `Management record created for Employee ID ${savedEmployee.employee_id}`,
      );
    }

    return savedEmployee;
  }

  async findAllEmployees(): Promise<Employee[]> {
    this.logger.log('Fetching all employees');
    return this.employeeRepository.find({ relations: ['management'] });
  }

  async findOneEmployee(id: number): Promise<Employee> {
    this.logger.log(`Fetching employee with ID ${id}`);
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: id },
      relations: ['management'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    this.logger.log(`Updating employee with ID ${id}`);
    const employee = await this.findOneEmployee(id);
    const rolesRequiringManagement = [
      EmployeeRole.ADMIN,
      EmployeeRole.MANAGER,
      EmployeeRole.RECEPTIONIST,
      EmployeeRole.FLOOR_MANAGER,
      EmployeeRole.RESTAURANT_RECEPTIONIST,
    ];

    // If role is updated, manage Management record
    if (updateEmployeeDto.role) {
      const needsManagement = rolesRequiringManagement.includes(
        updateEmployeeDto.role,
      );
      const existingManagement = await this.managementRepository.findOne({
        where: { employee: { employee_id: id } },
      });

      if (needsManagement && !existingManagement) {
        // Create Management record if new role requires it
        this.logger.log(
          `Creating Management record for Employee ID ${id} with role ${updateEmployeeDto.role}`,
        );
        const management = this.managementRepository.create({
          email: `pending_${id}@example.com`,
          password: '',
          employee, // Use the full employee entity
        });
        const savedManagement =
          await this.managementRepository.save(management);
        this.logger.log(
          `Management record created for Employee ID ${id}, Management ID ${savedManagement.management_id}`,
        );
      } else if (!needsManagement && existingManagement) {
        // Remove Management record if new role doesn't require it
        this.logger.log(`Removing Management record for Employee ID ${id}`);
        await this.managementRepository.remove(existingManagement);
      }
    }

    Object.assign(employee, updateEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async deleteEmployee(id: number): Promise<void> {
    this.logger.log(`Deleting employee with ID ${id}`);
    const employee = await this.findOneEmployee(id);
    await this.employeeRepository.remove(employee);
  }

  // Management CRUD Operations
  async findAllManagement(): Promise<Management[]> {
    this.logger.log('Fetching all management records');
    return this.managementRepository.find({ relations: ['employee'] });
  }

  async findOneManagement(id: number): Promise<Management> {
    this.logger.log(`Fetching management record with ID ${id}`);
    const management = await this.managementRepository.findOne({
      where: { management_id: id },
      relations: ['employee'],
    });
    if (!management) {
      throw new NotFoundException(`Management with ID ${id} not found`);
    }
    return management;
  }

  async updateManagement(
    id: number,
    updateManagementDto: UpdateManagementDto,
  ): Promise<Management> {
    this.logger.log(`Updating management record with ID ${id}`);
    const management = await this.findOneManagement(id);
    if (updateManagementDto.email) {
      const emailExists = await this.managementRepository.findOne({
        where: { email: updateManagementDto.email },
      });
      if (emailExists && emailExists.management_id !== id) {
        throw new ConflictException(
          `Email ${updateManagementDto.email} is already in use`,
        );
      }
    }
    Object.assign(management, updateManagementDto);
    return this.managementRepository.save(management);
  }

  async deleteManagement(id: number): Promise<void> {
    this.logger.log(`Deleting management record with ID ${id}`);
    const management = await this.findOneManagement(id);
    await this.managementRepository.remove(management);
  }
}
