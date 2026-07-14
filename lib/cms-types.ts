export type CmsFieldType = "text" | "image";

export type CmsFieldValue = {
  type: CmsFieldType;
  value: string;
  alt?: string;
};

export type CmsPageRecord = {
  path: string;
  draft: Record<string, CmsFieldValue>;
  published: Record<string, CmsFieldValue>;
  updatedAt: string;
  publishedAt: string | null;
};

export type CmsEditableField = CmsFieldValue & {
  key: string;
  path: string;
  section: string;
  label: string;
};
