import type { Metadata } from "next";

export type PageProps<T extends Record<string, string> = {}> = {
  params: T;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type GenerateMetadata<T extends Record<string, string> = {}> = (props: PageProps<T>) => Promise<Metadata>;
