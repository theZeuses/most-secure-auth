import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createUsersTable1658081839808 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'username', type: 'varchar', isNullable: false, isUnique: true },
                { name: 'password', type: 'varchar', isNullable: false }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users', true);
    }

}
