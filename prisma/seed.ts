import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un utilisateur admin
  const hashedPassword = await bcrypt.hash('password', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Administrateur',
      role: 'ADMIN',
    },
  });

  console.log('👤 Utilisateur admin créé:', admin.email);

  // Créer des citernes
  const cisterns = await Promise.all([
    prisma.truckCistern.upsert({
      where: { plate: 'BF-001-AA' },
      update: {},
      create: {
        plate: 'BF-001-AA',
        capacityL: 10000,
        calibrationDoc: 'https://example.com/calibration1.pdf',
        active: true,
      },
    }),
    prisma.truckCistern.upsert({
      where: { plate: 'BF-002-BB' },
      update: {},
      create: {
        plate: 'BF-002-BB',
        capacityL: 8000,
        calibrationDoc: 'https://example.com/calibration2.pdf',
        active: true,
      },
    }),
  ]);

  console.log('🚛 Citernes créées:', cisterns.length);

  // Créer des tracteurs
  const tractors = await Promise.all([
    prisma.truckTractor.upsert({
      where: { plate: 'BF-101-CC' },
      update: {},
      create: {
        plate: 'BF-101-CC',
        active: true,
      },
    }),
    prisma.truckTractor.upsert({
      where: { plate: 'BF-102-DD' },
      update: {},
      create: {
        plate: 'BF-102-DD',
        active: true,
      },
    }),
  ]);

  console.log('🚚 Tracteurs créés:', tractors.length);

  // Créer des chauffeurs
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: 'Amadou Traoré',
        phone: '+226 70 12 34 56',
        licenseId: 'BF123456',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Fatou Ouédraogo',
        phone: '+226 71 23 45 67',
        licenseId: 'BF234567',
      },
    }),
  ]);

  console.log('👨‍💼 Chauffeurs créés:', drivers.length);

  // Créer des destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Ouagadougou',
        routeCode: 'OUA',
        defaultToleranceL: 100,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Bobo-Dioulasso',
        routeCode: 'BOB',
        defaultToleranceL: 150,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Koudougou',
        routeCode: 'KOU',
        defaultToleranceL: 100,
      },
    }),
  ]);

  console.log('📍 Destinations créées:', destinations.length);

  // Créer des fournisseurs
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Petrole Burkina SA',
        nif: 'BF001234567',
        phone: '+226 25 30 40 50',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Total Burkina',
        nif: 'BF002345678',
        phone: '+226 25 31 41 51',
      },
    }),
  ]);

  console.log('🏭 Fournisseurs créés:', suppliers.length);

  // Créer des clients
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Station Service Centrale',
        nif: 'BF003456789',
        phone: '+226 25 32 42 52',
        paymentTerms: '30 jours',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Depot Carburant Nord',
        nif: 'BF004567890',
        phone: '+226 25 33 43 53',
        paymentTerms: '15 jours',
      },
    }),
  ]);

  console.log('🏪 Clients créés:', customers.length);

  // Créer un lot exemple
  const lot = await prisma.lot.upsert({
    where: { lotCode: 'LOT001-2024' },
    update: {},
    create: {
      lotCode: 'LOT001-2024',
      product: 'GASOIL',
      startedAt: new Date(),
      notes: 'Premier lot de démonstration',
    },
  });

  console.log('📦 Lot créé:', lot.lotCode);

  // Créer des voyages pour le lot
  const trips = await Promise.all([
    prisma.lotTrip.create({
      data: {
        lotId: lot.id,
        cisternId: cisterns[0].id,
        tractorId: tractors[0].id,
        driverId: drivers[0].id,
        destinationId: destinations[0].id,
        capacityL: 10000,
        priceBuyPerL: 500,
        freightPerL: 50,
        toleranceL: 100,
        shortageL: 80,
        priceSellPerL: 600,
        transitCfa: 50000,
        customsCfa: 30000,
        miscCfa: 10000,
        status: 'DELIVERED',
      },
    }),
    prisma.lotTrip.create({
      data: {
        lotId: lot.id,
        cisternId: cisterns[1].id,
        tractorId: tractors[1].id,
        driverId: drivers[1].id,
        destinationId: destinations[1].id,
        capacityL: 8000,
        priceBuyPerL: 500,
        freightPerL: 55,
        toleranceL: 150,
        shortageL: 120,
        priceSellPerL: 610,
        transitCfa: 40000,
        customsCfa: 25000,
        miscCfa: 5000,
        status: 'DELIVERED',
      },
    }),
  ]);

  console.log('🚛 Voyages créés:', trips.length);

  // Créer des règles de tarification
  await Promise.all([
    prisma.pricingRule.create({
      data: {
        product: 'GASOIL',
        destinationId: destinations[0].id,
        validFrom: new Date(),
        priceSellPerL: 600,
      },
    }),
    prisma.pricingRule.create({
      data: {
        product: 'GASOIL',
        destinationId: destinations[1].id,
        validFrom: new Date(),
        priceSellPerL: 610,
      },
    }),
  ]);

  console.log('💰 Règles de tarification créées');

  // Créer des règles de transport
  await Promise.all([
    prisma.transportRule.create({
      data: {
        destinationId: destinations[0].id,
        validFrom: new Date(),
        freightPerL: 50,
      },
    }),
    prisma.transportRule.create({
      data: {
        destinationId: destinations[1].id,
        validFrom: new Date(),
        freightPerL: 55,
      },
    }),
  ]);

  console.log('🚚 Règles de transport créées');

  console.log('✅ Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });