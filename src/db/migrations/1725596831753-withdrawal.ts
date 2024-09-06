import { MigrationInterface, QueryRunner } from "typeorm";

export class Withdrawal1725596831753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await queryRunner.query(`
            CREATE TABLE withdrawal (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),                 
                investment_id uuid NOT NULL,         
                amount DECIMAL(10, 2) NOT NULL,      
                net_amount DECIMAL(10, 2) NOT NULL,  
                tax_applied DECIMAL(10, 2) NOT NULL, 
                tax_rate DECIMAL(5, 2) NOT NULL,     
                withdrawal_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (investment_id) REFERENCES "investment"(id) ON DELETE CASCADE 
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS withdrawal;`);

    }

}
