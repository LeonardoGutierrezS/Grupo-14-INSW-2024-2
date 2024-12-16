import { EntitySchema } from "typeorm";

const TipoSchema = new EntitySchema({
    name: "Tipo",
    tableName: "tipo",
    columns: {
        id_tipo: {
            primary: true,
            type: "int",
            generated: true,
            unique: true
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true
        }
    },
    relations: {
        inventarios: {
            target: "Inventario",
            type: "one-to-many",
            inverseSide: "tipo",
            cascade: true  // Propaga las operaciones a los inventarios relacionados
        }
    }
});

export default TipoSchema;