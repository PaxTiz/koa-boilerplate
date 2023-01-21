import { PrismaClient } from ".prisma/client";

const client = new PrismaClient();

const truncate = async () => {
  await client.user.deleteMany();
  await client.role.deleteMany();
};

const seed = async () => {
  return await truncate().then(async () => {
    console.log("Create roles");
    await client.role.create({
      data: {
        name: "default",
      },
    });
  });
};

const main = async () => {
  console.log("Start seeding");
  return seed().catch((e: Error) => e);
};

main()
  .then(() => {
    console.log("Database seeded successfully");
  })
  .catch((e) => {
    console.error("Failed to seed database because :");
    console.error(e);
  })
  .finally(() => {
    console.log("End seeding");
    client.$disconnect();
  });
