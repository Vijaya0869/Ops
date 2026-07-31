import { getCurrentUser } from "@/services/auth.service";
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

    await invokeSendNotification({
      type: "deal_stage_change",
      recipientEmail: user.email,
      recipientName: user.fullName || undefined,
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

    await invokeSendNotification({
      type: "property_milestone",
      recipientEmail: user.email,
      recipientName: user.fullName || undefined,
      propertyAddress: data.propertyAddress,
      milestone: data.milestone,
    });

    console.log("Property milestone notification sent successfully");
  } catch (error) {
    console.error("Error sending property notification:", error);
  }
}
