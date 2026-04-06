import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';
import path from 'node:path';
import execa from 'execa';

@Injectable()
export class TenantProvisioningService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TenantProvisioningService.name);
  private readonly adminClient: PrismaClient;
  private readonly schemaPath: string;
  private readonly nameTemplate: string;
  private readonly urlTemplate?: string;
  private readonly provisioning = new Map<string, Promise<string>>();

  constructor(private readonly config: ConfigService) {
    const adminUrl = this.config.get<string>('DATABASE_ADMIN_URL') ?? this.config.get<string>('DATABASE_URL');
    if (!adminUrl) {
      throw new Error('DATABASE_ADMIN_URL or DATABASE_URL must be defined to provision tenant schemas');
    }

    this.adminClient = new PrismaClient({
      datasources: {
        db: {
          url: adminUrl,
        },
      },
    });

    const rawSchemaPath =
      this.config.get<string>('PRISMA_TENANT_SCHEMA_PATH') ??
      this.config.get<string>('PRISMA_SCHEMA_PATH') ??
      'prisma/tenant/schema.prisma';
    this.schemaPath = path.resolve(process.cwd(), rawSchemaPath);
    this.nameTemplate = this.config.get<string>('TENANT_DB_NAME_TEMPLATE') ?? 'edusphere_%s';
    const rawUrlTemplate = this.config.get<string>('TENANT_DB_URL_TEMPLATE')?.trim() ?? '';
    if (rawUrlTemplate.length > 0) {
      this.urlTemplate = rawUrlTemplate;
    }
  }

  async onModuleInit() {
    await this.adminClient.$connect();
  }

  async onModuleDestroy() {
    await this.adminClient.$disconnect();
  }

  async ensureTenantDatabase(slug: string): Promise<string> {
    const normalizedSlug = this.normalizeSlug(slug);
    if (!normalizedSlug) {
      throw new Error('Tenant slug must contain at least one alphanumeric character');
    }

    if (this.provisioning.has(normalizedSlug)) {
      return this.provisioning.get(normalizedSlug)!;
    }

    const promise = this.createAndMigrate(normalizedSlug);
    this.provisioning.set(normalizedSlug, promise);

    try {
      return await promise;
    } finally {
      this.provisioning.delete(normalizedSlug);
    }
  }

  private normalizeSlug(slug: string): string {
    return slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private buildDatabaseName(slug: string): string {
    if (this.nameTemplate.includes('%s')) {
      return this.nameTemplate.replace(/%s/g, slug);
    }
    return `${this.nameTemplate}_${slug}`;
  }

  private buildDatabaseUrl(dbName: string, slug: string): string {
    if (this.urlTemplate) {
      return this.urlTemplate.replace(/%s/g, dbName).replace(/{{slug}}/g, slug);
    }

    const baseUrl = this.config.get<string>('DATABASE_ADMIN_URL') ?? this.config.get<string>('DATABASE_URL');
    if (!baseUrl) {
      throw new Error('DATABASE_ADMIN_URL or DATABASE_URL must be set to build tenant URLs');
    }

    const url = new URL(baseUrl);
    url.pathname = `/${dbName}`;
    return url.toString();
  }

  private async createAndMigrate(slug: string): Promise<string> {
    const dbName = this.buildDatabaseName(slug);
    const dbUrl = this.buildDatabaseUrl(dbName, slug);

    if (!(await this.databaseExists(dbName))) {
      this.logger.log(`Creating tenant database ${dbName}`);
      await this.adminClient.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
    } else {
      this.logger.log(`Tenant database ${dbName} already exists`);
    }

    await this.applyMigrations(dbName, dbUrl);
    return dbUrl;
  }

  private async databaseExists(dbName: string): Promise<boolean> {
    const rows = await this.adminClient.$queryRaw<{ datname: string }[]>(
      Prisma.sql`SELECT datname FROM pg_database WHERE datname = ${dbName}`,
    );
    return rows.length > 0;
  }

  private async applyMigrations(dbName: string, databaseUrl: string) {
    this.logger.log(`Applying migrations for tenant ${dbName}`);
    try {
    await execa(
      'npx',
      [
        'prisma',
        'migrate',
        'deploy',
        '--schema',
        this.schemaPath,
      ],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
        stdio: 'pipe',
      },
    );
    } catch (error) {
      this.logger.error(`Unable to apply migrations for ${dbName}`, error as Error);
      throw error;
    }
  }
}
