import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  BeforeInsert,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  receiptNumber!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column()
  issueDate!: Date;


  // Relationships
  @ManyToOne(() => User, (user) => user.receipts)
  @JoinColumn({ name: "issued_by_id" })
  issuedBy!: User;

  @BeforeInsert()
  generateReceiptNumber() {
    this.receiptNumber = `RCP-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;
  }
}
