import { EntitySchema } from "typeorm";

const MarcaSchema = new EntitySchema({
    name: "Categoria",
    tableName: "categorias",
    columns: {
        id_categoria: {
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
            inverseSide: "categoria",
            cascade: true  // Propaga las operaciones a los inventarios relacionados
        }
    }
});

export default MarcaSchema;