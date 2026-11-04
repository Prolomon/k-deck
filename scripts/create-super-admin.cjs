const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "it.service@kdeckprofessionalservices.com.ng";
  const rawPassword = process.env.ADMIN_PASSWORD || "Kdeck123!!!";
  const name = "IT & Systems Directorate";
  const role = "SUPER_ADMIN";

  console.log(`Connecting to database and provisioning Super Admin: ${email}...`);

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Upsert Admin Account
  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: {
      password: hashedPassword,
      name,
      role,
      updatedAt: new Date(),
    },
    create: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
    },
  });

  console.log("Super Admin Account Successfully Created / Updated in Live Database:");
  console.log({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  // 2. Also ensure an official Staff Directory record exists for the IT Systems Directorate
  const existingStaff = await prisma.staff.findFirst({
    where: { email: email.toLowerCase() },
  });

  if (!existingStaff) {
    const staff = await prisma.staff.create({
      data: {
        name: "IT & Systems Directorate",
        role: "Admin (IT Systems Directorate)",
        department: "IT Systems & Information Operations",
        email: email.toLowerCase(),
        phone: "09070573104",
        bio: "Oversees enterprise digital infrastructure, portal security, live database synchronization, access control, and information technology operations at K-DECK Professional Services.",
        image: "/images/k-deck.png",
        order: 0,
        isActive: true,
        isAdmin: true,
      },
    });
    console.log("Staff record created for Admin in live database:", staff.id);
  } else {
    console.log("Staff record already present for Admin in live database:", existingStaff.id);
  }

  console.log("\nVerifying admin login authentication test against live database...");
  const verifyAdmin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });

  const isValid = await bcrypt.compare(rawPassword, verifyAdmin.password);
  console.log(`Password verification test: ${isValid ? "PASS (Valid)" : "FAIL"}`);
}

main()
  .catch((e) => {
    console.error("Failed to provision Super Admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
