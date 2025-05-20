import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Parking } from "./parking.entity";
import { Vehicle } from "./vehicle.entity";


@Entity()
export class ParkingEntry {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Vehicle)
  vehicle!: Vehicle;

  @ManyToOne(() => Parking)
  parking!: Parking;

  @Column()
  plateNumber!: string;

  @CreateDateColumn()
  entryDateTime!: Date;

  @Column({ nullable: true })
  exitDateTime!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  chargedAmount!: number;

  @Column({ default: true })
  isActive!: boolean;
} 