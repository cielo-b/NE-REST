import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { ParkingEntryService } from "./parking-entry.service";
import { ApiResponse } from "../../interfaces/api-response.interface";
import { CreateParkingEntryDto } from "./dto/create-parking-entry.dto";
import { ExitParkingDto } from "./dto/exit-parking.dto";

@Route("parking-entry")
@Tags("Parking Entry")
export class ParkingEntryController extends Controller {
  private service: ParkingEntryService = new ParkingEntryService();

  @Post("/entry")
  @Security("bearerAuth", ["ATTENDANT"])
  @Response<ApiResponse>("201", "Vehicle entry recorded successfully")
  @Response<ApiResponse>("400", "Bad Request - No available spaces or vehicle already in parking")
  @Response<ApiResponse>("401", "Unauthorized")
  @Response<ApiResponse>("404", "Parking not found")
  public async createEntry(
    @Body() dto: CreateParkingEntryDto
  ): Promise<ApiResponse> {
    const response = await this.service.createEntry(dto);
    this.setStatus(response.code);
    return response;
  }

  @Post("/exit")
  @Security("bearerAuth", ["ATTENDANT"])
  @Response<ApiResponse>("200", "Vehicle exit processed successfully")
  @Response<ApiResponse>("400", "Bad Request - Vehicle already exited")
  @Response<ApiResponse>("401", "Unauthorized")
  @Response<ApiResponse>("404", "Parking entry not found")
  public async processExit(
    @Body() dto: ExitParkingDto
  ): Promise<ApiResponse> {
    const response = await this.service.processExit(dto);
    this.setStatus(response.code);
    return response;
  }

  @Get("/active")
  @Security("bearerAuth", ["ATTENDANT", "ADMIN"])
  @Response<ApiResponse>("200", "Active entries retrieved successfully")
  @Response<ApiResponse>("401", "Unauthorized")
  public async getActiveEntries(): Promise<ApiResponse> {
    const response = await this.service.getActiveEntries();
    this.setStatus(response.code);
    return response;
  }

  @Get("/report")
  @Security("bearerAuth", ["ADMIN"])
  @Response<ApiResponse>("200", "Entries retrieved successfully")
  @Response<ApiResponse>("401", "Unauthorized")
  public async getEntriesByDateRange(
    @Query() startDate: string,
    @Query() endDate: string
  ): Promise<ApiResponse> {
    const response = await this.service.getEntriesByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
    this.setStatus(response.code);
    return response;
  }

  @Post("/ticket")
  @Security("bearerAuth", ["ATTENDANT"])
  @Response<ApiResponse>("200", "Ticket generated successfully")
  @Response<ApiResponse>("401", "Unauthorized")
  @Response<ApiResponse>("404", "Parking entry not found")
  public async generateTicket(
    @Body() dto: { entryId: string }
  ): Promise<ApiResponse> {
    const response = await this.service.generateTicket(dto.entryId);
    this.setStatus(response.code);
    return response;
  }

  @Get("/bills")
  @Security("bearerAuth", ["ATTENDANT", "ADMIN"])
  @Response<ApiResponse>("200", "Bills retrieved successfully")
  @Response<ApiResponse>("401", "Unauthorized")
  public async getBills(): Promise<ApiResponse> {
    const response = await this.service.getBills();
    this.setStatus(response.code);
    return response;
  }

  @Get("/bill/{id}")
  @Security("bearerAuth", ["ATTENDANT", "ADMIN"])
  @Response<ApiResponse>("200", "Bill generated successfully")
  @Response<ApiResponse>("401", "Unauthorized")
  @Response<ApiResponse>("404", "Parking entry not found")
  public async generateBill(id: string): Promise<ApiResponse> {
    const response = await this.service.generateBill(id);
    this.setStatus(response.code);
    return response;
  }
} 