import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createLikesTable1658081867647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'likes',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'post_id', type: 'int', isNullable: false },
                { name: 'ip', type: 'varchar', isNullable: false },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('likes', true);
    }

}
