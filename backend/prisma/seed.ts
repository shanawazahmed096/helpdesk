import 'dotenv/config';
import bcrypt from 'bcrypt';

import {
  PrismaClient,
  TicketPriority,
  TicketStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be configured before running the seed.');
}


const roles = [
  {
    code: "ADMIN",
    name: "Administrator",
    description: "Full platform access.",
  },
  {
    code: "MANAGER",
    name: "Manager",
    description: "Department and ticket oversight.",
  },
  {
    code: "AGENT",
    name: "Agent",
    description: "Ticket resolution and customer support.",
  },
];

const departments = [
  { name: 'Customer Support', description: 'General customer assistance.' },
  { name: 'Technical Support', description: 'Product and integration support.' },
  { name: 'Billing', description: 'Invoices, subscriptions, and payments.' },
];

const agentProfiles = [
  ['Ava', 'Patel', 'ava.patel@example.com', 'Customer Support'],
  ['Noah', 'Sharma', 'noah.sharma@example.com', 'Technical Support'],
  ['Mia', 'Johnson', 'mia.johnson@example.com', 'Billing'],
  ['Liam', 'Williams', 'liam.williams@example.com', 'Customer Support'],
  ['Sophia', 'Brown', 'sophia.brown@example.com', 'Technical Support'],
] as const;

const categoryDefinitions = [
  ['General Inquiry', 'Questions about using the helpdesk service.'],
  ['Technical Issue', 'Product defects, configuration, and integrations.'],
  ['Billing & Subscription', 'Invoices, refunds, and subscription changes.'],
  ['Account Assistance', 'Profile, access, and account management requests.'],
  ['Feature Request', 'Ideas for product improvements.'],
] as const;

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name, description: role.description, deletedAt: null },
      create: role,
    });
  }

  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department.name },
      update: { description: department.description, deletedAt: null },
      create: department,
    });
  }

  const [adminRole, managerRole, agentRole] = await Promise.all([
    prisma.role.findUniqueOrThrow({ where: { code: "ADMIN" } }),
    prisma.role.findUniqueOrThrow({ where: { code: "MANAGER" } }),
    prisma.role.findUniqueOrThrow({ where: { code: "AGENT" } }),
  ]);
  const departmentRecords = await prisma.department.findMany();
  const departmentByName = new Map(departmentRecords.map((department) => [department.name, department]));

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { firstName: 'System', lastName: 'Admin', passwordHash, roleId: adminRole.id, deletedAt: null },
    create: { firstName: 'System', lastName: 'Admin', email: 'admin@example.com', passwordHash, roleId: adminRole.id },
  });
  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: { firstName: 'Riya', lastName: 'Mehta', passwordHash, roleId: managerRole.id, deletedAt: null },
    create: { firstName: 'Riya', lastName: 'Mehta', email: 'manager@example.com', passwordHash, roleId: managerRole.id },
  });

  for (const [firstName, lastName, email, departmentName] of agentProfiles) {
    const department = departmentByName.get(departmentName);
    if (!department) throw new Error(`Missing seeded department: ${departmentName}`);
    await prisma.user.upsert({
      where: { email },
      update: { firstName, lastName, passwordHash, roleId: agentRole.id, departmentId: department.id, deletedAt: null },
      create: { firstName, lastName, email, passwordHash, roleId: agentRole.id, departmentId: department.id },
    });
  }

  const agents = await prisma.user.findMany({ where: { roleId: agentRole.id, deletedAt: null }, orderBy: { email: 'asc' } });
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@example.com' } });
  for (const [index, [name, description]] of categoryDefinitions.entries()) {
    const department =
      departmentRecords[index % departmentRecords.length];

    await prisma.category.upsert({
      where: {
        departmentId_name: {
          departmentId: department.id,
          name,
        },
      },
      update: {
        description,
        departmentId: department.id,
        assignedAgentId: agents[index]?.id,
        deletedAt: null,
      },
      create: {
        name,
        description,
        departmentId: department.id,
        assignedAgentId: agents[index]?.id,
      },
    });
  }

  const categories = await prisma.category.findMany({ where: { deletedAt: null }, orderBy: { name: 'asc' } });
  const priorities = [TicketPriority.LOW, TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.URGENT];
  const statuses = [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.ON_HOLD, TicketStatus.RESOLVED, TicketStatus.CLOSED, TicketStatus.REOPENED];

  for (let index = 1; index <= 20; index += 1) {
    const category = categories[(index - 1) % categories.length];
    const agent = agents[(index - 1) % agents.length];
    if (!category || !agent) throw new Error('Seed categories and agents must be available before tickets are created.');
    const status = statuses[(index - 1) % statuses.length];
    await prisma.ticket.upsert({
      where: { ticketNumber: `HD-${String(index).padStart(5, '0')}` },
      update: {
        subject: `Demo helpdesk request ${index}`,
        description: `Seeded demonstration ticket ${index} for ${category.name}.`,
        customerName: `Customer ${index}`,
        customerEmail: `customer${index}@example.com`,
        priority: priorities[(index - 1) % priorities.length],
        status,
        departmentId: category.departmentId,
        categoryId: category.id,
        createdById: admin.id,
        assignedToId: agent.id,
        dueDate: new Date(Date.now() + index * 86_400_000),
        resolvedAt: status === TicketStatus.RESOLVED ? new Date() : null,
        closedAt: status === TicketStatus.CLOSED ? new Date() : null,
        deletedAt: null,
      },
      create: {
        ticketNumber: `HD-${String(index).padStart(5, '0')}`,
        subject: `Demo helpdesk request ${index}`,
        description: `Seeded demonstration ticket ${index} for ${category.name}.`,
        customerName: `Customer ${index}`,
        customerEmail: `customer${index}@example.com`,
        priority: priorities[(index - 1) % priorities.length],
        status,
        departmentId: category.departmentId,
        categoryId: category.id,
        createdById: admin.id,
        assignedToId: agent.id,
        dueDate: new Date(Date.now() + index * 86_400_000),
        resolvedAt: status === TicketStatus.RESOLVED ? new Date() : undefined,
        closedAt: status === TicketStatus.CLOSED ? new Date() : undefined,
      },
    });
  }
}

main()
  .then(() => console.info('Database seed completed successfully.'))
  .catch((error: unknown) => {
    console.error('Database seed failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
