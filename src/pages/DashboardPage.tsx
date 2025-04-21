import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, Users, Clock, DollarSign, Leaf } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  const currentTime = new Date();
  const hours = currentTime.getHours();
  
  let greeting;
  if (hours < 12) {
    greeting = 'Good morning';
  } else if (hours < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}, {user.name}</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/20</div>
            <p className="text-xs text-muted-foreground">
              +2 compared to yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Orders</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234</div>
            <p className="text-xs text-muted-foreground">
              +8% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Reservations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Next at 7:30 PM
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="thisWeek">This Week</TabsTrigger>
          <TabsTrigger value="thisMonth">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Orders from the last few hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Table 5</p>
                      <p className="text-sm text-muted-foreground">3 items - $68.50</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                      <span className="text-xs">In progress</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Table 8</p>
                      <p className="text-sm text-muted-foreground">5 items - $94.75</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-xs">Served</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Table 2</p>
                      <p className="text-sm text-muted-foreground">2 items - $32.00</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs">New</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>Ingredients that need to be restocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Leaf className="h-5 w-5 text-red-500" />
                      <p className="font-medium">Fresh Basil</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500">Critical</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Leaf className="h-5 w-5 text-amber-500" />
                      <p className="font-medium">Tomatoes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-500">Low</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Leaf className="h-5 w-5 text-amber-500" />
                      <p className="font-medium">Mozzarella</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-500">Low</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Alert>
              <AlertDescription>
                <div className="font-medium">Today's specials: Mushroom Risotto, Grilled Sea Bass, and Tiramisu</div>
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        <TabsContent value="thisWeek" className="space-y-4">
          <h3 className="text-lg font-medium">Weekly statistics will appear here</h3>
        </TabsContent>
        <TabsContent value="thisMonth" className="space-y-4">
          <h3 className="text-lg font-medium">Monthly statistics will appear here</h3>
        </TabsContent>
      </Tabs>
    </div>
  );
}