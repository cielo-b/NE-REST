import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Audit } from "../audits/Audit";

@Entity()
export class Parking extends Audit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({unique: true})
  code!: string;

  @Column()
  numberOfAvailableSpaces!: number

  @Column()
  location!: string

  @Column()
  pricePerHour!: number;

}
