"use client";

import { createElement, type ComponentProps } from "react";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
const RawUploadDropzone = generateUploadDropzone<OurFileRouter>();

export function UploadDropzone(props: ComponentProps<typeof RawUploadDropzone>) {
  return createElement(RawUploadDropzone, {
    ...props,
    config: { mode: "auto", ...props.config },
  });
}
