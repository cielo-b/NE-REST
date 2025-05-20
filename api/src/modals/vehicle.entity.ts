import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Audit } from "../audits/Audit";

@Entity()
export class Vehicle extends Audit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  licensePlate!: string;

  @Column()
  parkingCode!: string;

  @Column()
  entryDateTime!: Date;


   @Column({nullable: true})
  exitDateTime!: Date;

   @Column()
  chargedAmount!:Date;

  // relationships
  @ManyToOne(() => User, (user) => user.vehicles)
  owner!: User;
}
