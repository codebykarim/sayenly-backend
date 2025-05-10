import {
  PrismaClient,
  Nationality,
  BookingStatus,
  OrderStatus,
  NotificationType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
        emailVerified: true,
        phoneNumber: "+9715012345678",
        phoneNumberVerified: true,
        nationality: Nationality.EMIRATI,
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: { theme: "light", notifications: true },
        accounts: {
          create: {
            accountId: "auth0|123456",
            providerId: "auth0",
            accessToken: "mock-token-john",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        sessions: {
          create: {
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            token: "mock-session-token-john",
            createdAt: new Date(),
            updatedAt: new Date(),
            ipAddress: "192.168.1.1",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Smith",
        email: "sarah@example.com",
        emailVerified: true,
        phoneNumber: "+9715087654321",
        phoneNumberVerified: false,
        nationality: Nationality.OTHER,
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: { theme: "dark", notifications: false },
        accounts: {
          create: {
            accountId: "auth0|654321",
            providerId: "auth0",
            accessToken: "mock-token-sarah",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create Services
  const services = await Promise.all([
    prisma.services.create({
      data: {
        name: "Home Cleaning",
        description: "Professional cleaning services for your home",
        pastJobs: 145,
        serviceCardImage: "cleaning.jpg",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.services.create({
      data: {
        name: "Plumbing",
        description:
          "Expert plumbing services for residential and commercial properties",
        pastJobs: 89,
        serviceCardImage: "plumbing.jpg",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.services.create({
      data: {
        name: "Electrical Work",
        description: "Licensed electrical services for all your needs",
        pastJobs: 112,
        serviceCardImage: "electrical.jpg",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${services.length} services`);

  // Create Areas
  const areas = await Promise.all([
    prisma.areas.create({
      data: {
        name: "Dubai Marina",
        areaImage: "dubai-marina.jpg",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.areas.create({
      data: {
        name: "Downtown Dubai",
        areaImage: "downtown-dubai.jpg",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.areas.create({
      data: {
        name: "Jumeirah",
        areaImage: "jumeirah.jpg",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${areas.length} areas`);

  // Create Companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "CleanPro UAE",
        logo: "cleanpro-logo.png",
        phoneNumbers: ["+97150123456", "+97150987654"],
        emailAddresses: ["info@cleanpro.ae", "support@cleanpro.ae"],
        addresses: ["Building 4, Floor 2, Business Bay, Dubai"],
        totalEarnings: 15000.75,
        services: {
          connect: { id: services[0].id }, // Connect to Home Cleaning
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.company.create({
      data: {
        name: "FixIt Services",
        logo: "fixit-logo.png",
        phoneNumbers: ["+97150456789"],
        emailAddresses: ["contact@fixit.ae"],
        addresses: ["Office 304, Al Wasl Building, Sheikh Zayed Road, Dubai"],
        totalEarnings: 22450.25,
        services: {
          connect: [
            { id: services[1].id }, // Connect to Plumbing
            { id: services[2].id }, // Connect to Electrical Work
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${companies.length} companies`);

  // Create Projects
  const projects = await Promise.all([
    prisma.projects.create({
      data: {
        headline: "Villa Renovation in Jumeirah",
        description:
          "Complete renovation of a 5-bedroom villa with modern design elements",
        images: [
          "villa-project-1.jpg",
          "villa-project-2.jpg",
          "villa-project-3.jpg",
        ],
        address: "Jumeirah 1, Villa 42, Dubai",
        date: new Date(2023, 5, 15), // June 15, 2023
        inApp: true,
        htmlContent: {
          sections: [
            {
              title: "Overview",
              content:
                "<p>This project involved a complete renovation of a luxury villa.</p>",
            },
            {
              title: "Challenges",
              content:
                "<p>Working with existing structural elements while modernizing the space.</p>",
            },
            {
              title: "Results",
              content:
                "<p>A stunning transformation that exceeded client expectations.</p>",
            },
          ],
        },
        services: {
          connect: [
            { id: services[1].id }, // Connect to Plumbing
            { id: services[2].id }, // Connect to Electrical Work
          ],
        },
        areas: {
          connect: { id: areas[2].id }, // Connect to Jumeirah
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.projects.create({
      data: {
        headline: "Apartment Deep Cleaning",
        description:
          "Professional deep cleaning service for a 3-bedroom apartment",
        images: ["cleaning-project-1.jpg", "cleaning-project-2.jpg"],
        address: "Marina Heights Tower, Apartment 1204, Dubai Marina",
        date: new Date(2023, 8, 10), // September 10, 2023
        inApp: true,
        htmlContent: {
          sections: [
            {
              title: "Service Details",
              content:
                "<p>Our team provided a thorough deep cleaning of all rooms.</p>",
            },
            {
              title: "Special Requirements",
              content:
                "<p>The client requested eco-friendly cleaning products.</p>",
            },
            {
              title: "Outcome",
              content:
                "<p>The apartment was restored to pristine condition.</p>",
            },
          ],
        },
        services: {
          connect: { id: services[0].id }, // Connect to Home Cleaning
        },
        areas: {
          connect: { id: areas[0].id }, // Connect to Dubai Marina
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${projects.length} projects`);

  // Create Reviews
  const reviews = await Promise.all([
    prisma.reviews.create({
      data: {
        clientId: users[0].id,
        rating: 5,
        review:
          "Excellent service! Very professional and attentive to details.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.reviews.create({
      data: {
        clientId: users[1].id,
        rating: 4,
        review:
          "Good service overall. Would recommend with some minor suggestions for improvement.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${reviews.length} reviews`);

  // Create Bookings
  const bookings = await Promise.all([
    prisma.bookings.create({
      data: {
        clientId: users[0].id,
        issueDescription:
          "Need a deep cleaning for the entire apartment before guests arrive",
        attachments: ["kitchen-before.jpg", "living-room-before.jpg"],
        address: "Apartment 1204, Marina Heights Tower, Dubai Marina, Dubai",
        schedule: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
        contactNumber: "+9715012345678",
        companyId: companies[0].id,
        bookingPrice: 450.0,
        status: BookingStatus.UPCOMING,
        notes: {
          specialRequests: "Use eco-friendly cleaning products only",
          accessInstructions:
            "Building security will be notified of your arrival",
        },
        services: {
          connect: { id: services[0].id }, // Home Cleaning
        },
        areas: {
          connect: { id: areas[0].id }, // Dubai Marina
        },
        reviewId: reviews[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.bookings.create({
      data: {
        clientId: users[1].id,
        issueDescription:
          "Leaking faucet in the kitchen and bathroom needs repair",
        attachments: ["leaking-faucet.jpg"],
        address: "Villa 28, Street 15, Jumeirah 1, Dubai",
        schedule: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day in future
        contactNumber: "+9715087654321",
        companyId: companies[1].id,
        bookingPrice: 250.0,
        status: BookingStatus.UPCOMING,
        notes: {
          specialRequests: "Please bring spare parts if possible",
          accessInstructions: "Park in the visitors area",
        },
        services: {
          connect: { id: services[1].id }, // Plumbing
        },
        areas: {
          connect: { id: areas[2].id }, // Jumeirah
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.bookings.create({
      data: {
        clientId: users[0].id,
        issueDescription:
          "Electrical wiring needs to be checked in the living room",
        attachments: ["electrical-panel.jpg"],
        address: "Apartment 1204, Marina Heights Tower, Dubai Marina, Dubai",
        schedule: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days in past
        contactNumber: "+9715012345678",
        companyId: companies[1].id,
        bookingPrice: 350.0,
        status: BookingStatus.COMPLETED,
        notes: {
          workDone: "Replaced faulty wiring and installed new light fixtures",
          technicianNotes: "Recommend checking electrical panel in 6 months",
        },
        services: {
          connect: { id: services[2].id }, // Electrical Work
        },
        areas: {
          connect: { id: areas[0].id }, // Dubai Marina
        },
        reviewId: reviews[1].id,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Created 10 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Updated 5 days ago
      },
    }),
  ]);

  console.log(`Created ${bookings.length} bookings`);

  // Create Orders
  const orders = await Promise.all([
    prisma.orders.create({
      data: {
        clientId: users[0].id,
        issueDescription:
          "Need to replace all bathroom fixtures and renovate shower area",
        attachments: ["bathroom-current.jpg", "shower-area.jpg"],
        address: "Apartment 1204, Marina Heights Tower, Dubai Marina, Dubai",
        schedule: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
        contactNumber: "+9715012345678",
        companyId: companies[1].id,
        quote: 4500.0,
        status: OrderStatus.WAITING_APPROVAL,
        boq: {
          labor: 1200.0,
          materials: [
            { item: "Premium Shower Fixtures", cost: 1500.0 },
            { item: "Bathroom Tiles (10 sqm)", cost: 800.0 },
            { item: "Installation Materials", cost: 300.0 },
            { item: "Waterproofing", cost: 700.0 },
          ],
          discount: 0.0,
          tax: 0.0,
          total: 4500.0,
        },
        services: {
          connect: { id: services[1].id }, // Plumbing
        },
        areas: {
          connect: { id: areas[0].id }, // Dubai Marina
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.orders.create({
      data: {
        clientId: users[1].id,
        issueDescription:
          "Full home electrical system inspection and upgrade outdated wiring",
        attachments: ["old-wiring.jpg", "electrical-box.jpg"],
        address: "Villa 28, Street 15, Jumeirah 1, Dubai",
        schedule: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days in future
        contactNumber: "+9715087654321",
        companyId: companies[1].id,
        status: OrderStatus.WAITING_QUOTE,
        services: {
          connect: { id: services[2].id }, // Electrical Work
        },
        areas: {
          connect: { id: areas[2].id }, // Jumeirah
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${orders.length} orders`);

  // Create Notifications
  const notifications = await Promise.all([
    prisma.notifications.create({
      data: {
        userId: users[0].id,
        message: "Your booking for Home Cleaning has been confirmed!",
        read: false,
        type: NotificationType.SAYENLY,
        route: { screen: "BookingDetails", params: { id: bookings[0].id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.notifications.create({
      data: {
        userId: users[0].id,
        message: "Your cleaning service is scheduled for tomorrow at 10:00 AM",
        read: false,
        type: NotificationType.REMINDER,
        route: { screen: "BookingDetails", params: { id: bookings[0].id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.notifications.create({
      data: {
        userId: users[0].id,
        message: "A quote for your bathroom renovation has been prepared",
        read: true,
        type: NotificationType.QUOTE,
        route: { screen: "OrderDetails", params: { id: orders[0].id } },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (when read)
      },
    }),
    prisma.notifications.create({
      data: {
        userId: users[1].id,
        message: "Your plumbing service is scheduled for tomorrow",
        read: false,
        type: NotificationType.REMINDER,
        route: { screen: "BookingDetails", params: { id: bookings[1].id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${notifications.length} notifications`);

  // Create a verification
  const verification = await prisma.verification.create({
    data: {
      identifier: "email:pending@example.com",
      value: "123456",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created verification code`);

  // Create FAQs
  const faqs = await Promise.all([
    prisma.faq.create({
      data: {
        question: "How do I book a service?",
        answer:
          "You can book a service through our mobile app or website by selecting the service you need and choosing an available time slot.",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.faq.create({
      data: {
        question: "What is your cancellation policy?",
        answer:
          "You can cancel your booking up to 24 hours before the scheduled service without any charge. Late cancellations may incur a fee.",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.faq.create({
      data: {
        question: "Are your service providers verified?",
        answer:
          "Yes, all our service providers undergo thorough background checks and verification processes before joining our platform.",
        inApp: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log(`Created ${faqs.length} FAQs`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
