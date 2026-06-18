import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import dns from "dns";
import User from "./models/user.model.js";
import Serivce from "./models/service.model.js";
import Permission from "./models/v1/auth/permission.model.js";
import Role from "./models/v1/auth/role.model.js";

// Use Google Public DNS to resolve MongoDB Atlas SRV records reliably
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const MONGO_URI = process.env.MONGO || "mongodb+srv://visaljudan:visal12345@visaljudan.alyvn.mongodb.net/cheang";

async function seed() {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }

  // Clear existing seed data to allow clean re-runs
  console.log("Clearing existing seed data...");
  await User.deleteMany({ email: /@cheang\.com$/i });
  await Serivce.deleteMany({
    $or: [
      { name: /Seed/i },
      { description: /Seed/i }
    ]
  });
  await Permission.deleteMany({});
  await Role.deleteMany({});
  console.log("Existing seed data cleared.");

  // Seeding Permissions
  console.log("Seeding Permissions...");
  const permissionsData = [
    { name: "user.read", description: "View user profile details and settings" },
    { name: "user.write", description: "Modify user profile settings" },
    { name: "service.create", description: "Create a new handyman listing" },
    { name: "service.update", description: "Edit an existing listing" },
    { name: "service.delete", description: "Delete a listing" },
    { name: "category.create", description: "Create a new booking category" },
    { name: "category.delete", description: "Permanently delete booking categories" },
    { name: "admin.dashboard", description: "Access the admin monitoring panel" },
  ];

  const savedPermissions = {};
  for (const perm of permissionsData) {
    const doc = new Permission(perm);
    const saved = await doc.save();
    savedPermissions[perm.name] = saved._id;
  }
  console.log(`${Object.keys(savedPermissions).length} permissions seeded.`);

  // Seeding Roles
  console.log("Seeding Roles...");
  const rolesData = [
    {
      name: "Client",
      description: "Standard homeowner / customer",
      permissions: [
        savedPermissions["user.read"],
        savedPermissions["user.write"],
      ],
    },
    {
      name: "Pro",
      description: "Handyman and professional service provider",
      permissions: [
        savedPermissions["user.read"],
        savedPermissions["user.write"],
        savedPermissions["service.create"],
        savedPermissions["service.update"],
        savedPermissions["service.delete"],
      ],
    },
    {
      name: "Admin",
      description: "Platform administrator with full permissions",
      permissions: Object.values(savedPermissions),
    },
  ];

  const savedRoles = {};
  for (const r of rolesData) {
    const doc = new Role(r);
    const saved = await doc.save();
    savedRoles[r.name] = saved._id;
  }
  console.log(`${rolesData.length} roles seeded.`);

  // Password hashing
  const saltRounds = 10;
  const adminPassword = bcryptjs.hashSync("AdminPass123", saltRounds);
  const clientPassword = bcryptjs.hashSync("ClientPass123", saltRounds);
  const proPassword = bcryptjs.hashSync("ProPass123", saltRounds);

  // 1. Create Admin
  console.log("Seeding Admin user...");
  const adminUser = new User({
    nameuser: "Cheang Admin Manager",
    email: "admin@cheang.com",
    password: adminPassword,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
    role: savedRoles["Admin"],
    admin: true,
    userPro: false,
    Request: false,
    Confirm: false,
  });
  const savedAdmin = await adminUser.save();
  console.log(`Admin user created: ${savedAdmin.email}`);

  // 2. Create Clients (Regular Users)
  console.log("Seeding Client users...");
  const client1 = new User({
    nameuser: "John Client",
    email: "john@cheang.com",
    password: clientPassword,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256",
    role: savedRoles["Client"],
    admin: false,
    userPro: false,
    Request: false,
    Confirm: false,
  });
  const savedClient1 = await client1.save();

  const client2 = new User({
    nameuser: "Sokha Homeowner",
    email: "sokha@cheang.com",
    password: clientPassword,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256",
    role: savedRoles["Client"],
    admin: false,
    userPro: false,
    Request: false,
    Confirm: false,
  });
  const savedClient2 = await client2.save();
  console.log(`Clients created: ${savedClient1.email}, ${savedClient2.email}`);

  // 3. Create Pro Users (Handymen / Service Providers)
  console.log("Seeding Pro users...");
  
  // Pro 1: Electrician in Phnom Penh
  const pro1 = new User({
    nameuser: "Visal Electric",
    email: "visal@cheang.com",
    password: proPassword,
    avatar: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=256&h=256",
    role: savedRoles["Pro"],
    admin: false,
    userPro: true,
    Request: true,
    Confirm: true,
    brandName: "Visal Electrical Services Ltd",
    mainService: "Electrical Services",
    subService: "Troubleshooting electrical problem",
    phone: "+855 12 888 999",
    province: "Phnom Penh",
    city: "Chamkar Mon",
    ratings: [
      { userRate: savedClient1._id.toString(), rating: 5 },
      { userRate: savedClient2._id.toString(), rating: 4 }
    ],
    comments: [
      {
        userComment: savedClient1._id.toString(),
        userName: savedClient1.nameuser,
        userAvatar: savedClient1.avatar,
        comment: "Excellent response time! Diagnosed and repaired my home wiring issue in under an hour."
      },
      {
        userComment: savedClient2._id.toString(),
        userName: savedClient2.nameuser,
        userAvatar: savedClient2.avatar,
        comment: "Very professional electrician. Arrived on time and was very tidy."
      }
    ]
  });
  const savedPro1 = await pro1.save();

  // Pro 2: Plumber in Siem Reap
  const pro2 = new User({
    nameuser: "Sophana Plumber",
    email: "sophana@cheang.com",
    password: proPassword,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256",
    role: savedRoles["Pro"],
    admin: false,
    userPro: true,
    Request: true,
    Confirm: true,
    brandName: "Sophana Plumbing Care",
    mainService: "Plumbing Solutions Service",
    subService: "Fixing leaks service",
    phone: "+855 87 654 321",
    province: "Siem Reap",
    city: "Siem Reap",
    ratings: [
      { userRate: savedClient1._id.toString(), rating: 5 }
    ],
    comments: [
      {
        userComment: savedClient1._id.toString(),
        userName: savedClient1.nameuser,
        userAvatar: savedClient1.avatar,
        comment: "Fixed our leaky kitchen pipes perfectly. Fair pricing and transparent estimate."
      }
    ]
  });
  const savedPro2 = await pro2.save();

  // Pro 3: General Repairer in Phnom Penh
  const pro3 = new User({
    nameuser: "Rathna Quick Fix",
    email: "rathna@cheang.com",
    password: proPassword,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256",
    role: savedRoles["Pro"],
    admin: false,
    userPro: true,
    Request: true,
    Confirm: true,
    brandName: "Rathna Wall Repairs & Handyman",
    mainService: "General Repairs Service",
    subService: "Repairing walls Service",
    phone: "+855 99 777 555",
    province: "Phnom Penh",
    city: "Toul Kork",
    ratings: [
      { userRate: savedClient2._id.toString(), rating: 5 }
    ],
    comments: [
      {
        userComment: savedClient2._id.toString(),
        userName: savedClient2.nameuser,
        userAvatar: savedClient2.avatar,
        comment: "Repaired the drywall damages in my living room. Smooth, matching finish. Outstanding work!"
      }
    ]
  });
  const savedPro3 = await pro3.save();

  console.log(`Pros created: ${savedPro1.email}, ${savedPro2.email}, ${savedPro3.email}`);

  // 4. Seeding Service Listings (Service Model)
  console.log("Seeding service listings...");

  const services = [
    {
      name: "Residential Wiring & Socket Replacement (Seed)",
      description: "Complete inspection of residential wiring, upgrading faulty breaker sockets, and installing new premium safety switches.",
      price: 45,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
      userRef: savedPro1._id.toString()
    },
    {
      name: "Emergency Leak Detection & Repair (Seed)",
      description: "Quick-response leak inspection using digital detectors. Fixing major leaks under sinks, bathrooms, or primary line pipes.",
      price: 35,
      image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600",
      userRef: savedPro2._id.toString()
    },
    {
      name: "Drywall Crack Patching & Painting (Seed)",
      description: "Plastering wall cracks, applying premium primers, sanding, and matching wall paint seamlessly to restore your living area.",
      price: 25,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600",
      userRef: savedPro3._id.toString()
    }
  ];

  for (const s of services) {
    const newService = new Serivce(s);
    await newService.save();
  }
  console.log("Service listings seeded successfully!");

  console.log("Seed operation finished successfully!");
  mongoose.connection.close();
}

seed();
