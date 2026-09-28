import { OnboardingShellSwitcher } from "@/components/design/OnboardingShellSwitcher";
import { AppFrame } from "@/components/navigation/AppFrame";

export default function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  return (
    <AppFrame>
      <OnboardingShellSwitcher>{children}</OnboardingShellSwitcher>
    </AppFrame>
  );
}
