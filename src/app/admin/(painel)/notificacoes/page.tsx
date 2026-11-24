import { PageHeader } from "@/components/ui/PageHeader";
import { PushSettings } from "@/components/admin/PushSettings";

export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return <><PageHeader title="Notificações" description="Gerencie os dispositivos que recebem avisos da Ouvidoria." /><PushSettings /></>;
}
