import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "deal_stage_change" | "property_milestone";
  recipientEmail: string;
  recipientName?: string;
  // Deal notification fields
  dealTitle?: string;
  oldStage?: string;
  newStage?: string;
  // Property notification fields
  propertyAddress?: string;
  milestone?: string;
}

const stageLabels: Record<string, string> = {
  lead: "Lead",
  analyzing: "Analyzing",
  offer_made: "Offer Made",
  under_contract: "Under Contract",
  due_diligence: "Due Diligence",
  closed: "Closed",
  dead: "Dead",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    
    let subject = "";
    let html = "";

    if (data.type === "deal_stage_change") {
      const oldLabel = stageLabels[data.oldStage || ""] || data.oldStage;
      const newLabel = stageLabels[data.newStage || ""] || data.newStage;
      
      subject = `Deal Update: ${data.dealTitle} moved to ${newLabel}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Deal Stage Update</h2>
          <p>Hi ${data.recipientName || "there"},</p>
          <p>Your deal <strong>"${data.dealTitle}"</strong> has moved from 
            <span style="background: #f0f0f0; padding: 2px 8px; border-radius: 4px;">${oldLabel}</span> 
            to 
            <span style="background: #4f46e5; color: white; padding: 2px 8px; border-radius: 4px;">${newLabel}</span>
          </p>
          <p>Keep up the great work on your investment journey!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #666; font-size: 12px;">This notification was sent from your REI Dashboard</p>
        </div>
      `;
    } else if (data.type === "property_milestone") {
      subject = `Property Milestone: ${data.propertyAddress}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Property Milestone Reached! 🎉</h2>
          <p>Hi ${data.recipientName || "there"},</p>
          <p>Great news! Your property at <strong>${data.propertyAddress}</strong> has hit a milestone:</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-size: 18px; color: #4f46e5;"><strong>${data.milestone}</strong></p>
          </div>
          <p>Keep building your portfolio!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #666; font-size: 12px;">This notification was sent from your REI Dashboard</p>
        </div>
      `;
    }

    console.log("Sending notification email to:", data.recipientEmail);

    const emailResponse = await resend.emails.send({
      from: "REI Dashboard <onboarding@resend.dev>",
      to: [data.recipientEmail],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
