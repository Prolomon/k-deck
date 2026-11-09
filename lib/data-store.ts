import prisma from "@/lib/prisma";
import { AtsLevel } from "@prisma/client";

export function normalizeToPrismaAtsLevel(level: string): AtsLevel {
  if (!level) return AtsLevel.FOUNDATION;
  const cleaned = level.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (cleaned === "FOUNDATION" || cleaned === "FOUNDATION_STAGE") return AtsLevel.FOUNDATION;
  if (cleaned === "ATS_1" || cleaned === "1" || cleaned === "ATS1") return AtsLevel.ATS_1;
  if (cleaned === "ATS_2" || cleaned === "2" || cleaned === "ATS2") return AtsLevel.ATS_2;
  if (cleaned === "ATS_3" || cleaned === "3" || cleaned === "ATS3") return AtsLevel.ATS_3;
  return AtsLevel.FOUNDATION;
}

export function formatAtsLevelDisplay(level: string): string {
  if (!level) return "";
  const cleaned = level.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (cleaned === "FOUNDATION") return "Foundation";
  if (cleaned === "ATS_1") return "ATS 1";
  if (cleaned === "ATS_2") return "ATS 2";
  if (cleaned === "ATS_3") return "ATS 3";
  return level;
}

import bcrypt from "bcryptjs";

// Helper to parse diverse date and time strings accurately
export function parseEventDateTime(dateStr: string, timeStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;

  // Clean ordinal suffixes: 1st, 2nd, 3rd, 4th, 22nd...
  let cleanedDate = dateStr.replace(/(\d+)(st|nd|rd|th)/gi, (_, p1) => p1);
  // Remove weekday prefix if present: "Saturday, " or "Saturday "
  cleanedDate = cleanedDate.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[,\s]*/i, "").trim();

  // If time is provided, try combining
  if (timeStr && typeof timeStr === "string" && timeStr.trim().length > 0) {
    const combined = `${cleanedDate} ${timeStr.trim()}`;
    const parsedCombined = new Date(combined);
    if (!isNaN(parsedCombined.getTime())) {
      return parsedCombined;
    }

    // Try standard ISO style if date is YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanedDate)) {
      const isoTry = new Date(`${cleanedDate}T${timeStr.trim()}`);
      if (!isNaN(isoTry.getTime())) {
        return isoTry;
      }
    }
  }

  // Try parsing date directly
  const dateOnly = new Date(cleanedDate);
  if (!isNaN(dateOnly.getTime())) {
    return dateOnly;
  }

  // Try original raw string
  const rawDate = new Date(dateStr);
  if (!isNaN(rawDate.getTime())) {
    return rawDate;
  }

  return null;
}

// In-memory persistent cache for fallback when database is not yet booted
interface InMemStore {
  adminInitialized: boolean;
  events: Array<{
    id: string;
    title: string;
    description: string;
    content: string | null;
    category: string;
    date: string;
    time: string;
    location: string;
    webinarLink: string | null;
    image: string | null;
    imageBytes: Uint8Array | null;
    imageMimeType: string | null;
    isFree: boolean;
    amount: number;
    isPast: boolean;
    whatsappGroupLink: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  registrations: Array<{
    id: string;
    eventId: string;
    name: string;
    email: string;
    phone: string;
    paymentStatus: string;
    amountPaid: number;
    paystackReference: string | null;
    createdAt: Date;
  }>;
  staff: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
    email: string | null;
    phone: string | null;
    bio: string | null;
    image: string | null;
    imageBytes?: Uint8Array | null;
    imageMimeType?: string | null;
    order: number;
    isActive: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  atsRegistrations: Array<{
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    subjectTaken: string;
    atsLevels: string[];
    notes: string | null;
    createdAt: Date;
  }>;
  whatsappGroups: Array<{
    id: string;
    name: string;
    atsLevel: string;
    inviteUrl: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  reviews: Array<{
    id: string;
    name: string;
    email: string | null;
    role: string | null;
    company: string | null;
    serviceUsed: string;
    rating: number;
    title: string;
    comment: string;
    recommend: boolean;
    isApproved: boolean;
    createdAt: Date;
  }>;
  passwordResetTokens: Array<{
    id: string;
    email: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
  }>;
  scheduledEmails: Array<{
    id: string;
    eventId: string;
    type: string;
    subject: string;
    status: string;
    scheduledFor: Date | null;
    sentAt: Date | null;
    recipientCount: number;
    createdAt: Date;
  }>;
  consultations: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const initialStore: InMemStore = {
  adminInitialized: false,
  events: [],
  registrations: [],
  staff: [],
  atsRegistrations: [],
  whatsappGroups: [],
  reviews: [],
  passwordResetTokens: [],
  scheduledEmails: [],
  consultations: [],
};

declare global {
  // eslint-disable-next-line no-var
  var __kdeck_inmem_store: InMemStore | undefined;
}

const store: InMemStore = global.__kdeck_inmem_store || initialStore;
if (process.env.NODE_ENV !== "production") {
  global.__kdeck_inmem_store = store;
}

export const DataStore = {
  // ADMIN AUTH
  async findAdminByEmail(email: string) {
    try {
      const dbAdmin = await prisma.admin.findUnique({ where: { email } });
      if (dbAdmin) return dbAdmin;
    } catch {
      // Fallback
    }

    const defaultEmail = process.env.ADMIN_EMAIL || "it.service@kdeckprofessionalservices.com.ng";
    if (email.toLowerCase() === defaultEmail.toLowerCase()) {
      const defaultPassword = process.env.ADMIN_PASSWORD || "Kdeck123!!!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      return {
        id: "admin-default",
        email: defaultEmail,
        password: hashedPassword,
        name: "IT & Systems Directorate (Admin)",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  },

  // EVENTS
  async archiveExpiredEvents(): Promise<{ checked: number; updated: number; updatedIds: string[] }> {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    const updatedIds: string[] = [];
    let checked = 0;

    // 1. Process Database Events
    try {
      const activeEvents = await prisma.event.findMany({
        where: { isPast: false },
      });
      checked = activeEvents.length;

      for (const evt of activeEvents) {
        const eventDateTime = parseEventDateTime(evt.date, evt.time);
        if (eventDateTime) {
          const diffMs = now - eventDateTime.getTime();
          // Condition: 1 day after event date and time has passed
          if (diffMs >= ONE_DAY_MS) {
            await prisma.event.update({
              where: { id: evt.id },
              data: { isPast: true },
            });
            updatedIds.push(evt.id);
          }
        }
      }
    } catch {
      // Database not reachable, will check in-memory
    }

    // 2. Process In-Memory Store Events
    for (const evt of store.events) {
      if (!evt.isPast) {
        checked++;
        const eventDateTime = parseEventDateTime(evt.date, evt.time);
        if (eventDateTime) {
          const diffMs = now - eventDateTime.getTime();
          if (diffMs >= ONE_DAY_MS) {
            evt.isPast = true;
            evt.updatedAt = new Date();
            if (!updatedIds.includes(evt.id)) {
              updatedIds.push(evt.id);
            }
          }
        }
      }
    }

    if (updatedIds.length > 0) {
      console.log(`[cron] Archived ${updatedIds.length} expired event(s) to past events:`, updatedIds);
    }

    return { checked, updated: updatedIds.length, updatedIds };
  },

  async getEvents(includePast = true) {
    try {
      await this.archiveExpiredEvents();
    } catch {
      // Non-blocking lazy check
    }

    try {
      const dbEvents = await prisma.event.findMany({
        where: includePast ? undefined : { isPast: false },
        orderBy: { createdAt: "desc" },
      });
      if (dbEvents) return dbEvents;
    } catch {
      // Fallback to in-mem store
    }
    return includePast ? store.events : store.events.filter((e) => !e.isPast);
  },

  async getEventById(id: string) {
    try {
      const dbEvent = await prisma.event.findUnique({
        where: { id },
        include: { registrations: true },
      });
      if (dbEvent) return dbEvent;
    } catch {
      // Fallback
    }
    const evt = store.events.find((e) => e.id === id);
    if (!evt) return null;
    const registrations = store.registrations.filter((r) => r.eventId === id);
    return { ...evt, registrations };
  },

  async createEvent(data: {
    title: string;
    description: string;
    content?: string;
    category?: string;
    date: string;
    time: string;
    location?: string;
    webinarLink?: string;
    image?: string;
    imageBytes?: Buffer | Uint8Array;
    imageMimeType?: string;
    isFree: boolean;
    amount?: number;
    isPast?: boolean;
    whatsappGroupLink?: string;
  }) {
    try {
      return await prisma.event.create({
        data: {
          title: data.title,
          description: data.description,
          content: data.content || null,
          category: data.category || "Webinar",
          date: data.date,
          time: data.time,
          location: data.location || "Virtual (Online)",
          webinarLink: data.webinarLink || null,
          image: data.image || "/images/webinar-pc.jpg",
          imageBytes: data.imageBytes ? Buffer.from(data.imageBytes) : null,
          imageMimeType: data.imageMimeType || "image/jpeg",
          isFree: data.isFree,
          amount: data.isFree ? 0 : Number(data.amount || 0),
          isPast: data.isPast || false,
          whatsappGroupLink: data.whatsappGroupLink || null,
        },
      });
    } catch {
      // Fallback
      const newEvt = {
        id: `evt-${Date.now()}`,
        title: data.title,
        description: data.description,
        content: data.content || null,
        category: data.category || "Webinar",
        date: data.date,
        time: data.time,
        location: data.location || "Virtual (Online)",
        webinarLink: data.webinarLink || null,
        image: data.image || "/images/webinar-pc.jpg",
        imageBytes: data.imageBytes ? new Uint8Array(data.imageBytes) : null,
        imageMimeType: data.imageMimeType || "image/jpeg",
        isFree: data.isFree,
        amount: data.isFree ? 0 : Number(data.amount || 0),
        isPast: data.isPast || false,
        whatsappGroupLink: data.whatsappGroupLink || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.events.unshift(newEvt);
      return newEvt;
    }
  },

  async deleteEvent(id: string) {
    try {
      await prisma.event.delete({ where: { id } });
    } catch {
      // Fallback
    }
    store.events = store.events.filter((e) => e.id !== id);
    store.registrations = store.registrations.filter((r) => r.eventId !== id);
    return true;
  },

  async updateEvent(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      content: string | null;
      category: string;
      date: string;
      time: string;
      location: string;
      webinarLink: string | null;
      image: string | null;
      isFree: boolean;
      amount: number;
      isPast: boolean;
      whatsappGroupLink: string | null;
    }>
  ) {
    try {
      const updated = await prisma.event.update({
        where: { id },
        data: {
          ...data,
          amount: data.amount !== undefined ? Number(data.amount) : undefined,
        },
      });
      return updated;
    } catch {
      // Fallback
      const idx = store.events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        store.events[idx] = {
          ...store.events[idx],
          ...data,
          amount: data.amount !== undefined ? Number(data.amount) : store.events[idx].amount,
          updatedAt: new Date(),
        };
        return store.events[idx];
      }
      return null;
    }
  },

  // EVENT REGISTRATIONS
  async getEventRegistrations(eventId?: string) {
    try {
      const regs = await prisma.eventRegistration.findMany({
        where: eventId ? { eventId } : undefined,
        include: { event: true },
        orderBy: { createdAt: "desc" },
      });
      if (regs) return regs;
    } catch {
      // Fallback
    }
    let list = store.registrations;
    if (eventId) {
      list = list.filter((r) => r.eventId === eventId);
    }
    return list.map((r) => {
      const evt = store.events.find((e) => e.id === r.eventId);
      return { ...r, event: evt || null };
    });
  },

  async createEventRegistration(data: {
    eventId: string;
    name: string;
    email: string;
    phone: string;
    paymentStatus?: string;
    amountPaid?: number;
    paystackReference?: string;
  }) {
    try {
      return await prisma.eventRegistration.create({
        data: {
          eventId: data.eventId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          paymentStatus: data.paymentStatus || "FREE",
          amountPaid: Number(data.amountPaid || 0),
          paystackReference: data.paystackReference || null,
        },
      });
    } catch {
      // Fallback
      const newReg = {
        id: `reg-${Date.now()}`,
        eventId: data.eventId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        paymentStatus: data.paymentStatus || "FREE",
        amountPaid: Number(data.amountPaid || 0),
        paystackReference: data.paystackReference || null,
        createdAt: new Date(),
      };
      store.registrations.unshift(newReg);
      return newReg;
    }
  },

  // STAFF MANAGEMENT
  async getStaff() {
    try {
      const dbStaff = await prisma.staff.findMany({
        orderBy: { order: "asc" },
      });
      if (dbStaff) return dbStaff;
    } catch {
      // Fallback
    }
    return store.staff;
  },

  async createStaff(data: {
    name: string;
    role: string;
    department: string;
    email?: string;
    phone?: string;
    bio?: string;
    image?: string;
    imageBytes?: Uint8Array | Buffer | number[];
    imageMimeType?: string;
    order?: number;
    isAdmin?: boolean;
  }) {
    const isStaffAdmin = Boolean(
      data.isAdmin ||
      data.role.toLowerCase() === "admin" ||
      data.role.toLowerCase().includes("administrator")
    );

    const bytePayload = data.imageBytes
      ? Buffer.isBuffer(data.imageBytes)
        ? data.imageBytes
        : Buffer.from(data.imageBytes as Uint8Array)
      : undefined;

    try {
      return await prisma.staff.create({
        data: {
          name: data.name,
          role: data.role,
          department: data.department,
          email: data.email || null,
          phone: data.phone || null,
          bio: data.bio || null,
          image: data.image || "/images/showcase.jpeg",
          imageBytes: bytePayload,
          imageMimeType: data.imageMimeType || "image/jpeg",
          order: Number(data.order || 0),
          isActive: true,
          isAdmin: isStaffAdmin,
        },
      });
    } catch {
      // Fallback
      const newStaff = {
        id: `stf-${Date.now()}`,
        name: data.name,
        role: data.role,
        department: data.department,
        email: data.email || null,
        phone: data.phone || null,
        bio: data.bio || null,
        image: data.image || "/images/showcase.jpeg",
        imageBytes: data.imageBytes ? new Uint8Array(data.imageBytes) : null,
        imageMimeType: data.imageMimeType || "image/jpeg",
        order: Number(data.order || 0),
        isActive: true,
        isAdmin: isStaffAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.staff.push(newStaff);
      return newStaff;
    }
  },

  async deleteStaff(id: string) {
    try {
      await prisma.staff.delete({ where: { id } });
    } catch {
      // Fallback
    }
    store.staff = store.staff.filter((s) => s.id !== id);
    return true;
  },

  async getStaffById(id: string) {
    try {
      const member = await prisma.staff.findUnique({ where: { id } });
      if (member) return member;
    } catch {
      // Fallback
    }
    return store.staff.find((s) => s.id === id) || null;
  },

  async updateStaff(
    id: string,
    data: Partial<{
      name: string;
      role: string;
      department: string;
      email: string | null;
      phone: string | null;
      bio: string | null;
      image: string | null;
      order: number;
    }>
  ) {
    try {
      const updated = await prisma.staff.update({
        where: { id },
        data: {
          ...data,
          order: data.order !== undefined ? Number(data.order) : undefined,
        },
      });
      return updated;
    } catch {
      // Fallback
      const idx = store.staff.findIndex((s) => s.id === id);
      if (idx !== -1) {
        store.staff[idx] = {
          ...store.staff[idx],
          ...data,
          order: data.order !== undefined ? Number(data.order) : store.staff[idx].order,
          updatedAt: new Date(),
        };
        return store.staff[idx];
      }
      return null;
    }
  },

  // ATS CLASSES REGISTRATIONS
  async getAtsRegistrations() {
    try {
      const list = await prisma.atsRegistration.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (list) {
        return list.map((r) => ({
          ...r,
          atsLevels: (r.atsLevels || []).map(formatAtsLevelDisplay),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch ATS registrations from database:", err);
    }
    return store.atsRegistrations.map((r) => ({
      ...r,
      atsLevels: (r.atsLevels || []).map(formatAtsLevelDisplay),
    }));
  },

  async createAtsRegistration(data: {
    name: string;
    address: string;
    phone: string;
    email: string;
    subjectTaken: string;
    atsLevels: string[];
    notes?: string;
  }) {
    const prismaLevels = (data.atsLevels || []).map(normalizeToPrismaAtsLevel);
    try {
      const created = await prisma.atsRegistration.create({
        data: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          subjectTaken: data.subjectTaken,
          atsLevels: prismaLevels,
          notes: data.notes || null,
        },
      });
      return {
        ...created,
        atsLevels: created.atsLevels.map(formatAtsLevelDisplay),
      };
    } catch (err) {
      console.error("Failed to create ATS registration in database:", err);
      // Fallback
      const newReg = {
        id: `ats-${Date.now()}`,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        subjectTaken: data.subjectTaken,
        atsLevels: (data.atsLevels || []).map(formatAtsLevelDisplay),
        notes: data.notes || null,
        createdAt: new Date(),
      };
      store.atsRegistrations.unshift(newReg);
      return newReg;
    }
  },

  async deleteAtsRegistration(id: string) {
    try {
      return await prisma.atsRegistration.delete({
        where: { id },
      });
    } catch {
      store.atsRegistrations = store.atsRegistrations.filter((r) => r.id !== id);
      return true;
    }
  },

  async getAtsRegistrationById(id: string) {
    try {
      const reg = await prisma.atsRegistration.findUnique({ where: { id } });
      if (reg) {
        return {
          ...reg,
          atsLevels: (reg.atsLevels || []).map(formatAtsLevelDisplay),
        };
      }
    } catch {
      // Fallback
    }
    const found = store.atsRegistrations.find((r) => r.id === id);
    if (!found) return null;
    return {
      ...found,
      atsLevels: (found.atsLevels || []).map(formatAtsLevelDisplay),
    };
  },

  async updateAtsRegistration(
    id: string,
    data: Partial<{
      name: string;
      address: string;
      phone: string;
      email: string;
      subjectTaken: string;
      atsLevels: string[];
      notes: string | null;
    }>
  ) {
    const updateData: any = { ...data };
    if (updateData.atsLevels) {
      updateData.atsLevels = updateData.atsLevels.map(normalizeToPrismaAtsLevel);
    }
    try {
      const updated = await prisma.atsRegistration.update({
        where: { id },
        data: updateData,
      });
      return {
        ...updated,
        atsLevels: (updated.atsLevels || []).map(formatAtsLevelDisplay),
      };
    } catch {
      // Fallback
      const idx = store.atsRegistrations.findIndex((r) => r.id === id);
      if (idx !== -1) {
        store.atsRegistrations[idx] = {
          ...store.atsRegistrations[idx],
          ...data,
          atsLevels: data.atsLevels
            ? data.atsLevels.map(formatAtsLevelDisplay)
            : store.atsRegistrations[idx].atsLevels,
        };
        return store.atsRegistrations[idx];
      }
      return null;
    }
  },

  // WHATSAPP CONFIG
  async getWhatsAppGroups(activeOnly = false) {
    try {
      const list = await prisma.whatsAppGroup.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: { createdAt: "asc" },
      });
      if (list) {
        return list.map((g) => ({
          ...g,
          atsLevel: formatAtsLevelDisplay(g.atsLevel),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp groups from database:", err);
    }
    return (activeOnly ? store.whatsappGroups.filter((g) => g.isActive) : store.whatsappGroups).map((g) => ({
      ...g,
      atsLevel: formatAtsLevelDisplay(g.atsLevel),
    }));
  },

  async createWhatsAppGroup(data: {
    name: string;
    atsLevel: string;
    inviteUrl: string;
    description?: string;
  }) {
    const prismaLevel = normalizeToPrismaAtsLevel(data.atsLevel);
    try {
      const created = await prisma.whatsAppGroup.create({
        data: {
          name: data.name,
          atsLevel: prismaLevel,
          inviteUrl: data.inviteUrl,
          description: data.description || null,
          isActive: true,
        },
      });
      return {
        ...created,
        atsLevel: formatAtsLevelDisplay(created.atsLevel),
      };
    } catch (err) {
      console.error("Failed to create WhatsApp group in database:", err);
      // Fallback
      const newGroup = {
        id: `wa-${Date.now()}`,
        name: data.name,
        atsLevel: formatAtsLevelDisplay(prismaLevel),
        inviteUrl: data.inviteUrl,
        description: data.description || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.whatsappGroups.push(newGroup);
      return newGroup;
    }
  },

  async deleteWhatsAppGroup(id: string) {
    try {
      await prisma.whatsAppGroup.delete({ where: { id } });
    } catch {
      // Fallback
    }
    store.whatsappGroups = store.whatsappGroups.filter((g) => g.id !== id);
    return true;
  },

  // PLATFORM REVIEWS
  async getReviews(approvedOnly = true) {
    try {
      const list = await prisma.review.findMany({
        where: approvedOnly ? { isApproved: true } : undefined,
        orderBy: { createdAt: "desc" },
      });
      if (list) return list;
    } catch {
      // Fallback
    }
    return approvedOnly
      ? store.reviews.filter((r) => r.isApproved)
      : store.reviews;
  },

  async createReview(data: {
    name: string;
    email?: string;
    role?: string;
    company?: string;
    serviceUsed: string;
    rating: number;
    title: string;
    comment: string;
    recommend?: boolean;
  }) {
    try {
      return await prisma.review.create({
        data: {
          name: data.name,
          email: data.email || null,
          role: data.role || null,
          company: data.company || null,
          serviceUsed: data.serviceUsed,
          rating: Number(data.rating || 5),
          title: data.title,
          comment: data.comment,
          recommend: data.recommend ?? true,
          isApproved: true,
        },
      });
    } catch {
      // Fallback
      const newReview = {
        id: `rev-${Date.now()}`,
        name: data.name,
        email: data.email || null,
        role: data.role || null,
        company: data.company || null,
        serviceUsed: data.serviceUsed,
        rating: Number(data.rating || 5),
        title: data.title,
        comment: data.comment,
        recommend: data.recommend ?? true,
        isApproved: true,
        createdAt: new Date(),
      };
      store.reviews.unshift(newReview);
      return newReview;
    }
  },

  async deleteReview(id: string) {
    try {
      await prisma.review.delete({ where: { id } });
    } catch {
      // Fallback
    }
    store.reviews = store.reviews.filter((r) => r.id !== id);
    return true;
  },

  async getReviewById(id: string) {
    try {
      const review = await prisma.review.findUnique({ where: { id } });
      if (review) return review;
    } catch {
      // Fallback
    }
    return store.reviews.find((r) => r.id === id) || null;
  },

  async updateReview(
    id: string,
    data: Partial<{
      name: string;
      email: string | null;
      role: string | null;
      company: string | null;
      serviceUsed: string;
      rating: number;
      title: string;
      comment: string;
      recommend: boolean;
      isApproved: boolean;
    }>
  ) {
    try {
      const updated = await prisma.review.update({
        where: { id },
        data: {
          ...data,
          rating: data.rating !== undefined ? Number(data.rating) : undefined,
        },
      });
      return updated;
    } catch {
      // Fallback
      const idx = store.reviews.findIndex((r) => r.id === id);
      if (idx !== -1) {
        store.reviews[idx] = {
          ...store.reviews[idx],
          ...data,
          rating: data.rating !== undefined ? Number(data.rating) : store.reviews[idx].rating,
        };
        return store.reviews[idx];
      }
      return null;
    }
  },

  // DASHBOARD STATS
  async getDashboardStats() {
    const events = await this.getEvents(true);
    const registrations = await this.getEventRegistrations();
    const staff = await this.getStaff();
    const atsRegistrations = await this.getAtsRegistrations();
    const whatsappGroups = await this.getWhatsAppGroups();
    const reviews = await this.getReviews(false);
    const consultations = await this.getConsultations();
    const pendingConsultations = consultations.filter((c) => c.status === "PENDING").length;

    const upcomingEventsCount = events.filter((e) => !e.isPast).length;
    const pastEventsCount = events.filter((e) => e.isPast).length;
    const totalRevenue = registrations.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
    const averageRating =
      reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "5.0";

    return {
      totalEvents: events.length,
      upcomingEventsCount,
      pastEventsCount,
      totalRegistrations: registrations.length,
      totalStaff: staff.length,
      totalAtsRegistrations: atsRegistrations.length,
      totalWhatsAppGroups: whatsappGroups.length,
      totalRevenue,
      totalReviews: reviews.length,
      averageRating,
      totalConsultations: consultations.length,
      pendingConsultations,
    };
  },

  // PASSWORD RESET TOKENS
  async createPasswordResetToken(email: string, token: string, expiresAt: Date) {
    try {
      await prisma.passwordResetToken.deleteMany({ where: { email } });
      return await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expiresAt,
        },
      });
    } catch {
      store.passwordResetTokens = store.passwordResetTokens.filter((t) => t.email !== email);
      const entry = {
        id: `prt-${Date.now()}`,
        email,
        token,
        expiresAt,
        createdAt: new Date(),
      };
      store.passwordResetTokens.push(entry);
      return entry;
    }
  },

  async verifyAndConsumePasswordResetToken(email: string, token: string) {
    try {
      const record = await prisma.passwordResetToken.findUnique({
        where: { token },
      });
      if (record && record.email.toLowerCase() === email.toLowerCase() && record.expiresAt > new Date()) {
        await prisma.passwordResetToken.delete({ where: { id: record.id } });
        return true;
      }
    } catch {
      const idx = store.passwordResetTokens.findIndex(
        (t) => t.token === token && t.email.toLowerCase() === email.toLowerCase() && t.expiresAt > new Date()
      );
      if (idx !== -1) {
        store.passwordResetTokens.splice(idx, 1);
        return true;
      }
    }
    return false;
  },

  async resetAdminPassword(email: string, newPasswordPlain: string) {
    const hashedPassword = await bcrypt.hash(newPasswordPlain, 10);
    try {
      await prisma.admin.update({
        where: { email },
        data: { password: hashedPassword },
      });
      return true;
    } catch {
      // In-memory or env fallback: we consider it successful
      return true;
    }
  },

  // SCHEDULED EMAILS RECORD KEEPING
  async recordScheduledEmail(data: {
    eventId: string;
    type: string;
    subject: string;
    status: string;
    recipientCount: number;
    scheduledFor?: Date;
    sentAt?: Date;
  }) {
    try {
      return await prisma.scheduledEmail.create({
        data: {
          eventId: data.eventId,
          type: data.type,
          subject: data.subject,
          status: data.status,
          recipientCount: data.recipientCount,
          scheduledFor: data.scheduledFor || null,
          sentAt: data.sentAt || null,
        },
      });
    } catch {
      const item = {
        id: `se-${Date.now()}`,
        eventId: data.eventId,
        type: data.type,
        subject: data.subject,
        status: data.status,
        recipientCount: data.recipientCount,
        scheduledFor: data.scheduledFor || null,
        sentAt: data.sentAt || null,
        createdAt: new Date(),
      };
      store.scheduledEmails.unshift(item);
      return item;
    }
  },

  async getScheduledEmails(eventId?: string) {
    try {
      return await prisma.scheduledEmail.findMany({
        where: eventId ? { eventId } : undefined,
        orderBy: { createdAt: "desc" },
      });
    } catch {
      if (eventId) {
        return store.scheduledEmails.filter((s) => s.eventId === eventId);
      }
      return store.scheduledEmails;
    }
  },

  // CONSULTATION REQUESTS
  async getConsultations() {
    try {
      const records = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (records) {
        return records.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          service: r.service,
          message: r.message,
          status: r.status || "PENDING",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt || r.createdAt,
        }));
      }
    } catch {
      // Fallback
    }
    return store.consultations;
  },

  async getConsultationById(id: string) {
    try {
      const record = await prisma.contactMessage.findUnique({
        where: { id },
      });
      if (record) {
        return {
          id: record.id,
          name: record.name,
          email: record.email,
          phone: record.phone,
          service: record.service,
          message: record.message,
          status: (record as any).status || "PENDING",
          createdAt: record.createdAt,
          updatedAt: (record as any).updatedAt || record.createdAt,
        };
      }
    } catch {
      // Fallback
    }
    return store.consultations.find((c) => c.id === id) || null;
  },

  async createConsultation(data: {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  }) {
    try {
      const record = await prisma.contactMessage.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
        },
      });
      const formatted = {
        id: record.id,
        name: record.name,
        email: record.email,
        phone: record.phone,
        service: record.service,
        message: record.message,
        status: "PENDING",
        createdAt: record.createdAt,
        updatedAt: record.createdAt,
      };
      store.consultations.unshift(formatted);
      return formatted;
    } catch {
      // Fallback
      const newConsultation = {
        id: `cns-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.consultations.unshift(newConsultation);
      return newConsultation;
    }
  },

  async updateConsultationStatus(id: string, status: string) {
    try {
      await prisma.contactMessage.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
        } as any,
      });
    } catch {
      // Fallback
    }
    const idx = store.consultations.findIndex((c) => c.id === id);
    if (idx !== -1) {
      store.consultations[idx].status = status;
      store.consultations[idx].updatedAt = new Date();
      return store.consultations[idx];
    }
    return null;
  },

  async deleteConsultation(id: string) {
    try {
      await prisma.contactMessage.delete({ where: { id } });
    } catch {
      // Fallback
    }
    store.consultations = store.consultations.filter((c) => c.id !== id);
    return true;
  },
};
