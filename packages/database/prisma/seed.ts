import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Clean the database (Optional but useful for reproducibility)
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Create Default Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Supermart',
    },
  });

  // Create Default Branch
  const branch = await prisma.branch.create({
    data: {
      tenant_id: tenant.id,
      name: 'Main HQ (Ikeja)',
      address: '123 Awolowo Way, Ikeja',
    },
  });

  // Create Default User (Admin)
  const passwordPlain = 'password123';
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(passwordPlain, saltOrRounds);

  const user = await prisma.user.create({
    data: {
      tenant_id: tenant.id,
      email: 'admin@smbportal.com',
      password_hash: hashedPassword,
    },
  });

  // Create Dummy Customers
  const customer1 = await prisma.customer.create({
    data: {
      tenant_id: tenant.id,
      name: 'Chidi Okeke',
      phone: '08012345678',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      tenant_id: tenant.id,
      name: 'Amina Bello',
      phone: '08123456789',
    },
  });

  // Create Dummy Products
  const product1 = await prisma.product.create({
    data: {
      tenant_id: tenant.id,
      name: 'Coca Cola Can',
      sku: 'COKE-01',
      price: 250.0,
      stock_level: 100,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      tenant_id: tenant.id,
      name: 'Peak Milk Refill',
      sku: 'PEAK-01',
      price: 1500.0,
      stock_level: 45,
    },
  });

  // Create Dummy Transaction
  const transaction = await prisma.transaction.create({
    data: {
      tenant_id: tenant.id,
      branch_id: branch.id,
      customer_id: customer1.id,
      subtotal: 1750.0,
      vat: 0.0,
      total: 1750.0,
      status: 'Paid',
      items: {
        create: [
          {
            description: 'Coca Cola Can',
            quantity: 1,
            unit_price: 250.0,
          },
          {
            description: 'Peak Milk Refill',
            quantity: 1,
            unit_price: 1500.0,
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log(`Test Login: admin@smbportal.com / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
