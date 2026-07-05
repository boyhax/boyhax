// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
var jobs = defineCollection({
  name: "jobs",
  directory: "content/jobs",
  include: "**/*.md",
  schema: z.object({
    jobTitle: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    company: z.string(),
    location: z.string(),
    tags: z.array(z.string()),
    content: z.string()
  })
});
var education = defineCollection({
  name: "education",
  directory: "content/education",
  include: "**/*.md",
  schema: z.object({
    school: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string()
  })
});
var posts = defineCollection({
  name: "posts",
  directory: "content/blog",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    summary: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    author: z.string(),
    lang: z.string().default("ar"),
    tags: z.array(z.string()),
    keywords: z.array(z.string()),
    ogImage: z.string().optional(),
    content: z.string()
  })
});
var content_collections_default = defineConfig({
  collections: [jobs, education, posts]
});
export {
  content_collections_default as default
};
