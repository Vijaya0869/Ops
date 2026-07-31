import { supabase } from "@/integrations/supabase/client";

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
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.email) {
      console.log("No user email found, skipping notification");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    const response = await supabase.functions.invoke("send-notification", {
      body: {
        type: "deal_stage_change",
        recipientEmail: userData.user.email,
        recipientName: profile?.full_name || undefined,
        dealTitle: data.dealTitle,
        oldStage: data.oldStage,
        newStage: data.newStage,
      },
    });

    if (response.error) {
      console.error("Failed to send notification:", response.error);
    } else {
      console.log("Deal stage notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending deal notification:", error);
  }
}

export async function sendPropertyMilestoneNotification(
  data: PropertyNotificationData
) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.email) {
      console.log("No user email found, skipping notification");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    const response = await supabase.functions.invoke("send-notification", {
      body: {
        type: "property_milestone",
        recipientEmail: userData.user.email,
        recipientName: profile?.full_name || undefined,
        propertyAddress: data.propertyAddress,
        milestone: data.milestone,
      },
    });

    if (response.error) {
      console.error("Failed to send notification:", response.error);
    } else {
      console.log("Property milestone notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending property notification:", error);
  }
}
