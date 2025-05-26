import { ClientProviders } from "@/components/client-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
