import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import * as profilesService from "@/services/profiles.service";
import {
  Bell,
  DollarSign,
  Percent,
  Calculator,
  Building2,
  Save,
  Loader2
} from "lucide-react";

const NOTIFICATION_EVENTS = [
  { value: "new_deal", label: "New Deal Created", description: "When a new deal is added to your pipeline" },
  { value: "deal_stage_change", label: "Deal Stage Changed", description: "When one of your deals moves to a new stage" },
  { value: "property_sold", label: "Property Sold", description: "When one of your properties is marked sold" },
  { value: "property_acquired", label: "Property Acquired", description: "When you acquire a new property" },
] as const;

const SettingsPage = () => {
  const { user } = useAuth();
  const [emailEvents, setEmailEvents] = useState<string[]>([]);
  const [slackEvents, setSlackEvents] = useState<string[]>([]);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmailEvents(user.emailNotificationEvents || []);
    setSlackEvents(user.slackNotificationEvents || []);
    setSlackWebhookUrl(user.slackWebhookUrl || "");
  }, [user]);

  const toggleEvent = (
    channel: "email" | "slack",
    event: string,
    enabled: boolean
  ) => {
    const setter = channel === "email" ? setEmailEvents : setSlackEvents;
    setter((prev) => (enabled ? [...prev, event] : prev.filter((e) => e !== event)));
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await profilesService.upsertProfile({
        email_notification_events: emailEvents,
        slack_notification_events: slackEvents,
        slack_webhook_url: slackWebhookUrl.trim() || null,
      });
      toast.success("Notification settings saved");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Failed to save notification settings");
    } finally {
      setSavingNotifications(false);
    }
  };
  // Deal Analysis Preferences
  const [defaultMinROI, setDefaultMinROI] = useState("15");
  const [defaultMinSpread, setDefaultMinSpread] = useState("25000");
  const [maoPercentage, setMaoPercentage] = useState("70");
  const [defaultRehabBuffer, setDefaultRehabBuffer] = useState("10");
  const [defaultHoldingPeriod, setDefaultHoldingPeriod] = useState("6");

  // Financial Preferences
  const [defaultInterestRate, setDefaultInterestRate] = useState("12");
  const [defaultClosingCosts, setDefaultClosingCosts] = useState("3");
  const [defaultSellingCosts, setDefaultSellingCosts] = useState("8");
  const [currency, setCurrency] = useState("USD");

  // Display Preferences
  const [defaultView, setDefaultView] = useState("dashboard");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [showDecimals, setShowDecimals] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to the database
    toast.success("Settings saved successfully!");
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Configure your dashboard preferences and default values
            </p>
          </div>

          {/* Deal Analysis Preferences */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gold-gradient">
                  <Calculator className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Deal Analysis Defaults</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Set default values for analyzing new deals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minROI" className="text-muted-foreground">Minimum ROI Target (%)</Label>
                  <Input
                    id="minROI"
                    type="number"
                    value={defaultMinROI}
                    onChange={(e) => setDefaultMinROI(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Deals below this ROI will be flagged</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minSpread" className="text-muted-foreground">Minimum Spread ($)</Label>
                  <Input
                    id="minSpread"
                    type="number"
                    value={defaultMinSpread}
                    onChange={(e) => setDefaultMinSpread(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Minimum profit spread required</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maoPercentage" className="text-muted-foreground">MAO Percentage (%)</Label>
                  <Input
                    id="maoPercentage"
                    type="number"
                    value={maoPercentage}
                    onChange={(e) => setMaoPercentage(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Maximum Allowable Offer as % of ARV</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rehabBuffer" className="text-muted-foreground">Rehab Cost Buffer (%)</Label>
                  <Input
                    id="rehabBuffer"
                    type="number"
                    value={defaultRehabBuffer}
                    onChange={(e) => setDefaultRehabBuffer(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Buffer added to rehab estimates</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holdingPeriod" className="text-muted-foreground">Default Holding Period (months)</Label>
                  <Input
                    id="holdingPeriod"
                    type="number"
                    value={defaultHoldingPeriod}
                    onChange={(e) => setDefaultHoldingPeriod(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Expected project duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Preferences */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gold-gradient">
                  <DollarSign className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Financial Defaults</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Default rates and costs for calculations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="text-muted-foreground">Default Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={defaultInterestRate}
                    onChange={(e) => setDefaultInterestRate(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Hard money / private lending rate</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingCosts" className="text-muted-foreground">Closing Costs (%)</Label>
                  <Input
                    id="closingCosts"
                    type="number"
                    step="0.1"
                    value={defaultClosingCosts}
                    onChange={(e) => setDefaultClosingCosts(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Purchase closing costs as % of price</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingCosts" className="text-muted-foreground">Selling Costs (%)</Label>
                  <Input
                    id="sellingCosts"
                    type="number"
                    step="0.1"
                    value={defaultSellingCosts}
                    onChange={(e) => setDefaultSellingCosts(e.target.value)}
                    className="bg-panel border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Agent fees + closing costs on sale</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-muted-foreground">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-panel border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gold-gradient">
                  <Bell className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Notification Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose which updates on your own data you want to be notified about
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-[1fr,auto,auto] items-center gap-x-6 gap-y-1">
                <span />
                <span className="text-xs font-semibold text-muted-foreground text-center">Email</span>
                <span className="text-xs font-semibold text-muted-foreground text-center">Slack</span>

                {NOTIFICATION_EVENTS.map((event, index) => (
                  <div className="contents" key={event.value}>
                    <div className={index > 0 ? "pt-4" : undefined}>
                      <Label className="text-foreground">{event.label}</Label>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                    <div className={`flex justify-center ${index > 0 ? "pt-4" : ""}`}>
                      <Switch
                        checked={emailEvents.includes(event.value)}
                        onCheckedChange={(checked) => toggleEvent("email", event.value, checked)}
                      />
                    </div>
                    <div className={`flex justify-center ${index > 0 ? "pt-4" : ""}`}>
                      <Switch
                        checked={slackEvents.includes(event.value)}
                        onCheckedChange={(checked) => toggleEvent("slack", event.value, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-panel" />

              <div className="space-y-2 pt-2">
                <Label htmlFor="slackWebhookUrl" className="text-foreground">Slack Webhook URL</Label>
                <Input
                  id="slackWebhookUrl"
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  className="bg-panel border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Optional — if set, the events above are also posted to this Slack channel. Create one at{" "}
                  <a
                    href="https://api.slack.com/apps"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent underline"
                  >
                    api.slack.com/apps
                  </a>{" "}
                  → your app → Incoming Webhooks.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="gold" onClick={handleSaveNotifications} disabled={savingNotifications}>
                  {savingNotifications ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gold-gradient">
                  <Building2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Display Preferences</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Customize how data is displayed
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultView" className="text-muted-foreground">Default Landing Page</Label>
                  <Select value={defaultView} onValueChange={setDefaultView}>
                    <SelectTrigger className="bg-panel border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="properties">Properties</SelectItem>
                      <SelectItem value="deals">Deals</SelectItem>
                      <SelectItem value="financials">Financials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat" className="text-muted-foreground">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger className="bg-panel border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Show Decimal Places</Label>
                  <p className="text-xs text-muted-foreground">Display cents in currency values</p>
                </div>
                <Switch checked={showDecimals} onCheckedChange={setShowDecimals} />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="gold" size="lg" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
  );
};

export default SettingsPage;