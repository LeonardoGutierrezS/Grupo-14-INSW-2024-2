"use strict";
import { EntitySchema } from "typeorm";

const WorkHoursSchema = new EntitySchema({
  name: "WorkHours",
  tableName: "work_hours",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    check_in: {
      type: "timestamp with time zone",
      nullable: false,
    },
    check_out: {
      type: "timestamp with time zone",
      nullable: true, // puede ser nulo
    },
    total_hours: {
      type: "decimal",
      default: 0,
    },
    work_date: {
      type: "date",
      default: () => "CURRENT_DATE",
    },
    created_at: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      onDelete: "CASCADE",
    },
  },
});

export default WorkHoursSchema;
