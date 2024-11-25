"use strict";
import { EntitySchema } from "typeorm";

const PaidHoursSchema = new EntitySchema({
  name: "PaidHours",
  tableName: "paid_hours",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    paidHours: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    paymentType: {
      type: "varchar",
      length: 20,
      nullable: false,
      enum: ["diario", "semanal", "mensual"],
    },
    approvedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
      onDelete: "CASCADE",
    },
    approvedBy: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      nullable: true,
      onDelete: "SET NULL",
    },
  },
});

export default PaidHoursSchema;
