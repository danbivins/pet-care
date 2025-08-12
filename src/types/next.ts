import type { Metadata } from "next";

export type PageParams = Record<string, string>;

export type PageProps<T extends PageParams = PageParams> = {
  params: T;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type GenerateMetadata<T extends PageParams = PageParams> = (
  props: PageProps<T>
) => Promise<Metadata>;