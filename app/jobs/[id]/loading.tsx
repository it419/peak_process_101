import { CareersLoadingSwitcher } from "@/components/design/CareersLoadingSwitcher";

// Covers navigation between /jobs/[id], /jobs/[id]/apply and /jobs/[id]/applied.
export default function JobDetailLoading() {
  return <CareersLoadingSwitcher />;
}
