import { redirect } from "next/navigation";

/**
 * /about redirects permanently to /about/about
 * Keeps old links and bookmarks working.
 */
export default function AboutRedirect() {
  redirect("/about/about");
}
