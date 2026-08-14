import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus, ExternalLink } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const weeklyData = [
  { week: "Oct 1", inventory: 1250, dom: 19, pricePerSqft: 235, listToSale: 98, priceCuts: 22, mortgageRate: 6.9 },
  { week: "Oct 8", inventory: 1310, dom: 21, pricePerSqft: 232, listToSale: 97, priceCuts: 25, mortgageRate: 7.1 },
  { week: "Oct 15", inventory: 1380, dom: 23, pricePerSqft: 229, listToSale: 96, priceCuts: 27, mortgageRate: 7.3 },
  { week: "Oct 22", inventory: 1420, dom: 25, pricePerSqft: 227, listToSale: 95, priceCuts: 29, mortgageRate: 7.4 },
];

const countyMetrics = [
  { county: "Franklin", activeListings: 842, medianDOM: 21, avgPricePerSqft: 234, listToSale: 97, priceCuts: 24, rentToPriceRatio: 0.68, trend: "down" },
  { county: "Delaware", activeListings: 312, medianDOM: 18, avgPricePerSqft: 251, listToSale: 98, priceCuts: 19, rentToPriceRatio: 0.62, trend: "up" },
  { county: "Madison", activeListings: 156, medianDOM: 24, avgPricePerSqft: 198, listToSale: 96, priceCuts: 28, rentToPriceRatio: 0.72, trend: "down" },
  { county: "Union", activeListings: 89, medianDOM: 16, avgPricePerSqft: 267, listToSale: 99, priceCuts: 15, rentToPriceRatio: 0.58, trend: "up" },
];

const economicIndicators = [
  { indicator: "Columbus Unemployment Rate", source: "BLS.gov", current: "3.4%", lastMonth: "3.3%", trend: "up", impact: "warning" },
  { indicator: "Job Growth (YoY)", source: "BLS", current: "+1.8%", lastMonth: "+2.0%", trend: "down", impact: "warning" },
  { indicator: "Building Permits Issued", source: "Census", current: "720", lastMonth: "810", trend: "down", impact: "positive" },
  { indicator: "Median Rent", source: "Zillow", current: "$1,845", lastMonth: "$1,830", trend: "up", impact: "positive" },
  { indicator: "Net Migration", source: "USPS/U-Haul", current: "+1.2%", lastMonth: "+1.0%", trend: "up", impact: "positive" },
];

const strategyMatrix: { condition: string; marketType: string; strategy: string; color: BadgeProps["variant"] }[] = [
  { condition: "Inventory ↑ + DOM ↑ + Price cuts ↑", marketType: "Cooling", strategy: "Sell/Wholesale fast; pause new flips", color: "destructive" },
  { condition: "Prices flat + DOM stable + Rents steady", marketType: "Balanced", strategy: "Focus on rentals/refi", color: "secondary" },
  { condition: "Prices ↑ + DOM ↓ + Inventory ↓", marketType: "Expansion", strategy: "Acquire aggressively; full rehabs", color: "default" },
  { condition: "Inventory ↓ but DOM ↑", marketType: "Transition", strategy: "Wait; don't overprice listings", color: "outline" },
];

const dataSources = [
  { source: "Redfin Data Center", description: "County-level stats", link: "https://www.redfin.com/news/data-center/" },
  { source: "Zillow Data Portal", description: "Rent + home price trends", link: "https://www.zillow.com/research/data/" },
  { source: "Altos Research", description: "Weekly market report", link: "https://altosresearch.com/" },
  { source: "Mortgage News Daily", description: "30-year rate", link: "https://www.mortgagenewsdaily.com/mortgage-rates" },
  { source: "BLS Columbus MSA", description: "Employment data", link: "https://www.bls.gov/regions/midwest/" },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <ArrowUp className="h-4 w-4 text-green-600" />;
  if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-yellow-600" />;
};

const getMetricColor = (value: number, metric: string) => {
  if (metric === "priceCuts" || metric === "dom") {
    if (value > 25) return "text-red-600";
    if (value > 20) return "text-yellow-600";
    return "text-green-600";
  }
  if (metric === "listToSale") {
    if (value >= 98) return "text-green-600";
    if (value >= 96) return "text-yellow-600";
    return "text-red-600";
  }
  return "text-foreground";
};

export default function MarketTrendsPage() {
  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Market Trend Tracker</h1>
            <p className="text-muted-foreground">Real-time market intelligence and strategic insights</p>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary Dashboard</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Tracker</TabsTrigger>
              <TabsTrigger value="economic">Economic Indicators</TabsTrigger>
              <TabsTrigger value="strategy">Strategy Notes</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>County Market Summary</CardTitle>
                  <CardDescription>Current market metrics across target counties</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>County</TableHead>
                        <TableHead>Active Listings</TableHead>
                        <TableHead>Median DOM</TableHead>
                        <TableHead>Avg $/SqFt</TableHead>
                        <TableHead>List-to-Sale %</TableHead>
                        <TableHead>Price Cuts %</TableHead>
                        <TableHead>Rent-to-Price Ratio</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {countyMetrics.map((row) => (
                        <TableRow key={row.county}>
                          <TableCell className="font-medium">{row.county}</TableCell>
                          <TableCell>{row.activeListings}</TableCell>
                          <TableCell className={getMetricColor(row.medianDOM, "dom")}>{row.medianDOM}</TableCell>
                          <TableCell>${row.avgPricePerSqft}</TableCell>
                          <TableCell className={getMetricColor(row.listToSale, "listToSale")}>{row.listToSale}%</TableCell>
                          <TableCell className={getMetricColor(row.priceCuts, "priceCuts")}>{row.priceCuts}%</TableCell>
                          <TableCell>{row.rentToPriceRatio}</TableCell>
                          <TableCell><TrendIcon trend={row.trend} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory vs Days on Market</CardTitle>
                    <CardDescription>Supply pressure indicator</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="inventory" stroke="hsl(var(--primary))" name="Inventory" />
                        <Line yAxisId="right" type="monotone" dataKey="dom" stroke="hsl(var(--destructive))" name="DOM" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Price per SqFt Trend</CardTitle>
                    <CardDescription>Market pricing direction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="pricePerSqft" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="$/SqFt" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>List-to-Sale Ratio</CardTitle>
                    <CardDescription>Seller pricing power</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[90, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="listToSale" stroke="hsl(var(--chart-2))" name="List-to-Sale %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Price Cuts & Mortgage Rate</CardTitle>
                    <CardDescription>Market stress indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="priceCuts" stroke="hsl(var(--destructive))" name="Price Cuts %" />
                        <Line yAxisId="right" type="monotone" dataKey="mortgageRate" stroke="hsl(var(--chart-3))" name="30-Yr Rate %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Data Table</CardTitle>
                  <CardDescription>Detailed weekly metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Median DOM</TableHead>
                        <TableHead>Avg $/SqFt</TableHead>
                        <TableHead>List-to-Sale</TableHead>
                        <TableHead>Price Cuts %</TableHead>
                        <TableHead>30-Yr Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklyData.map((row) => (
                        <TableRow key={row.week}>
                          <TableCell className="font-medium">{row.week}</TableCell>
                          <TableCell>{row.inventory}</TableCell>
                          <TableCell>{row.dom}</TableCell>
                          <TableCell>${row.pricePerSqft}</TableCell>
                          <TableCell>{row.listToSale}%</TableCell>
                          <TableCell>{row.priceCuts}%</TableCell>
                          <TableCell>{row.mortgageRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="economic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Economic Indicators</CardTitle>
                  <CardDescription>Key market fundamentals affecting real estate</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicator</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Last Month</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {economicIndicators.map((row) => (
                        <TableRow key={row.indicator}>
                          <TableCell className="font-medium">{row.indicator}</TableCell>
                          <TableCell>{row.source}</TableCell>
                          <TableCell>{row.current}</TableCell>
                          <TableCell>{row.lastMonth}</TableCell>
                          <TableCell><TrendIcon trend={row.trend} /></TableCell>
                          <TableCell>
                            {row.impact === "positive" && <Badge variant="default">Positive</Badge>}
                            {row.impact === "warning" && <Badge variant="destructive">Warning</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Strategy Matrix</CardTitle>
                  <CardDescription>Action plan based on market conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strategyMatrix.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{item.condition}</h3>
                        <Badge variant={item.color}>{item.marketType}</Badge>
                      </div>
                      <p className="text-muted-foreground">{item.strategy}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Source Links</CardTitle>
                  <CardDescription>Quick access to market data providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dataSources.map((source) => (
                      <a
                        key={source.source}
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold">{source.source}</h3>
                          <p className="text-sm text-muted-foreground">{source.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
}
