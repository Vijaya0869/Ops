import { getCurrentUser } from "@/services/auth.service";
import { fetchProfile } from "@/services/profiles.service";
import { invokeSendNotification } from "@/services/notifications.service";

interface DealNotificationData {
  dealTitle: string;
  oldStage: string;
  newStage: string;
}

interface PropertyNotificationData {
  propertyAddress: string;
  milestone: string;
}

export async function sendDealStageNotification(data: DealNotificationData) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      console.log("No user email found, skipping notification");
      return;
    }

    const profile = await fetchProfile(user.id);

    await invokeSendNotification({
      type: "deal_stage_change",
      recipientEmail: user.email,
      recipientName: profile?.full_name || undefined,
      dealTitle: data.dealTitle,
      oldStage: data.oldStage,
      newStage: data.newStage,
    });

    console.log("Deal stage notification sent successfully");
  } catch (error) {
    console.error("Error sending deal notification:", error);
  }
}

export async function sendPropertyMilestoneNotification(
  data: PropertyNotificationData
) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      console.log("No user email found, skipping notification");
      return;
    }

    const profile = await fetchProfile(user.id);

    await invokeSendNotification({
      type: "property_milestone",
      recipientEmail: user.email,
      recipientName: profile?.full_name || undefined,
      propertyAddress: data.propertyAddress,
      milestone: data.milestone,
    });

    console.log("Property milestone notification sent successfully");
  } catch (error) {
    console.error("Error sending property notification:", error);
  }
}
