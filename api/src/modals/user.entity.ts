import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Audit } from "../audits/Audit";
import { Vehicle } from "./vehicle.entity";
import { ERole } from "../enums/user-role.enum";
import { Receipt } from "./receipt.entity";

@Entity("users")
export class User extends Audit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  firstname!: string;

  @Column({type: 'varchar'})
  lastname!: string

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "enum", enum: ["ADMIN", "ATTENDANT"] })
  role!: ERole;

  // relations
  @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
  vehicles!: Vehicle[];


  @OneToMany(() => Receipt, (receipt) => receipt.issuedBy)
  receipts!: Receipt[];
}
