import { DataSource } from "typeorm";
import { User } from "../modals/user.entity";
import { Vehicle } from "../modals/vehicle.entity";
import { Parking } from "../modals/parking.entity";
import { Receipt } from "../modals/receipt.entity";
import { AuditSubscriber } from "../audits/audit.subscriber";
import { ParkingEntry } from "../modals/parking-entry.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Password@2001",
  database: "vms_2",
  synchronize: true,
  logging: true,
  entities: [User, Vehicle, Parking, Receipt, ParkingEntry],
  subscribers: [AuditSubscriber],
});
