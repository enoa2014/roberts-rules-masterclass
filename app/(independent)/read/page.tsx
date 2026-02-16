import { redirect } from "next/navigation";

export default function LegacyReadRedirectPage() {
  redirect("/reading");
}
