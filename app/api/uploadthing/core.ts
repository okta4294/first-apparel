import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAdminSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  catalogImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  })
    .middleware(async () => {
      const session = await getAdminSession();
      if (!session) throw new Error("Akses ditolak: Anda belum masuk sebagai admin.");
      return { adminId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.adminId, url: file.ufsUrl || file.url, key: file.key };
    }),

  sizeChartImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getAdminSession();
      if (!session) throw new Error("Akses ditolak: Anda belum masuk sebagai admin.");
      return { adminId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.adminId, url: file.ufsUrl || file.url, key: file.key };
    }),

  promoBanner: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getAdminSession();
      if (!session) throw new Error("Akses ditolak: Anda belum masuk sebagai admin.");
      return { adminId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.adminId, url: file.ufsUrl || file.url, key: file.key };
    }),

  blogThumbnail: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getAdminSession();
      if (!session) throw new Error("Akses ditolak: Anda belum masuk sebagai admin.");
      return { adminId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.adminId, url: file.ufsUrl || file.url, key: file.key };
    }),

  partnerLogo: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getAdminSession();
      if (!session) throw new Error("Akses ditolak: Anda belum masuk sebagai admin.");
      return { adminId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.adminId, url: file.ufsUrl || file.url, key: file.key };
    }),

  storeLogo: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getAdminSession();
      if (!session) throw new Error("Akses ditolak: Anda belum masuk sebagai admin.");
      return { adminId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.adminId, url: file.ufsUrl || file.url, key: file.key };
    }),

  fabricImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getAdminSession();
      if (!session) throw new Error("Akses ditolak: Anda belum masuk sebagai admin.");
      return { adminId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.adminId, url: file.ufsUrl || file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
