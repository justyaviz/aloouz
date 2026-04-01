import { getAuthViewer } from "@/lib/customer-auth";

import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const viewer = await getAuthViewer();

  return <SiteHeaderClient viewer={viewer} />;
}
