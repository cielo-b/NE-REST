import { Repository } from "typeorm";
import { ApiResponse } from "../../interfaces/api-response.interface";
import { ParkingEntry } from "../../modals/parking-entry.entity";
import { AppDataSource } from "../../config/data-source";
import { ApiError } from "../../errors/api-error";
import { Parking } from "../../modals/parking.entity";
import { CreateParkingEntryDto } from "./dto/create-parking-entry.dto";
import { ExitParkingDto } from "./dto/exit-parking.dto";
import { Between } from "typeorm";
import PDFDocument from "pdfkit";
import { format } from 'date-fns';

export class ParkingEntryService {
  private entryRepo: Repository<ParkingEntry> = AppDataSource.getRepository(ParkingEntry);
  private parkingRepo: Repository<Parking> = AppDataSource.getRepository(Parking);

  public async createEntry(dto: CreateParkingEntryDto): Promise<ApiResponse> {
    try {
      // Check if parking exists and has available spaces
      const parking = await this.parkingRepo.findOne({
        where: { id: dto.parkingId }
      });

      if (!parking) {
        throw ApiError.notFound("Parking not found");
      }

      if (parking.numberOfAvailableSpaces <= 0) {
        throw ApiError.badRequest("No available spaces in this parking");
      }

      // Check if vehicle is already in any parking
      const activeEntry = await this.entryRepo.findOne({
        where: {
          plateNumber: dto.plateNumber,
          isActive: true
        }
      });

      if (activeEntry) {
        throw ApiError.badRequest("Vehicle is already in a parking");
      }

      // Create new entry
      const entry = this.entryRepo.create({
        plateNumber: dto.plateNumber,
        parking,
        entryDateTime: new Date(),
        isActive: true
      });

      await this.entryRepo.save(entry);

      // Update available spaces
      parking.numberOfAvailableSpaces -= 1;
      await this.parkingRepo.save(parking);

      return {
        success: true,
        message: "Vehicle entry recorded successfully",
        data: entry,
        code: 201
      };
    } catch (error) {
      console.error("Error creating parking entry:", error);
      throw error instanceof ApiError ? error : ApiError.internal();
    }
  }

  public async processExit(dto: ExitParkingDto): Promise<ApiResponse> {
    try {
      const entry = await this.entryRepo.findOne({
        where: { id: dto.entryId },
        relations: ["parking"]
      });

      if (!entry) {
        throw ApiError.notFound("Parking entry not found");
      }

      if (!entry.isActive) {
        throw ApiError.badRequest("Vehicle has already exited");
      }

      const exitTime = new Date();
      const hours = (exitTime.getTime() - entry.entryDateTime.getTime()) / (1000 * 60 * 60);
      const chargedAmount = Math.ceil(hours) * entry.parking.pricePerHour;

      // Update entry
      entry.exitDateTime = exitTime;
      entry.chargedAmount = chargedAmount;
      entry.isActive = false;
      await this.entryRepo.save(entry);

      // Update available spaces
      entry.parking.numberOfAvailableSpaces += 1;
      await this.parkingRepo.save(entry.parking);

      return {
        success: true,
        message: "Vehicle exit processed successfully",
        data: {
          entry,
          chargedAmount,
          duration: hours
        },
        code: 200
      };
    } catch (error) {
      console.error("Error processing parking exit:", error);
      throw error instanceof ApiError ? error : ApiError.internal();
    }
  }

  public async getActiveEntries(): Promise<ApiResponse> {
    try {
      const entries = await this.entryRepo.find({
        where: { isActive: true },
        relations: ["parking"]
      });

      return {
        success: true,
        message: "Active entries retrieved successfully",
        data: entries,
        code: 200
      };
    } catch (error) {
      console.error("Error getting active entries:", error);
      throw ApiError.internal();
    }
  }

  public async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<ApiResponse> {
    try {
      const entries = await this.entryRepo.find({
        where: {
          entryDateTime: Between(startDate, endDate)
        },
        relations: ["parking"]
      });

      return {
        success: true,
        message: "Entries retrieved successfully",
        data: entries,
        code: 200
      };
    } catch (error) {
      console.error("Error getting entries by date range:", error);
      throw ApiError.internal();
    }
  }

  public async generateTicket(entryId: string): Promise<ApiResponse> {
    try {
      const entry = await this.entryRepo.findOne({
        where: { id: entryId },
        relations: ["parking"]
      });

      if (!entry) {
        throw ApiError.notFound("Parking entry not found");
      }

      // Generate HTML ticket
      const ticketHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Parking Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .ticket { border: 1px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .footer { text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h2>Parking Ticket</h2>
            </div>
            <div class="details">
              <p><strong>Plate Number:</strong> ${entry.plateNumber}</p>
              <p><strong>Parking:</strong> ${entry.parking.name}</p>
              <p><strong>Entry Time:</strong> ${entry.entryDateTime.toLocaleString()}</p>
              <p><strong>Ticket ID:</strong> ${entry.id}</p>
            </div>
            <div class="footer">
              <p>Please keep this ticket for your records</p>
            </div>
          </div>
        </body>
        </html>
      `;

      return {
        success: true,
        message: "Ticket generated successfully",
        data: ticketHtml,
        code: 200
      };
    } catch (error) {
      console.error("Error generating ticket:", error);
      throw error instanceof ApiError ? error : ApiError.internal();
    }
  }

  public async getBills(): Promise<ApiResponse> {
    try {
      const entries = await this.entryRepo.find({
        where: { isActive: false },
        relations: ["parking"],
        order: { exitDateTime: "DESC" }
      });

      return {
        success: true,
        message: "Bills retrieved successfully",
        data: entries,
        code: 200
      };
    } catch (error) {
      console.error("Error getting bills:", error);
      throw ApiError.internal();
    }
  }

  public async generateBill(id: string): Promise<ApiResponse> {
    try {
      const entry = await this.entryRepo.findOne({
        where: { id },
        relations: ["parking"]
      });

      if (!entry) {
        throw ApiError.notFound("Parking entry not found");
      }

      if (entry.isActive) {
        throw ApiError.badRequest("Cannot generate bill for active entry");
      }

      // Create PDF document
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {});

      // Add content to PDF
      doc.fontSize(20).text('Parking Bill', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Bill ID: ${entry.id}`);
      doc.text(`Plate Number: ${entry.plateNumber}`);
      doc.text(`Parking: ${entry.parking.name}`);
      doc.text(`Entry Time: ${entry.entryDateTime.toLocaleString()}`);
      doc.text(`Exit Time: ${entry.exitDateTime?.toLocaleString()}`);
      doc.text(`Amount Charged: $${entry.chargedAmount || 'N/A'}`);
      doc.moveDown();
      doc.text('Thank you for using our parking service!', { align: 'center' });

      doc.end();

      // Convert chunks to buffer
      const pdfBuffer = Buffer.concat(chunks);

      return {
        success: true,
        message: "Bill generated successfully",
        data: pdfBuffer,
        code: 200
      };
    } catch (error) {
      console.error("Error generating bill:", error);
      throw error instanceof ApiError ? error : ApiError.internal();
    }
  }

  async generateReport(startDate: Date, endDate: Date): Promise<ApiResponse> {
    try {
      const entries = await this.entryRepo.find({
        where: {
          entryDateTime: Between(startDate, endDate),
        },
        relations: ['parking'],
        order: {
          entryDateTime: 'DESC',
        },
      });

      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));

      // Add report header
      doc.fontSize(20).text('Parking Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Period: ${format(startDate, 'PP')} - ${format(endDate, 'PP')}`, { align: 'center' });
      doc.moveDown();

      // Add summary
      const totalEntries = entries.length;
      const totalRevenue = entries.reduce((sum, entry) => sum + (entry.chargedAmount || 0), 0);
      const activeEntries = entries.filter(entry => entry.isActive).length;

      doc.fontSize(14).text('Summary', { underline: true });
      doc.fontSize(12).text(`Total Entries: ${totalEntries}`);
      doc.text(`Active Entries: ${activeEntries}`);
      doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
      doc.moveDown();

      // Add entries table
      doc.fontSize(14).text('Detailed Entries', { underline: true });
      doc.moveDown();

      const tableTop = doc.y;
      const tableHeaders = ['Plate', 'Parking', 'Entry Time', 'Exit Time', 'Amount'];
      const columnWidths = [100, 150, 150, 150, 100];
      let currentY = tableTop;

      // Draw headers
      doc.fontSize(10);
      let currentX = 50;
      tableHeaders.forEach((header, i) => {
        doc.text(header, currentX, currentY);
        currentX += columnWidths[i];
      });

      // Draw entries
      currentY += 20;
      entries.forEach(entry => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        currentX = 50;
        doc.text(entry.plateNumber, currentX, currentY);
        currentX += columnWidths[0];
        doc.text(entry.parking.name, currentX, currentY);
        currentX += columnWidths[1];
        doc.text(format(new Date(entry.entryDateTime), 'PPp'), currentX, currentY);
        currentX += columnWidths[2];
        doc.text(entry.exitDateTime ? format(new Date(entry.exitDateTime), 'PPp') : 'Active', currentX, currentY);
        currentX += columnWidths[3];
        doc.text(entry.chargedAmount ? `$${entry.chargedAmount.toFixed(2)}` : '-', currentX, currentY);
        currentY += 20;
      });

      doc.end();

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve({
            success: true,
            message: 'Report generated successfully',
            data: pdfBuffer.toString('base64'),
            code: 200,
          });
        });
      });
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        success: false,
        message: 'Failed to generate report',
        error: error.message,
        code: 500,
      };
    }
  }
} 