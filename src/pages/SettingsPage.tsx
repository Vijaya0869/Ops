import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Bell, 
  DollarSign, 
  Percent, 
  Calculator, 
  Building2,
  Save
} from "lucide-react";

const SettingsPage = () => {
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

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dealAlerts, setDealAlerts] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Display Preferences
  const [defaultView, setDefaultView] = useState("dashboard");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [showDecimals, setShowDecimals] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to the database
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="flex min-h-screen">
      <Navigation />
      
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

          {/* Notification Preferences */}
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gold-gradient">
                  <Bell className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Notifications</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage how you receive updates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator className="bg-panel" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Deal Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified about deal stage changes</p>
                </div>
                <Switch checked={dealAlerts} onCheckedChange={setDealAlerts} />
              </div>
              <Separator className="bg-panel" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Payment Reminders</Label>
                  <p className="text-xs text-muted-foreground">Reminders for lender payments due</p>
                </div>
                <Switch checked={paymentReminders} onCheckedChange={setPaymentReminders} />
              </div>
              <Separator className="bg-panel" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Receive weekly portfolio summary</p>
                </div>
                <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
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
    </div>
  );
};

export default SettingsPage;