import { MigrationInterface, QueryRunner } from "typeorm";

export class InvestmentTable1725541987077 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await queryRunner.query(`
            CREATE TABLE "investment" (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                id_owner uuid NOT NULL,
                initial_amount DECIMAL(10, 2) NOT NULL CHECK (initial_amount > 0),
                creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) NOT NULL DEFAULT 'active',
                current_balance DECIMAL(10, 2) DEFAULT 0,
                
                FOREIGN KEY (id_owner) REFERENCES "user"(id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS investment;`);
    }

}
